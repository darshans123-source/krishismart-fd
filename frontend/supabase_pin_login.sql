-- KrishiSmart AI — Fast Name + 4-digit PIN login
-- Run this ONCE in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- It creates ONE table and TWO functions. No existing table is changed.
-- PINs are NEVER stored in plain text: only a salted SHA-256 hash.
-- Row Level Security is ON with no policies, so nobody can read the
-- table directly from the app — only these SECURITY DEFINER functions
-- (called via supabase.rpc) can register / verify a PIN.
-- After running this, Vercel needs no redeploy for PIN login to work,
-- but the site must already have VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.

create extension if not exists pgcrypto;

create table if not exists public.farmer_pin_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_key text not null unique,
  pin_salt text not null,
  pin_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.farmer_pin_accounts enable row level security;

create or replace function public.register_farmer_pin(p_name text, p_pin text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := btrim(coalesce(p_name, ''));
  v_key text := lower(v_name);
  v_salt text;
  v_hash text;
begin
  if char_length(v_name) < 2 then
    return jsonb_build_object('success', false, 'error', 'Please enter your full name.');
  end if;
  if p_pin is null or p_pin !~ '^[0-9]{4}$' then
    return jsonb_build_object('success', false, 'error', 'PIN must be exactly 4 digits.');
  end if;
  if exists (select 1 from public.farmer_pin_accounts where name_key = v_key) then
    return jsonb_build_object('success', false, 'error', 'This name already has a PIN. Use Login with PIN instead.');
  end if;
  v_salt := encode(gen_random_bytes(16), 'hex');
  v_hash := encode(digest(convert_to(v_salt || p_pin, 'UTF8'), 'sha256'), 'hex');
  insert into public.farmer_pin_accounts (name, name_key, pin_salt, pin_hash)
  values (v_name, v_key, v_salt, v_hash);
  return jsonb_build_object('success', true, 'name', v_name);
end;
$$;

create or replace function public.verify_farmer_pin(p_name text, p_pin text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text := lower(btrim(coalesce(p_name, '')));
  v_row public.farmer_pin_accounts%rowtype;
  v_hash text;
begin
  if p_pin is null or p_pin !~ '^[0-9]{4}$' then
    return jsonb_build_object('success', false, 'error', 'PIN must be exactly 4 digits.');
  end if;
  select * into v_row from public.farmer_pin_accounts where name_key = v_key;
  if not found then
    return jsonb_build_object('success', false, 'error', 'No PIN account found for this name. Create a PIN account first.');
  end if;
  v_hash := encode(digest(convert_to(v_row.pin_salt || p_pin, 'UTF8'), 'sha256'), 'hex');
  if v_hash <> v_row.pin_hash then
    return jsonb_build_object('success', false, 'error', 'Wrong PIN. Try again.');
  end if;
  return jsonb_build_object('success', true, 'name', v_row.name);
end;
$$;

grant execute on function public.register_farmer_pin(text, text) to anon, authenticated;
grant execute on function public.verify_farmer_pin(text, text) to anon, authenticated;

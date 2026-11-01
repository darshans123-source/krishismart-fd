import { supabase } from '../supabase';

// Fast Name + 4-digit PIN login, verified server-side in Supabase.
// The PIN is checked by a SECURITY DEFINER Postgres function against a
// salted SHA-256 hash — the app never sees the hash, and no PIN is ever
// stored in plain text or in localStorage. If the SQL file has not been
// run yet, Supabase returns a function-not-found error, which we turn
// into a clear setup message instead of a fake login.

export interface PinAccount {
  name: string;
}

const notSetupError = new Error(
  'PIN login is not set up in Supabase yet. Run frontend/supabase_pin_login.sql in Supabase SQL Editor once, then try again.'
);

function validate(name: string, pin: string): string {
  const cleanName = name.trim();
  if (cleanName.length < 2) throw new Error('Please enter your full name.');
  if (!/^[0-9]{4}$/.test(pin)) throw new Error('PIN must be exactly 4 digits.');
  return cleanName;
}

function isFunctionMissing(error: any): boolean {
  const msg = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '');
  return code === 'PGRST202' || code === '404' || msg.includes('could not find the function') || msg.includes('not found');
}

async function callPinFunction(fn: 'register_farmer_pin' | 'verify_farmer_pin', name: string, pin: string): Promise<PinAccount> {
  const cleanName = validate(name, pin);
  const rpc = (supabase as any).rpc;
  if (typeof rpc !== 'function') {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel and redeploy.');
  }
  const { data, error } = await supabase.rpc(fn, { p_name: cleanName, p_pin: pin });
  if (error) {
    if (isFunctionMissing(error)) throw notSetupError;
    throw new Error(error.message || 'PIN login failed. Please try again.');
  }
  const result = data as any;
  if (!result || result.success !== true) {
    throw new Error(result?.error || 'PIN login failed. Please try again.');
  }
  return { name: result.name || cleanName };
}

export const registerPinAccount = (name: string, pin: string) => callPinFunction('register_farmer_pin', name, pin);
export const verifyPinLogin = (name: string, pin: string) => callPinFunction('verify_farmer_pin', name, pin);

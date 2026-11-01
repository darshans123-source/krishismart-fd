import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // PKCE flow (Supabase default, made explicit): Google returns a
        // ?code= to the SAME origin that started login, and supabase-js
        // exchanges it using the code verifier stored in that origin's
        // localStorage. Redirecting to a different origin would lose the
        // verifier and break login — so AuthModal must use
        // window.location.origin, never a hardcoded different domain.
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : ({
      auth: {
        setSession: async () => ({}),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
        signInWithOAuth: async () => ({ data: null, error: new Error("Supabase is not configured.") }),
        signInWithPassword: async () => ({ data: null, error: new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel and redeploy.") }),
        signUp: async () => ({ data: null, error: new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel and redeploy.") }),
        resetPasswordForEmail: async () => ({ data: null, error: new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel and redeploy.") }),
        getUser: async () => ({ data: { user: null }, error: null })
      },
      channel: () => ({
        on: () => ({
          subscribe: () => ({})
        }),
        unsubscribe: () => {}
      }),
      removeChannel: () => {},
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            order: () => ({
              limit: async () => ({ data: [], error: null }),
              then: (cb: any) => cb({ data: [], error: null })
            }),
            then: (cb: any) => cb({ data: [], error: null })
          }),
          order: () => ({
            limit: () => ({
              then: (cb: any) => cb({ data: [], error: null })
            }),
            then: (cb: any) => cb({ data: [], error: null })
          }),
          then: (cb: any) => cb({ data: [], error: null })
        }),
        upsert: async () => ({ data: null, error: null }),
        insert: async () => ({ data: null, error: null }),
        update: async () => ({ data: null, error: null })
      })
    } as any);


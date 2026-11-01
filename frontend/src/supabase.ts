import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
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


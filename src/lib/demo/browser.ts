// Browser-side demo shim. Deliberately tiny and free of any import of the demo
// dataset, so none of it ships in the client bundle. The browser only ever
// touches Supabase for OAuth and storage uploads, both of which are handled
// locally in demo mode (see lib/upload.ts).

const unavailable = { message: "Not available in demo mode." };

export function createDemoBrowserClient() {
  return {
    from: () => {
      throw new Error("Demo mode: the browser does not query the database.");
    },
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
      signInWithOAuth: async () => ({ data: {}, error: unavailable }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    storage: {
      from: () => ({
        upload: async (path: string) => ({ data: { path }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
        createSignedUrl: async (path: string) => ({
          data: { signedUrl: path },
          error: null,
        }),
        remove: async () => ({ data: [], error: null }),
      }),
    },
  };
}

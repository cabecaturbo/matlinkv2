// Server-side Supabase client (Server Components, Route Handlers, Server Actions).
// Reads/writes the auth session from cookies via @supabase/ssr.
//
// In demo mode (no Supabase env configured) this returns an in-memory
// stand-in instead, so the whole app runs with no backend and no logins.
// See lib/demo/.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { DEMO_MODE } from "@/lib/demo/mode";
import { createDemoClient } from "@/lib/demo/db";
import { demoUser } from "@/lib/demo/session";

export async function createClient(): Promise<SupabaseClient<Database>> {
  if (DEMO_MODE) {
    return createDemoClient(await demoUser()) as unknown as SupabaseClient<Database>;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore when the
            // middleware (updateSession) is responsible for refreshing cookies.
          }
        },
      },
    },
  );
}

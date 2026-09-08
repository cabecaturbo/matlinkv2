// Browser (client component) Supabase client. RLS enforces all access; the
// publishable key is safe to ship to the browser.
//
// In demo mode there is no Supabase project, so this returns the in-memory
// stand-in — enough for the browser's only two uses (OAuth + storage uploads)
// to no-op cleanly instead of throwing.
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { DEMO_MODE } from "@/lib/demo/mode";
import { createDemoBrowserClient } from "@/lib/demo/browser";

export function createClient(): SupabaseClient<Database> {
  if (DEMO_MODE) {
    return createDemoBrowserClient() as unknown as SupabaseClient<Database>;
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

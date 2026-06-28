import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireGym } from "@/lib/auth";
import type { Database } from "@/lib/supabase/database.types";

type GymProfile = Database["public"]["Tables"]["gym_profiles"]["Row"];

/** The current gym's profile row, creating an empty one if none exists. */
export async function getOrCreateGymProfile() {
  const { user } = await requireGym();
  const supabase = await createClient();

  const existing = await supabase
    .from("gym_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  let profile = existing.data;
  if (!profile) {
    const created = await supabase
      .from("gym_profiles")
      .insert({ user_id: user.id })
      .select("*")
      .single();
    if (created.error) throw created.error;
    profile = created.data;
  }
  return { userId: user.id, supabase, profile: profile as GymProfile };
}

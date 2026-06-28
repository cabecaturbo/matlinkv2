"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateGymProfile } from "@/lib/gym";
import { gymProfileSchema } from "@/lib/validation/profile";

export type SaveState = { ok?: boolean; error?: string };

const nn = (v: string | undefined | null) => (v ? v : null);

export async function saveGymProfile(input: unknown): Promise<SaveState> {
  const parsed = gymProfileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { supabase, profile } = await getOrCreateGymProfile();
  const d = parsed.data;
  const { error } = await supabase
    .from("gym_profiles")
    .update({
      gym_name: nn(d.gym_name),
      location_country: nn(d.location_country),
      location_city: nn(d.location_city),
      website: nn(d.website),
      looking_for: nn(d.looking_for),
    })
    .eq("id", profile.id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/gym/profile");
  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { sendVerificationEmail } from "@/lib/email";
import type { Database } from "@/lib/supabase/database.types";

type ProfileStatus = Database["public"]["Enums"]["profile_status"];
type VerificationStatus = Database["public"]["Enums"]["verification_status"];
export type ActionState = { error?: string };

async function athleteEmail(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data } = await supabase.from("users").select("email").eq("id", userId).maybeSingle();
  return data?.email ?? null;
}

export async function approveAthlete(profileId: string): Promise<ActionState> {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { data: prof } = await supabase
    .from("athlete_profiles")
    .select("user_id")
    .eq("id", profileId)
    .single();

  const { error } = await supabase
    .from("athlete_profiles")
    .update({
      verification_status: "verified",
      verified_at: new Date().toISOString(),
      verified_by: user.id,
      rejection_reason: null,
    })
    .eq("id", profileId);
  if (error) return { error: error.message };

  if (prof?.user_id) {
    await sendVerificationEmail(await athleteEmail(supabase, prof.user_id), "approved");
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/athletes/${profileId}`);
  return {};
}

export async function rejectAthlete(
  profileId: string,
  reason: string,
): Promise<ActionState> {
  await requireAdmin();
  const trimmed = reason.trim();
  if (trimmed.length < 4) return { error: "Add a short reason so the athlete can fix it." };

  const supabase = await createClient();
  const { data: prof } = await supabase
    .from("athlete_profiles")
    .select("user_id")
    .eq("id", profileId)
    .single();

  const { error } = await supabase
    .from("athlete_profiles")
    .update({
      verification_status: "rejected",
      rejection_reason: trimmed,
      verified_at: null,
      verified_by: null,
    })
    .eq("id", profileId);
  if (error) return { error: error.message };

  if (prof?.user_id) {
    await sendVerificationEmail(await athleteEmail(supabase, prof.user_id), "rejected", trimmed);
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/athletes/${profileId}`);
  return {};
}

export async function setProfileStatus(
  profileId: string,
  status: ProfileStatus,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("athlete_profiles")
    .update({ status })
    .eq("id", profileId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return {};
}

export async function setVerification(
  profileId: string,
  status: VerificationStatus,
): Promise<ActionState> {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("athlete_profiles")
    .update({
      verification_status: status,
      verified_at: status === "verified" ? new Date().toISOString() : null,
      verified_by: status === "verified" ? user.id : null,
    })
    .eq("id", profileId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return {};
}

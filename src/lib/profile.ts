import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import type { Database } from "@/lib/supabase/database.types";

type AthleteProfile = Database["public"]["Tables"]["athlete_profiles"]["Row"];

/** The current athlete's profile row, creating a draft if none exists. */
export async function getOrCreateMyProfile() {
  const { user } = await requireUser();
  const supabase = await createClient();

  const existing = await supabase
    .from("athlete_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  let profile = existing.data;
  if (!profile) {
    const created = await supabase
      .from("athlete_profiles")
      .insert({ user_id: user.id })
      .select("*")
      .single();
    if (created.error) throw created.error;
    profile = created.data;
  }
  return { userId: user.id, supabase, profile: profile as AthleteProfile };
}

/** Full profile bundle (profile + contact + repeaters) for the wizard. */
export async function getFullProfile() {
  const { userId, supabase, profile } = await getOrCreateMyProfile();

  const [contacts, results, links, references, docs] = await Promise.all([
    supabase.from("athlete_contacts").select("*").eq("profile_id", profile.id).maybeSingle(),
    supabase.from("athlete_results").select("*").eq("profile_id", profile.id).order("sort_order"),
    supabase.from("athlete_links").select("*").eq("profile_id", profile.id).order("created_at"),
    supabase.from("athlete_references").select("*").eq("profile_id", profile.id).order("created_at"),
    supabase.from("verification_docs").select("id, doc_type").eq("profile_id", profile.id).order("created_at"),
  ]);

  // Attach each reference's private contact (owner-readable) so it survives reloads.
  const refRows = references.data ?? [];
  const refIds = refRows.map((r) => r.id);
  const contactByRef = new Map<string, string | null>();
  if (refIds.length) {
    const rc = await supabase
      .from("athlete_reference_contacts")
      .select("reference_id, contact")
      .in("reference_id", refIds);
    for (const row of rc.data ?? []) contactByRef.set(row.reference_id, row.contact);
  }

  return {
    userId,
    profile,
    contact: contacts.data,
    results: results.data ?? [],
    links: links.data ?? [],
    references: refRows.map((r) => ({ ...r, contact: contactByRef.get(r.id) ?? null })),
    docs: docs.data ?? [],
  };
}

export type ProfileBundle = Awaited<ReturnType<typeof getFullProfile>>;

/** Pure: derive the completion snapshot the progress UI needs. */
export function buildSnapshot(b: ProfileBundle) {
  return {
    full_name: b.profile.full_name,
    photo_url: b.profile.photo_url,
    nationality: b.profile.nationality,
    location_country: b.profile.location_country,
    belt: b.profile.belt,
    years_training: b.profile.years_training,
    headline: b.profile.headline,
    credentials_consent: b.profile.credentials_consent,
    whatsapp_e164: b.contact?.whatsapp_e164 ?? null,
    resultsCount: b.results.length,
    linksCount: b.links.length,
    referencesCount: b.references.length,
    highlights: b.profile.highlights,
  };
}

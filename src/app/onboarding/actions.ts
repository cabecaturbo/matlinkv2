"use server";

import { redirect } from "next/navigation";
import { getOrCreateMyProfile } from "@/lib/profile";
import {
  identitySchema,
  credentialsSchema,
  recordSchema,
  offerSchema,
  referencesSchema,
  contactSchema,
} from "@/lib/validation/profile";
import { canSubmit } from "@/lib/onboarding/progress";

export type SaveState = { ok?: boolean; error?: string };

const nn = (v: string | undefined | null) => (v ? v : null);

export async function saveIdentity(input: unknown): Promise<SaveState> {
  const parsed = identitySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase, profile } = await getOrCreateMyProfile();
  const d = parsed.data;
  const { error } = await supabase
    .from("athlete_profiles")
    .update({
      full_name: nn(d.full_name),
      photo_url: nn(d.photo_url),
      cover_url: nn(d.cover_url),
      dob: nn(d.dob),
      nationality: nn(d.nationality),
      location_country: nn(d.location_country),
      location_city: nn(d.location_city),
      languages: d.languages,
    })
    .eq("id", profile.id);
  return error ? { error: error.message } : { ok: true };
}

export async function saveCredentials(input: unknown): Promise<SaveState> {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase, profile } = await getOrCreateMyProfile();
  const d = parsed.data;
  const { error } = await supabase
    .from("athlete_profiles")
    .update({
      belt: d.belt ?? null,
      belt_degree: d.belt === "black" ? (d.belt_degree ?? 0) : null,
      years_training: d.years_training ?? null,
      professor: nn(d.professor),
      academy: nn(d.academy),
      ibjjf_number: nn(d.ibjjf_number),
      affiliations: d.affiliations,
    })
    .eq("id", profile.id);
  return error ? { error: error.message } : { ok: true };
}

export async function saveRecord(input: unknown): Promise<SaveState> {
  const parsed = recordSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase, profile } = await getOrCreateMyProfile();
  const d = parsed.data;

  const up = await supabase
    .from("athlete_profiles")
    .update({ highlights: nn(d.highlights) })
    .eq("id", profile.id);
  if (up.error) return { error: up.error.message };

  // replace-all the repeaters
  await supabase.from("athlete_results").delete().eq("profile_id", profile.id);
  if (d.results.length) {
    const ins = await supabase.from("athlete_results").insert(
      d.results.map((r, i) => ({
        profile_id: profile.id,
        competition: r.competition,
        division: nn(r.division),
        year: r.year ?? null,
        placement: nn(r.placement),
        sort_order: i,
      })),
    );
    if (ins.error) return { error: ins.error.message };
  }

  await supabase.from("athlete_links").delete().eq("profile_id", profile.id);
  if (d.links.length) {
    const ins = await supabase.from("athlete_links").insert(
      d.links.map((l) => ({ profile_id: profile.id, type: l.type, url: l.url })),
    );
    if (ins.error) return { error: ins.error.message };
  }
  return { ok: true };
}

export async function saveOffer(input: unknown): Promise<SaveState> {
  const parsed = offerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase, profile } = await getOrCreateMyProfile();
  const d = parsed.data;
  const { error } = await supabase
    .from("athlete_profiles")
    .update({
      headline: nn(d.headline),
      bio: nn(d.bio),
      coaching_focus: d.coaching_focus,
      open_to_relocation: d.open_to_relocation,
      relocation_regions: d.open_to_relocation ? d.relocation_regions : [],
      needs_visa: d.needs_visa,
      availability: d.availability,
      rate_note: nn(d.rate_note),
    })
    .eq("id", profile.id);
  return error ? { error: error.message } : { ok: true };
}

export async function saveReferences(input: unknown): Promise<SaveState> {
  const parsed = referencesSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase, profile } = await getOrCreateMyProfile();
  const d = parsed.data;

  const up = await supabase
    .from("athlete_profiles")
    .update({ credentials_consent: d.credentials_consent })
    .eq("id", profile.id);
  if (up.error) return { error: up.error.message };

  // replace-all references (cascade clears their private contacts)
  await supabase.from("athlete_references").delete().eq("profile_id", profile.id);
  if (d.references.length) {
    const ins = await supabase
      .from("athlete_references")
      .insert(
        d.references.map((r) => ({
          profile_id: profile.id,
          name: r.name,
          relationship: nn(r.relationship),
          note: nn(r.note),
        })),
      )
      .select("id");
    if (ins.error) return { error: ins.error.message };

    const contacts = ins.data
      .map((row, i) => ({ reference_id: row.id, contact: nn(d.references[i].contact) }))
      .filter((c) => c.contact);
    if (contacts.length) {
      const cins = await supabase.from("athlete_reference_contacts").insert(contacts);
      if (cins.error) return { error: cins.error.message };
    }
  }
  return { ok: true };
}

export async function saveContact(input: unknown): Promise<SaveState> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase, profile } = await getOrCreateMyProfile();
  const d = parsed.data;
  const { error } = await supabase.from("athlete_contacts").upsert({
    profile_id: profile.id,
    whatsapp_e164: nn(d.whatsapp_e164),
    public_email: nn(d.public_email),
  });
  return error ? { error: error.message } : { ok: true };
}

export async function addVerificationDoc(
  filePath: string,
  docType: string | null,
): Promise<{ ok?: boolean; id?: string; error?: string }> {
  const { supabase, profile } = await getOrCreateMyProfile();
  const { data, error } = await supabase
    .from("verification_docs")
    .insert({ profile_id: profile.id, file_url: filePath, doc_type: docType })
    .select("id")
    .single();
  return error ? { error: error.message } : { ok: true, id: data.id };
}

export async function removeVerificationDoc(id: string): Promise<SaveState> {
  const { supabase, profile } = await getOrCreateMyProfile();
  const { error } = await supabase
    .from("verification_docs")
    .delete()
    .eq("id", id)
    .eq("profile_id", profile.id);
  return error ? { error: error.message } : { ok: true };
}

/** Publish the profile and request verification (status live + verification pending). */
export async function submitForReview(): Promise<SaveState> {
  const { supabase, profile } = await getOrCreateMyProfile();

  const contact = await supabase
    .from("athlete_contacts")
    .select("whatsapp_e164")
    .eq("profile_id", profile.id)
    .maybeSingle();

  const ready = canSubmit({
    full_name: profile.full_name,
    photo_url: profile.photo_url,
    nationality: profile.nationality,
    location_country: profile.location_country,
    belt: profile.belt,
    years_training: profile.years_training,
    headline: profile.headline,
    credentials_consent: profile.credentials_consent,
    whatsapp_e164: contact.data?.whatsapp_e164 ?? null,
    resultsCount: 0,
    linksCount: 0,
    referencesCount: 0,
    highlights: profile.highlights,
  });
  if (!ready) {
    return {
      error:
        "A few required fields are still missing. Complete the highlighted steps, then submit.",
    };
  }

  const { error } = await supabase
    .from("athlete_profiles")
    .update({ status: "live", verification_status: "pending" })
    .eq("id", profile.id);
  if (error) return { error: error.message };

  redirect("/dashboard?submitted=1");
}

import "server-only";
import { createClient } from "@/lib/supabase/server";

// All reads here run under the admin's session; RLS (private.is_admin) grants
// admin full visibility, including PII (contacts, reference contacts, docs).

export async function getAdminStats() {
  const supabase = await createClient();
  const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();

  const [athletes, verified, pending, gyms, signups] = await Promise.all([
    supabase.from("athlete_profiles").select("*", { count: "exact", head: true }),
    supabase.from("athlete_profiles").select("*", { count: "exact", head: true }).eq("verification_status", "verified"),
    supabase.from("athlete_profiles").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "gym"),
    supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
  ]);

  return {
    athletes: athletes.count ?? 0,
    verified: verified.count ?? 0,
    pending: pending.count ?? 0,
    gyms: gyms.count ?? 0,
    signupsThisWeek: signups.count ?? 0,
  };
}

export async function listPendingProfiles() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("athlete_profiles")
    .select("id, full_name, belt, location_country, ibjjf_number, updated_at")
    .eq("verification_status", "pending")
    .order("updated_at", { ascending: true });
  return data ?? [];
}

export async function getReviewProfile(id: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!profile) return null;

  const [contact, results, links, references, docs, owner] = await Promise.all([
    supabase.from("athlete_contacts").select("*").eq("profile_id", id).maybeSingle(),
    supabase.from("athlete_results").select("*").eq("profile_id", id).order("sort_order"),
    supabase.from("athlete_links").select("*").eq("profile_id", id).order("created_at"),
    supabase.from("athlete_references").select("*").eq("profile_id", id).order("created_at"),
    supabase.from("verification_docs").select("*").eq("profile_id", id).order("created_at"),
    supabase.from("athlete_profiles").select("user_id").eq("id", id).single(),
  ]);

  // Reference private contacts (admin-readable) keyed by reference id.
  const refRows = references.data ?? [];
  const refContacts = new Map<string, string | null>();
  if (refRows.length) {
    const rc = await supabase
      .from("athlete_reference_contacts")
      .select("reference_id, contact")
      .in("reference_id", refRows.map((r) => r.id));
    for (const row of rc.data ?? []) refContacts.set(row.reference_id, row.contact);
  }

  // Signed URLs for private verification docs.
  const docRows = docs.data ?? [];
  const docUrls = await Promise.all(
    docRows.map(async (d) => {
      const { data } = await supabase.storage
        .from("verification-docs")
        .createSignedUrl(d.file_url, 3600);
      return { id: d.id, doc_type: d.doc_type, url: data?.signedUrl ?? null };
    }),
  );

  let email: string | null = null;
  if (owner.data?.user_id) {
    const u = await supabase.from("users").select("email").eq("id", owner.data.user_id).maybeSingle();
    email = u.data?.email ?? null;
  }

  return {
    profile,
    contact: contact.data,
    results: results.data ?? [],
    links: links.data ?? [],
    references: refRows.map((r) => ({ ...r, contact: refContacts.get(r.id) ?? null })),
    docs: docUrls,
    email,
  };
}

export async function listUsers(search: string) {
  const supabase = await createClient();

  // No direct FK between public.users and athlete_profiles (both reference
  // auth.users), so fetch separately and merge by user id.
  let q = supabase
    .from("users")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (search) q = q.ilike("email", `%${search.replace(/[%,]/g, "")}%`);

  const [usersRes, profilesRes] = await Promise.all([
    q,
    supabase
      .from("athlete_profiles")
      .select("id, user_id, status, verification_status, full_name"),
  ]);

  const byUser = new Map((profilesRes.data ?? []).map((p) => [p.user_id, p]));
  return (usersRes.data ?? []).map((u) => ({
    ...u,
    profile: byUser.get(u.id) ?? null,
  }));
}

export type AdminUser = Awaited<ReturnType<typeof listUsers>>[number];

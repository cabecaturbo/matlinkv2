import { notFound } from "next/navigation";
import { MapPin, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { PublicHeader } from "@/components/public-header";
import { VerifiedBadge } from "@/components/profile/verified-badge";
import { BeltPill } from "@/components/profile/belt-pill";
import { BatchId } from "@/components/profile/batch-id";
import { SpecBlock } from "@/components/profile/spec-block";
import { ContactPanel } from "@/components/profile/contact-panel";
import { LINK_TYPES } from "@/lib/constants/profile";
import { beltCode } from "@/lib/format";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="eyebrow mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default async function AthleteProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const session = await getSessionUser();

  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!profile) notFound();

  const [resultsRes, linksRes, refsRes, contactRes] = await Promise.all([
    supabase.from("athlete_results").select("*").eq("profile_id", id).order("sort_order"),
    supabase.from("athlete_links").select("*").eq("profile_id", id).order("created_at"),
    supabase.from("athlete_references").select("*").eq("profile_id", id).order("created_at"),
    supabase.from("athlete_contacts").select("*").eq("profile_id", id).maybeSingle(),
  ]);
  const results = resultsRes.data ?? [];
  const links = linksRes.data ?? [];
  const references = refsRes.data ?? [];
  const contact = contactRes.data;

  const firstName = profile.full_name?.split(" ")[0] ?? "there";
  const location = [profile.location_city, profile.location_country].filter(Boolean).join(", ");
  const linkLabel = (t: string) => LINK_TYPES.find((x) => x.value === t)?.label ?? "Link";

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />

      {/* hero */}
      <div className="relative">
        <div className="h-40 w-full bg-surface-2 sm:h-56">
          {profile.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.cover_url} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="mx-auto max-w-5xl px-6">
          <div className="-mt-14 h-28 w-28 overflow-hidden rounded-lg border-4 border-background bg-surface-2">
            {profile.photo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photo_url}
                alt={profile.full_name ?? ""}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-6">
        <BatchId id={profile.id} belt={profile.belt} degree={profile.belt_degree} />
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {profile.full_name ?? "Athlete"}
          </h1>
          <VerifiedBadge status={profile.verification_status} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <BeltPill belt={profile.belt} degree={profile.belt_degree} />
          {location && (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={14} /> {location}
            </span>
          )}
        </div>
        {profile.headline && (
          <p className="mt-5 max-w-[60ch] text-lg leading-7 text-foreground">
            {profile.headline}
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* main column */}
          <div className="space-y-8 lg:col-span-2">
            <Section title="Spec">
              <SpecBlock
                items={[
                  { label: "Belt", value: beltCode(profile.belt, profile.belt_degree) },
                  {
                    label: "Experience",
                    value: profile.years_training != null ? `${profile.years_training} yrs` : null,
                  },
                  { label: "Team", value: profile.academy },
                  { label: "Professor", value: profile.professor },
                  { label: "IBJJF #", value: profile.ibjjf_number },
                  { label: "Nationality", value: profile.nationality },
                ]}
              />
            </Section>

            {profile.bio && (
              <Section title="About">
                <p className="max-w-[65ch] whitespace-pre-line text-sm leading-6 text-foreground">
                  {profile.bio}
                </p>
              </Section>
            )}

            {profile.highlights && (
              <Section title="Career highlights">
                <p className="max-w-[65ch] whitespace-pre-line text-sm leading-6 text-foreground">
                  {profile.highlights}
                </p>
              </Section>
            )}

            {results.length > 0 && (
              <Section title="Notable results">
                <ul className="divide-y divide-border">
                  {results.map((r) => (
                    <li
                      key={r.id}
                      className="flex flex-wrap items-baseline justify-between gap-2 py-2.5 first:pt-0"
                    >
                      <span className="font-medium text-foreground">
                        {r.competition}
                        {r.division ? <span className="text-muted"> · {r.division}</span> : null}
                      </span>
                      <span className="tnum font-mono text-sm text-muted">
                        {[r.placement, r.year].filter(Boolean).join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {profile.coaching_focus.length > 0 && (
              <Section title="Coaching focus">
                <div className="flex flex-wrap gap-2">
                  {profile.coaching_focus.map((t) => (
                    <span
                      key={t}
                      className="rounded-sm border border-border bg-surface px-3 py-1 text-sm text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {references.length > 0 && (
              <Section title="References">
                <ul className="space-y-3">
                  {references.map((r) => (
                    <li key={r.id}>
                      <p className="text-sm font-medium text-foreground">
                        {r.name}
                        {r.relationship ? <span className="text-muted"> · {r.relationship}</span> : null}
                      </p>
                      {r.note && <p className="max-w-[65ch] text-sm text-muted">{r.note}</p>}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {links.length > 0 && (
              <Section title="Verify independently">
                <div className="flex flex-wrap gap-2">
                  {links.map((l) => (
                    <a
                      key={l.id}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition-colors hover:border-border-strong"
                    >
                      {linkLabel(l.type)}
                      <ExternalLink size={13} className="text-muted" />
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* sticky contact + secondary facts */}
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <ContactPanel
              signedIn={Boolean(session)}
              profileId={profile.id}
              firstName={firstName}
              whatsapp={contact?.whatsapp_e164 ?? null}
              email={contact?.public_email ?? null}
            />
            <div className="rounded-lg border border-border bg-surface p-5">
              <h2 className="eyebrow mb-4">Availability</h2>
              <SpecBlock
                columns={2}
                items={[
                  { label: "Relocation", value: profile.open_to_relocation ? "Open" : "Not now" },
                  { label: "Visa", value: profile.needs_visa ? "Needs sponsor" : "Not needed" },
                ]}
              />
              {profile.availability.length > 0 && (
                <div className="mt-5">
                  <p className="eyebrow">Commitment</p>
                  <p className="mt-1 text-sm text-foreground">{profile.availability.join(", ")}</p>
                </div>
              )}
              {profile.languages.length > 0 && (
                <div className="mt-5">
                  <p className="eyebrow">Languages</p>
                  <p className="mt-1 text-sm text-foreground">{profile.languages.join(", ")}</p>
                </div>
              )}
              {profile.open_to_relocation && profile.relocation_regions.length > 0 && (
                <div className="mt-5">
                  <p className="eyebrow">Open to regions</p>
                  <p className="mt-1 text-sm text-foreground">
                    {profile.relocation_regions.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

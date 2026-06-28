import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { getReviewProfile } from "@/lib/admin";
import { DecisionPanel } from "@/components/admin/decision-panel";
import { BeltPill } from "@/components/profile/belt-pill";
import { VerifiedBadge } from "@/components/profile/verified-badge";
import { LINK_TYPES } from "@/lib/constants/profile";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right text-foreground">{value}</span>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="eyebrow mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getReviewProfile(id);
  if (!data) notFound();
  const { profile, contact, results, links, references, docs, email } = data;
  const linkLabel = (t: string) =>
    LINK_TYPES.find((x) => x.value === t)?.label ?? "Link";

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} /> Back to queue
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {profile.full_name ?? "Unnamed athlete"}
        </h1>
        <VerifiedBadge status={profile.verification_status} />
      </div>
      <div className="mt-3">
        <BeltPill belt={profile.belt} degree={profile.belt_degree} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Block title="Identity">
            <Row label="Email" value={email} />
            <Row label="Nationality" value={profile.nationality} />
            <Row
              label="Location"
              value={[profile.location_city, profile.location_country].filter(Boolean).join(", ")}
            />
            <Row label="Date of birth" value={profile.dob} />
            <Row label="Languages" value={profile.languages.join(", ")} />
          </Block>

          <Block title="Credentials">
            <Row
              label="Years training"
              value={profile.years_training != null ? `${profile.years_training}` : null}
            />
            <Row label="Professor / lineage" value={profile.professor} />
            <Row label="Academy" value={profile.academy} />
            <Row
              label="IBJJF number"
              value={profile.ibjjf_number ? <span className="font-mono">{profile.ibjjf_number}</span> : null}
            />
            <Row label="Affiliations" value={profile.affiliations.join(", ")} />
          </Block>

          <Block title="Public links — verify independently">
            {links.length === 0 ? (
              <p className="text-sm text-muted">No links provided.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {links.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm hover:border-muted-foreground"
                  >
                    {linkLabel(l.type)} <ExternalLink size={13} className="text-muted" />
                  </a>
                ))}
              </div>
            )}
          </Block>

          <Block title="Verification documents">
            {docs.length === 0 ? (
              <p className="text-sm text-muted">No documents uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {docs.map((d) =>
                  d.url ? (
                    <li key={d.id}>
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-foreground underline underline-offset-4 hover:text-accent"
                      >
                        View document <ExternalLink size={13} className="text-muted" />
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            )}
          </Block>

          {(profile.highlights || results.length > 0) && (
            <Block title="Competition record">
              {profile.highlights && (
                <p className="mb-3 whitespace-pre-line text-sm text-foreground">
                  {profile.highlights}
                </p>
              )}
              <ul className="space-y-1.5">
                {results.map((r) => (
                  <li key={r.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-foreground">
                      {r.competition}
                      {r.division ? <span className="text-muted"> · {r.division}</span> : null}
                    </span>
                    <span className="font-mono text-muted">
                      {[r.placement, r.year].filter(Boolean).join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {references.length > 0 && (
            <Block title="References (with private contact)">
              <ul className="space-y-3">
                {references.map((r) => (
                  <li key={r.id} className="text-sm">
                    <p className="font-medium text-foreground">
                      {r.name}
                      {r.relationship ? <span className="text-muted"> · {r.relationship}</span> : null}
                    </p>
                    {r.contact && (
                      <p className="font-mono text-xs text-muted">{r.contact}</p>
                    )}
                    {r.note && <p className="text-muted">{r.note}</p>}
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <DecisionPanel profileId={profile.id} />

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="eyebrow mb-3">Contact (private)</h2>
            <Row label="WhatsApp" value={contact?.whatsapp_e164} />
            <Row label="Email" value={contact?.public_email} />
            <Row label="Profile status" value={profile.status} />
            {profile.rejection_reason && (
              <p className="mt-3 rounded-md border border-border bg-surface-2 p-2 text-xs text-muted">
                Last rejection: {profile.rejection_reason}
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAdminStats, listPendingProfiles } from "@/lib/admin";
import { BeltPill } from "@/components/profile/belt-pill";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="font-display text-3xl font-bold tracking-tight">{value}</div>
      <div className="eyebrow mt-1">{label}</div>
    </div>
  );
}

function waitingSince(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400_000);
  if (days <= 0) return "today";
  return `${days}d ago`;
}

export default async function AdminOverview() {
  const [stats, pending] = await Promise.all([
    getAdminStats(),
    listPendingProfiles(),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Overview
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Athletes" value={stats.athletes} />
        <Stat label="Verified" value={stats.verified} />
        <Stat label="Pending" value={stats.pending} />
        <Stat label="Gyms" value={stats.gyms} />
        <Stat label="Signups / 7d" value={stats.signupsThisWeek} />
      </div>

      <section className="mt-10">
        <h2 className="eyebrow mb-3">Verification queue</h2>
        {pending.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
            Queue clear — no profiles awaiting review.
          </div>
        ) : (
          <ul className="space-y-2">
            {pending.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/athletes/${p.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-muted-foreground"
                >
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold">
                      {p.full_name ?? "Unnamed athlete"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {[p.location_country, p.ibjjf_number ? `IBJJF ${p.ibjjf_number}` : null]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <BeltPill belt={p.belt} />
                    <span className="hidden font-mono text-xs text-muted sm:inline">
                      {waitingSince(p.updated_at)}
                    </span>
                    <ChevronRight size={16} className="text-muted" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

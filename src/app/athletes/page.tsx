import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/public-header";
import {
  FilterPanel,
  AppliedChips,
  SearchSort,
  MobileFilters,
} from "@/components/marketplace/filters";
import { AthleteCard, type CardProfile } from "@/components/marketplace/athlete-card";
import { type Filters, activeFilterCount } from "@/components/marketplace/types";
import { Button } from "@/components/ui/button";
import { BELTS, type Belt } from "@/lib/constants/profile";

const BELT_VALUES: string[] = BELTS.map((b) => b.value);
const BELT_ORDER = new Map<string, number>(BELT_VALUES.map((v, i) => [v, i]));
const csv = (v?: string) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string)) ?? "";

  const filters: Filters = {
    q: get("q"),
    sort: get("sort") || "verified",
    verified: get("verified") === "1",
    belt: csv(get("belt")).filter((b) => BELT_VALUES.includes(b)),
    country: get("country"),
    roles: csv(get("roles")),
    focus: csv(get("focus")),
    region: csv(get("region")),
    lang: csv(get("lang")),
    avail: csv(get("avail")),
    reloc: get("reloc") === "1",
    visa: get("visa") === "1",
    minYears: Number(get("minyears")) || 0,
  };

  const supabase = await createClient();

  let query = supabase
    .from("athlete_profiles")
    .select("*, athlete_results(competition, placement, year, sort_order)")
    .eq("status", "live");

  if (filters.verified) query = query.eq("verification_status", "verified");
  if (filters.belt.length) query = query.in("belt", filters.belt as Belt[]);
  if (filters.country) query = query.eq("location_country", filters.country);
  if (filters.roles.length) query = query.overlaps("roles", filters.roles);
  if (filters.focus.length) query = query.overlaps("coaching_focus", filters.focus);
  if (filters.region.length) query = query.overlaps("relocation_regions", filters.region);
  if (filters.lang.length) query = query.overlaps("languages", filters.lang);
  if (filters.avail.length) query = query.overlaps("availability", filters.avail);
  if (filters.reloc) query = query.eq("open_to_relocation", true);
  if (filters.visa) query = query.eq("needs_visa", true);
  if (filters.minYears > 0) query = query.gte("years_training", filters.minYears);
  if (filters.q) {
    const s = filters.q.replace(/[,()%*]/g, "").trim();
    if (s) query = query.or(`full_name.ilike.*${s}*,academy.ilike.*${s}*,headline.ilike.*${s}*`);
  }
  query = query.order("created_at", { ascending: false });

  // belt facet counts across all live profiles
  const beltsRes = await supabase
    .from("athlete_profiles")
    .select("belt")
    .eq("status", "live");
  const beltCounts: Record<string, number> = {};
  for (const row of beltsRes.data ?? []) {
    if (row.belt) beltCounts[row.belt] = (beltCounts[row.belt] ?? 0) + 1;
  }

  const { data } = await query;
  let athletes = (data ?? []) as CardProfile[];

  if (filters.sort === "belt") {
    athletes = [...athletes].sort(
      (a, b) => (BELT_ORDER.get(b.belt ?? "") ?? -1) - (BELT_ORDER.get(a.belt ?? "") ?? -1),
    );
  } else if (filters.sort === "verified") {
    athletes = [...athletes].sort(
      (a, b) =>
        Number(b.verification_status === "verified") -
        Number(a.verification_status === "verified"),
    );
  }

  const hasFilters = activeFilterCount(filters) > 0 || Boolean(filters.q);

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <p className="eyebrow">Find a coach</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
          Verified BJJ coaches
        </h1>
        <p className="mt-1 text-sm text-muted tnum">
          {athletes.length} {athletes.length === 1 ? "coach" : "coaches"} available
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[256px_1fr]">
          {/* desktop faceted sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <FilterPanel current={filters} beltCounts={beltCounts} />
            </div>
          </aside>

          <div>
            <SearchSort current={filters} />
            <div className="mt-3">
              <MobileFilters
                current={filters}
                beltCounts={beltCounts}
                resultCount={athletes.length}
              />
            </div>

            <div className="mt-4">
              <AppliedChips current={filters} />
            </div>

            {athletes.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {athletes.map((a) => (
                  <AthleteCard key={a.id} profile={a} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-lg border border-border bg-surface p-10 text-center">
                <h2 className="font-display text-xl font-semibold tracking-tight">
                  No coaches match these filters yet
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                  {hasFilters
                    ? "Try widening your region, clearing the verified-only filter, or removing a belt."
                    : "New coaches are joining — check back soon."}
                </p>
                {hasFilters && (
                  <Link href="/athletes" className="mt-5 inline-block">
                    <Button variant="secondary">Clear all filters</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

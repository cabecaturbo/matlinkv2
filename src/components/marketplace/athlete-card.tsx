import Link from "next/link";
import { MapPin, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { VerifiedBadge } from "@/components/profile/verified-badge";
import { BeltPill } from "@/components/profile/belt-pill";
import { BatchId } from "@/components/profile/batch-id";
import type { Database } from "@/lib/supabase/database.types";

type Result = Pick<
  Database["public"]["Tables"]["athlete_results"]["Row"],
  "competition" | "placement" | "year" | "sort_order"
>;
export type CardProfile = Database["public"]["Tables"]["athlete_profiles"]["Row"] & {
  athlete_results: Result[];
};

export function AthleteCard({ profile }: { profile: CardProfile }) {
  const topResult = [...(profile.athlete_results ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  )[0];
  const location = [profile.location_city, profile.location_country]
    .filter(Boolean)
    .join(", ");
  const isVerified = profile.verification_status === "verified";
  const initials = (profile.full_name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <Link
      href={`/athletes/${profile.id}`}
      className={cn(
        "group block overflow-hidden rounded-lg border bg-surface",
        "transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5",
        // verified athletes earn a stronger frame (non-equal-weight grid)
        isVerified
          ? "border-accent/30 hover:border-accent/60"
          : "border-border hover:border-border-strong",
      )}
    >
      <div className="relative aspect-[4/3] bg-surface-2">
        {profile.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photo_url}
            alt={profile.full_name ?? ""}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-4xl font-bold tracking-tight text-muted-foreground">
            {initials}
          </div>
        )}
        {isVerified && (
          <div className="absolute right-3 top-3">
            <VerifiedBadge status="verified" />
          </div>
        )}
      </div>

      <div className="p-5">
        <BatchId id={profile.id} belt={profile.belt} degree={profile.belt_degree} />
        <h3 className="mt-1.5 truncate font-display text-xl font-bold tracking-tight">
          {profile.full_name ?? "Athlete"}
        </h3>

        <div className="mt-3">
          <BeltPill belt={profile.belt} degree={profile.belt_degree} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          {location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} /> {location}
            </span>
          )}
          {profile.years_training != null && (
            <span className="tnum">{profile.years_training} yrs</span>
          )}
          {profile.open_to_relocation && (
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <Plane size={13} /> Open to relocate
            </span>
          )}
        </div>

        {topResult && (
          <div className="mt-4 border-t border-border pt-3">
            <p className="eyebrow">Top result</p>
            <p className="mt-1 truncate text-sm text-foreground">
              {topResult.competition}
              {topResult.placement ? (
                <span className="text-muted"> · {topResult.placement}</span>
              ) : null}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

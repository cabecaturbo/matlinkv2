import type { StepSlug } from "./steps";

// Minimal shape the completion calc needs (subset of the full profile bundle).
export type ProfileSnapshot = {
  full_name: string | null;
  photo_url: string | null;
  nationality: string | null;
  location_country: string | null;
  belt: string | null;
  years_training: number | null;
  headline: string | null;
  credentials_consent: boolean;
  whatsapp_e164: string | null;
  resultsCount: number;
  linksCount: number;
  referencesCount: number;
  highlights: string | null;
};

// Which steps are "done enough" — drives the nav checkmarks and the % bar.
export function stepCompletion(p: ProfileSnapshot): Record<StepSlug, boolean> {
  return {
    identity: Boolean(
      p.full_name && p.photo_url && p.nationality && p.location_country,
    ),
    credentials: Boolean(p.belt && p.years_training != null),
    record: Boolean(p.resultsCount > 0 || p.linksCount > 0 || p.highlights),
    offer: Boolean(p.headline),
    references: Boolean(p.referencesCount > 0 || p.credentials_consent),
    contact: Boolean(p.whatsapp_e164),
  };
}

// Endowed-progress bar (§6A): never show 0% — completing identity alone is real
// progress. Percentage is the share of completed steps.
export function completionPercent(p: ProfileSnapshot): number {
  const done = Object.values(stepCompletion(p)).filter(Boolean).length;
  return Math.round((done / 6) * 100);
}

// The hard requirements to publish + request verification (mirror submitSchema).
export function canSubmit(p: ProfileSnapshot): boolean {
  return Boolean(
    p.full_name &&
      p.photo_url &&
      p.nationality &&
      p.location_country &&
      p.belt &&
      p.years_training != null &&
      p.headline &&
      p.whatsapp_e164 &&
      p.credentials_consent,
  );
}

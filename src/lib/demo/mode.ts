// Demo mode — lets the whole app run with no Supabase project and no logins.
//
// It turns on automatically when there is no Supabase URL configured, so a
// fresh clone (or a Vercel deploy with zero env vars) boots straight into a
// fully-populated, browsable product. Set NEXT_PUBLIC_DEMO_MODE=1 to force it
// on even when Supabase env vars are present.
//
// To go back to the real backend: set the Supabase env vars and leave
// NEXT_PUBLIC_DEMO_MODE unset (or 0). Nothing else in the app changes —
// demo mode is a swap at the Supabase-client seam only.
export const DEMO_MODE =
  process.env.NEXT_PUBLIC_DEMO_MODE === "1" ||
  (process.env.NEXT_PUBLIC_DEMO_MODE !== "0" &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL);

/** Cookie holding "who am I viewing as" while in demo mode. */
export const DEMO_ROLE_COOKIE = "matlink_demo_view";

export type DemoView = "guest" | "athlete" | "gym" | "admin";

/** Signed in as a gym by default: nothing is locked on first load. */
export const DEMO_DEFAULT_VIEW: DemoView = "gym";

export const DEMO_VIEWS: { value: DemoView; label: string; blurb: string }[] = [
  { value: "gym", label: "Gym owner", blurb: "Apex BJJ Dubai — hiring a head coach" },
  { value: "athlete", label: "Athlete", blurb: "Lucas Barbosa — your own profile" },
  { value: "admin", label: "Admin", blurb: "MatLink verification desk" },
  { value: "guest", label: "Signed out", blurb: "What the public sees" },
];

export function isDemoView(v: unknown): v is DemoView {
  return v === "guest" || v === "athlete" || v === "gym" || v === "admin";
}

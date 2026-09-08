// Demo mode — lets the whole app run with no Supabase project and no logins.
//
// ON BY DEFAULT, and opt-out only. This used to switch itself off whenever a
// Supabase URL happened to be present, which meant a stray env var left over
// from a Vercel import silently restored the login walls and emptied the
// marketplace. Deciding it from a variable nobody set is worse than deciding
// it from one someone must set on purpose.
//
// To run against the real Supabase backend, set NEXT_PUBLIC_DEMO_MODE=0 and
// provide the Supabase env vars. Nothing else in the app changes — demo mode
// is a swap at the Supabase-client seam only.
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "0";

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

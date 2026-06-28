import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getFullProfile, buildSnapshot } from "@/lib/profile";
import { getOrCreateGymProfile } from "@/lib/gym";
import { completionPercent } from "@/lib/onboarding/progress";
import { AppHeader } from "@/components/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const VERIFICATION_LABEL: Record<string, string> = {
  unverified: "Self-reported",
  pending: "In review",
  verified: "Verified",
  rejected: "Needs changes",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { user, role } = await requireUser();

  if (role === "athlete") {
    const b = await getFullProfile();
    const pct = completionPercent(buildSnapshot(b));
    const submitted = (await searchParams)?.submitted === "1";
    const isDraft = b.profile.status === "draft";

    return (
      <div className="flex min-h-dvh flex-col">
        <AppHeader role={role} />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
          <p className="eyebrow">Your profile</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {b.profile.full_name || user.email}
          </h1>

          {submitted && (
            <Alert variant="notice" className="mt-6">
              Profile submitted — it&apos;s live and queued for verification. You
              can keep editing anytime.
            </Alert>
          )}

          <Card className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border px-2.5 py-1 font-mono text-xs uppercase text-muted">
                {b.profile.status}
              </span>
              <span className="rounded-full border border-border px-2.5 py-1 font-mono text-xs uppercase text-muted">
                {VERIFICATION_LABEL[b.profile.verification_status]}
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted">Profile completeness</span>
              <span className="font-mono text-foreground">{pct}%</span>
            </div>
            <Progress value={pct} className="mt-2" />

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/onboarding">
                <Button>
                  {isDraft ? "Build your profile" : "Edit your profile"}
                </Button>
              </Link>
              {b.profile.status === "live" && (
                <Link href={`/athletes/${b.profile.id}`}>
                  <Button variant="secondary">View public profile</Button>
                </Link>
              )}
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (role === "gym") {
    const { profile: gym } = await getOrCreateGymProfile();
    const hasGym = Boolean(gym.gym_name);
    return (
      <div className="flex min-h-dvh flex-col">
        <AppHeader role={role} />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
          <p className="eyebrow">Signed in</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {gym.gym_name || user.email}
          </h1>

          <Card className="mt-8">
            <p className="eyebrow">Find your next coach</p>
            <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">
              Browse verified coaches
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Search the marketplace of verified BJJ coaches open to teaching and
              relocating, then reach out directly on WhatsApp.
            </p>
            <Link href="/athletes" className="mt-5 inline-block">
              <Button>Browse coaches</Button>
            </Link>
          </Card>

          <Card className="mt-4">
            <p className="eyebrow">Your gym</p>
            <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">
              {hasGym ? "Edit your gym profile" : "Set up your gym profile"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {hasGym
                ? "Keep your gym details current to build trust with coaches you contact."
                : "A complete profile makes your outreach to coaches more credible. Optional, but encouraged."}
            </p>
            <Link href="/gym/profile" className="mt-5 inline-block">
              <Button variant="secondary">
                {hasGym ? "Edit gym profile" : "Complete gym profile"}
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  // admin
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader role={role} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <p className="eyebrow">Signed in</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          {user.email}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Account type:{" "}
          <span className="font-mono uppercase text-foreground">{role}</span>
        </p>
        <Card className="mt-8">
          <p className="eyebrow">Operations</p>
          <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">
            Review the verification queue
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Open the admin panel to verify athletes and keep the trust bar high.
          </p>
          <Link href="/admin" className="mt-5 inline-block">
            <Button>Open admin</Button>
          </Link>
        </Card>
      </main>
    </div>
  );
}

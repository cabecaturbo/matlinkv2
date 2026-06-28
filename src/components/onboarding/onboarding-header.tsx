import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/wordmark";
import { Progress } from "@/components/ui/progress";
import { STEPS, type StepSlug } from "@/lib/onboarding/steps";
import {
  stepCompletion,
  completionPercent,
  type ProfileSnapshot,
} from "@/lib/onboarding/progress";

export function OnboardingHeader({
  current,
  snapshot,
}: {
  current: StepSlug;
  snapshot: ProfileSnapshot;
}) {
  const done = stepCompletion(snapshot);
  const pct = completionPercent(snapshot);

  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-2xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Wordmark href="/dashboard" />
          <span className="font-mono text-xs text-muted">
            Profile {pct}% complete
          </span>
        </div>
        <Progress value={pct} className="mt-3" />
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {STEPS.map((s) => {
            const active = s.slug === current;
            return (
              <Link
                key={s.slug}
                href={`/onboarding/${s.slug}`}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-colors",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border font-mono text-[10px]",
                    done[s.slug]
                      ? "border-accent bg-accent text-accent-foreground"
                      : active
                        ? "border-foreground"
                        : "border-border",
                  )}
                >
                  {done[s.slug] ? <Check size={10} strokeWidth={3} /> : s.n}
                </span>
                {s.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

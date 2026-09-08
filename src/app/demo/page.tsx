import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { setDemoView } from "./actions";
import { DEMO_VIEWS } from "@/lib/demo/mode";
import { currentDemoView } from "@/lib/demo/session";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Pick a view — MatLink demo" };

// Stands in for /login and /signup while the demo is running: instead of
// signing in, you choose whose product you want to look at.
export default async function DemoPickerPage() {
  const current = await currentDemoView();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <Wordmark />
        <Link
          href="/athletes"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          Browse coaches
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <p className="eyebrow">Demo</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
          No sign-in needed.
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
          Logins are switched off for this build. Pick who you want to be and the
          whole product renders from that point of view — you can change it at any
          time from the bar at the top of every page.
        </p>

        <form action={setDemoView} className="mt-8 space-y-3">
          {DEMO_VIEWS.map((v) => {
            const on = v.value === current;
            return (
              <button
                key={v.value}
                type="submit"
                name="view"
                value={v.value}
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-lg border bg-surface p-5 text-left transition-colors",
                  on
                    ? "border-accent/50"
                    : "border-border hover:border-border-strong",
                )}
              >
                <span className="min-w-0">
                  <span className="block font-display text-lg font-semibold tracking-tight">
                    {v.label}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-muted">
                    {v.blurb}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 text-xs",
                    on ? "text-accent" : "text-muted",
                  )}
                >
                  {on ? "Current" : <ArrowRight size={16} />}
                </span>
              </button>
            );
          })}
        </form>

        <Link href="/athletes" className="mt-8 inline-block">
          <Button variant="secondary">
            Go to the marketplace <ArrowRight size={15} />
          </Button>
        </Link>
      </main>
    </div>
  );
}

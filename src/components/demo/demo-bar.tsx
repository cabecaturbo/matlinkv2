import { RotateCcw } from "lucide-react";
import { setDemoView, resetDemo } from "@/app/demo/actions";
import { DEMO_VIEWS } from "@/lib/demo/mode";
import { currentDemoView } from "@/lib/demo/session";
import { cn } from "@/lib/utils";

// The one piece of UI that only exists in demo mode: a segmented control for
// stepping through the product as each role, with no sign-in anywhere.
export async function DemoBar() {
  const current = await currentDemoView();
  const active = DEMO_VIEWS.find((v) => v.value === current);

  return (
    <div className="border-b border-border bg-surface-2">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-5 gap-y-3 px-6 py-2.5">
        <span className="eyebrow inline-flex shrink-0 items-center gap-2 text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Demo
        </span>

        <form action={setDemoView} className="flex flex-wrap items-center gap-2">
          <span className="hidden text-xs text-muted sm:inline">Viewing as</span>
          <div className="flex flex-wrap items-center gap-1 rounded-md border border-border bg-background p-1">
            {DEMO_VIEWS.map((v) => {
              const on = v.value === current;
              return (
                <button
                  key={v.value}
                  type="submit"
                  name="view"
                  value={v.value}
                  title={v.blurb}
                  aria-pressed={on}
                  className={cn(
                    "rounded-sm px-2.5 py-1 text-xs font-medium transition-colors",
                    on
                      ? "bg-accent text-accent-foreground"
                      : "text-muted hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </form>

        {active && (
          <p className="hidden min-w-0 flex-1 truncate text-xs text-muted lg:block">
            {active.blurb}
          </p>
        )}

        <form action={resetDemo} className="ml-auto shrink-0">
          <button
            type="submit"
            title="Restore the demo data to how it started"
            className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs text-muted transition-colors hover:text-foreground"
          >
            <RotateCcw size={12} />
            Reset data
          </button>
        </form>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

// The recurring "spec-sheet" motif: mono caps labels + display-face values,
// laid out like a product spec block. The thing that makes a MatLink screen
// recognizable with the logo cropped out.
export type Spec = { label: string; value: React.ReactNode };

export function SpecBlock({
  items,
  className,
  columns = 3,
}: {
  items: Spec[];
  className?: string;
  columns?: 2 | 3;
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-4",
        columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2",
        className,
      )}
    >
      {items.map((it) => (
        <div key={it.label}>
          <dt className="eyebrow">{it.label}</dt>
          <dd className="mt-1 font-display text-sm font-medium tnum text-foreground">
            {it.value || <span className="text-muted-foreground">—</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

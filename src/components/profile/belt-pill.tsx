import { BELTS, type Belt } from "@/lib/constants/profile";
import { cn } from "@/lib/utils";

// The one sanctioned multi-color data element (§2): the belt in its real color.
export function BeltPill({
  belt,
  degree,
  className,
}: {
  belt: Belt | null;
  degree?: number | null;
  className?: string;
}) {
  const b = BELTS.find((x) => x.value === belt);
  if (!b) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1",
        className,
      )}
    >
      <span
        aria-hidden
        className="h-3 w-6 rounded-sm border border-white/10"
        style={{ background: b.hex }}
      />
      <span className="font-mono text-xs uppercase tracking-wide text-foreground">
        {b.label}
        {belt === "black" && degree ? ` · ${degree}°` : ""}
        {" belt"}
      </span>
    </span>
  );
}

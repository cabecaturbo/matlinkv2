import { cn } from "@/lib/utils";
import { batchNo, beltCode } from "@/lib/format";
import type { Belt } from "@/lib/constants/profile";

// The signature "batch number" eyebrow — drop-culture, not SaaS.
// e.g. MATLINK · No. 0047 · BLACK / 2°
export function BatchId({
  id,
  belt,
  degree,
  className,
}: {
  id: string;
  belt: Belt | null;
  degree?: number | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.14em] text-muted tnum",
        className,
      )}
    >
      MatLink · No. {batchNo(id)} · {beltCode(belt, degree)}
    </span>
  );
}

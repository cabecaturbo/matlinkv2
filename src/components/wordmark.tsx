import Link from "next/link";
import { cn } from "@/lib/utils";

// Type-led wordmark: "MatLink" with the dot over the "i" rendered as the one
// accent detail (a belt bar). The word does the work — no icon (design §1).
export function Wordmark({
  className,
  href = "/",
}: {
  className?: string;
  href?: string | null;
}) {
  const mark = (
    <span
      className={cn(
        "font-display text-xl font-bold tracking-tight text-foreground select-none",
        className,
      )}
    >
      MatL
      <span className="relative">
        i
        <span
          aria-hidden
          className="absolute -top-0.5 left-1/2 h-[3px] w-[7px] -translate-x-1/2 rounded-sm bg-accent"
        />
      </span>
      nk
    </span>
  );
  return href ? (
    <Link href={href} aria-label="MatLink home">
      {mark}
    </Link>
  ) : (
    mark
  );
}

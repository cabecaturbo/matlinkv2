import { BadgeCheck, Clock, UserPen } from "lucide-react";
import { cn } from "@/lib/utils";

type V = "unverified" | "pending" | "verified" | "rejected";

// First-class trust signal (§7). Verified reads as earned; everything else is
// honestly labelled, never a fake badge.
export function VerifiedBadge({
  status,
  className,
}: {
  status: V;
  className?: string;
}) {
  if (status === "verified") {
    return (
      <span
        title="Credentials reviewed by MatLink"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm border border-accent/50 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent",
          className,
        )}
      >
        <BadgeCheck size={14} strokeWidth={2.5} />
        Verified
      </span>
    );
  }

  const map = {
    pending: { icon: Clock, label: "In review" },
    rejected: { icon: UserPen, label: "Self-reported" },
    unverified: { icon: UserPen, label: "Self-reported" },
  } as const;
  const { icon: Icon, label } = map[status === "pending" ? "pending" : "unverified"];

  return (
    <span
      title="Credentials self-reported, not yet verified by MatLink"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1 text-xs font-medium text-muted",
        className,
      )}
    >
      <Icon size={13} />
      {label}
    </span>
  );
}

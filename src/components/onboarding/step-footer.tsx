"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { SaveStatus } from "@/hooks/use-autosave";

function SavingIndicator({ status }: { status: SaveStatus }) {
  const text: Record<SaveStatus, string> = {
    idle: "",
    saving: "Saving…",
    saved: "Saved",
    error: "Couldn't save — we'll retry",
  };
  return (
    <span
      className={cn(
        "font-mono text-xs",
        status === "error" ? "text-danger" : "text-muted",
      )}
      aria-live="polite"
    >
      {text[status]}
    </span>
  );
}

export function StepFooter({
  status,
  backHref,
  continueLabel = "Save & continue",
  pending,
}: {
  status: SaveStatus;
  backHref: string | null;
  continueLabel?: string;
  pending?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border pt-5">
      <SavingIndicator status={status} />
      <div className="flex items-center gap-2">
        {backHref && (
          <Link href={backHref}>
            <Button variant="ghost" type="button">
              Back
            </Button>
          </Link>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : continueLabel}
        </Button>
      </div>
    </div>
  );
}

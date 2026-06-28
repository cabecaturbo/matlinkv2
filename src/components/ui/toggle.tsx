"use client";

import { cn } from "@/lib/utils";

// Boolean segmented control (Yes / No). Controlled.
export function Toggle({
  value,
  onChange,
  yes = "Yes",
  no = "No",
}: {
  value: boolean;
  onChange: (next: boolean) => void;
  yes?: string;
  no?: string;
}) {
  return (
    <div className="inline-flex rounded-md border border-border p-0.5">
      {[
        { label: no, v: false },
        { label: yes, v: true },
      ].map(({ label, v }) => (
        <button
          key={label}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "rounded px-4 py-1.5 text-sm transition-colors",
            value === v
              ? "bg-foreground text-background font-medium"
              : "text-muted hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

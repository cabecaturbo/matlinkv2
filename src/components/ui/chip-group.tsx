"use client";

import { cn } from "@/lib/utils";

// Multi-select as toggle chips — on-brand, no dropdown. Controlled.
export function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt],
    );
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(opt)}
            className={cn(
              "rounded-sm border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-accent bg-accent text-accent-foreground font-medium"
                : "border-border bg-surface text-muted hover:text-foreground hover:border-muted-foreground",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

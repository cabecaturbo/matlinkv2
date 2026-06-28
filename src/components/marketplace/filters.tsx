"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/lib/constants/countries";
import {
  BELTS,
  COACHING_FOCUS,
  LANGUAGES,
  AVAILABILITY,
  RELOCATION_REGIONS,
} from "@/lib/constants/profile";
import { type Filters, buildQuery, activeFilterCount } from "./types";

const MIN_YEARS = [0, 3, 5, 10, 15];

function useFilterNav(current: Filters) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const apply = (partial: Partial<Filters>) => {
    const qs = buildQuery({ ...current, ...partial });
    start(() => router.replace(qs ? `/athletes?${qs}` : "/athletes", { scroll: false }));
  };
  const clearAll = () => start(() => router.replace("/athletes", { scroll: false }));
  return { apply, clearAll, pending };
}

const toggle = (arr: string[], v: string) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

// ── building blocks ──────────────────────────────────────────────────────────

function FacetSection({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-border py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between">
        <span className="eyebrow">{title}</span>
        <ChevronDown
          size={14}
          className="text-muted transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="mt-4 space-y-3">{children}</div>
    </details>
  );
}

function ChipRow({
  options,
  value,
  onToggle,
}: {
  options: readonly string[];
  value: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(o)}
            className={cn(
              "rounded-sm border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-accent bg-accent font-medium text-accent-foreground"
                : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Switch({
  checked,
  onChange,
  label,
  accent,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-2.5 text-sm text-foreground"
    >
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-sm border transition-colors",
          checked
            ? accent
              ? "border-accent bg-accent"
              : "border-foreground bg-foreground"
            : "border-border bg-surface",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-3.5 w-3.5 rounded-[2px] transition-all",
            checked
              ? accent
                ? "left-[18px] bg-accent-foreground"
                : "left-[18px] bg-background"
              : "left-0.5 bg-muted",
          )}
        />
      </span>
      {label}
    </button>
  );
}

// ── the faceted panel (sidebar + mobile drawer share this) ───────────────────

export function FilterPanel({
  current,
  beltCounts,
}: {
  current: Filters;
  beltCounts: Record<string, number>;
}) {
  const { apply } = useFilterNav(current);
  const [langQuery, setLangQuery] = useState("");
  const shownLangs = LANGUAGES.filter((l) =>
    l.toLowerCase().includes(langQuery.toLowerCase()),
  );

  return (
    <div>
      <FacetSection title="Trust" defaultOpen>
        <Switch
          accent
          checked={current.verified}
          onChange={(v) => apply({ verified: v })}
          label="Verified only"
        />
      </FacetSection>

      <FacetSection title="Rank & experience" defaultOpen>
        <div className="flex flex-col gap-1">
          {BELTS.map((b) => {
            const active = current.belt.includes(b.value);
            return (
              <button
                key={b.value}
                type="button"
                aria-pressed={active}
                onClick={() => apply({ belt: toggle(current.belt, b.value) })}
                className={cn(
                  "flex items-center gap-2.5 rounded-sm border px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "border-border-strong bg-surface-2 text-foreground"
                    : "border-transparent text-muted hover:bg-surface-2 hover:text-foreground",
                )}
              >
                <span
                  aria-hidden
                  className="h-3 w-5 rounded-[2px] border border-white/10"
                  style={{ background: b.hex }}
                />
                <span className="flex-1 text-left">{b.label}</span>
                <span className="tnum text-xs text-muted-foreground">
                  {beltCounts[b.value] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
        <div className="pt-1">
          <span className="eyebrow">Min years</span>
          <Select
            className="mt-1.5"
            value={String(current.minYears)}
            onChange={(e) => apply({ minYears: Number(e.target.value) })}
          >
            {MIN_YEARS.map((y) => (
              <option key={y} value={y}>
                {y === 0 ? "Any" : `${y}+ years`}
              </option>
            ))}
          </Select>
        </div>
      </FacetSection>

      <FacetSection title="Availability">
        <Switch
          checked={current.reloc}
          onChange={(v) => apply({ reloc: v })}
          label="Open to relocation"
        />
        <Switch
          checked={current.visa}
          onChange={(v) => apply({ visa: v })}
          label="Needs visa sponsorship"
        />
        <div className="pt-1">
          <span className="eyebrow">Commitment</span>
          <div className="mt-2">
            <ChipRow
              options={AVAILABILITY}
              value={current.avail}
              onToggle={(v) => apply({ avail: toggle(current.avail, v) })}
            />
          </div>
        </div>
      </FacetSection>

      <FacetSection title="Location & language">
        <Select value={current.country} onChange={(e) => apply({ country: e.target.value })}>
          <option value="">Any country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <div className="pt-1">
          <span className="eyebrow">Open to region</span>
          <div className="mt-2">
            <ChipRow
              options={RELOCATION_REGIONS}
              value={current.region}
              onToggle={(v) => apply({ region: toggle(current.region, v) })}
            />
          </div>
        </div>
        <div className="pt-1">
          <span className="eyebrow">Languages</span>
          <Input
            value={langQuery}
            onChange={(e) => setLangQuery(e.target.value)}
            placeholder="Search languages"
            className="mt-2 h-9"
          />
          <div className="mt-2">
            <ChipRow
              options={shownLangs}
              value={current.lang}
              onToggle={(v) => apply({ lang: toggle(current.lang, v) })}
            />
          </div>
        </div>
      </FacetSection>

      <FacetSection title="Coaching focus">
        <ChipRow
          options={COACHING_FOCUS}
          value={current.focus}
          onToggle={(v) => apply({ focus: toggle(current.focus, v) })}
        />
      </FacetSection>
    </div>
  );
}

// ── applied-filters chip bar ─────────────────────────────────────────────────

export function AppliedChips({ current }: { current: Filters }) {
  const { apply, clearAll } = useFilterNav(current);

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (current.verified)
    chips.push({ key: "v", label: "Verified only", onRemove: () => apply({ verified: false }) });
  current.belt.forEach((b) =>
    chips.push({ key: `b-${b}`, label: `Belt: ${b}`, onRemove: () => apply({ belt: current.belt.filter((x) => x !== b) }) }),
  );
  if (current.minYears > 0)
    chips.push({ key: "y", label: `${current.minYears}+ yrs`, onRemove: () => apply({ minYears: 0 }) });
  if (current.reloc)
    chips.push({ key: "r", label: "Open to relocation", onRemove: () => apply({ reloc: false }) });
  if (current.visa)
    chips.push({ key: "vi", label: "Needs visa", onRemove: () => apply({ visa: false }) });
  if (current.country)
    chips.push({ key: "c", label: current.country, onRemove: () => apply({ country: "" }) });
  current.region.forEach((r) =>
    chips.push({ key: `rg-${r}`, label: r, onRemove: () => apply({ region: current.region.filter((x) => x !== r) }) }),
  );
  current.lang.forEach((l) =>
    chips.push({ key: `l-${l}`, label: l, onRemove: () => apply({ lang: current.lang.filter((x) => x !== l) }) }),
  );
  current.avail.forEach((a) =>
    chips.push({ key: `a-${a}`, label: a, onRemove: () => apply({ avail: current.avail.filter((x) => x !== a) }) }),
  );
  current.focus.forEach((f) =>
    chips.push({ key: `f-${f}`, label: f, onRemove: () => apply({ focus: current.focus.filter((x) => x !== f) }) }),
  );

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.onRemove}
          className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1 text-xs text-foreground transition-colors hover:border-border-strong"
        >
          {c.label}
          <X size={12} className="text-muted" />
        </button>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="text-xs text-muted underline underline-offset-4 hover:text-foreground"
      >
        Clear all
      </button>
    </div>
  );
}

// ── search + sort row (search debounced; sort applies immediately) ───────────

export function SearchSort({ current }: { current: Filters }) {
  const { apply } = useFilterNav(current);
  const [q, setQ] = useState(current.q);

  useEffect(() => {
    if (q === current.q) return;
    const t = setTimeout(() => apply({ q }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, academy, keyword"
          className="pl-9"
        />
      </div>
      <Select
        value={current.sort}
        onChange={(e) => apply({ sort: e.target.value })}
        className="sm:w-44"
      >
        <option value="verified">Verified first</option>
        <option value="newest">Newest</option>
        <option value="belt">Belt rank</option>
      </Select>
    </div>
  );
}

// ── mobile drawer ────────────────────────────────────────────────────────────

export function MobileFilters({
  current,
  beltCounts,
  resultCount,
}: {
  current: Filters;
  beltCounts: Record<string, number>;
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(current);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button variant="secondary" className="w-full" onClick={() => setOpen(true)}>
        <SlidersHorizontal size={15} /> Filters{count ? ` (${count})` : ""}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <span className="font-display text-lg font-semibold tracking-tight">
              Filters
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="text-muted hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6">
            <FilterPanel current={current} beltCounts={beltCounts} />
          </div>
          <div className="border-t border-border p-4">
            <Button className="w-full" size="lg" onClick={() => setOpen(false)}>
              Show {resultCount} {resultCount === 1 ? "result" : "results"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

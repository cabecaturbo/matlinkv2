import type { Belt } from "@/lib/constants/profile";

// Deterministic 4-digit "drop number" from a profile id — pure brand flavor.
export function batchNo(id: string): string {
  const hex = id.replace(/[^0-9a-f]/gi, "").slice(0, 8) || "0";
  return String(parseInt(hex, 16) % 10000).padStart(4, "0");
}

// Compact belt code for the spec sheet, e.g. "BLACK / 2°".
export function beltCode(belt: Belt | null, degree?: number | null): string {
  if (!belt) return "UNRANKED";
  const d = belt === "black" && degree ? ` / ${degree}°` : "";
  return `${belt.toUpperCase()}${d}`;
}

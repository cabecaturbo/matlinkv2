// Shared option sets for the profile builder & marketplace (build prompt §5, §7).
import type { Database } from "@/lib/supabase/database.types";

export type Belt = Database["public"]["Enums"]["belt_rank"];
export type LinkType = Database["public"]["Enums"]["link_type"];

export const BELTS: { value: Belt; label: string; hex: string; onLight: boolean }[] = [
  { value: "white", label: "White", hex: "var(--belt-white)", onLight: true },
  { value: "blue", label: "Blue", hex: "var(--belt-blue)", onLight: false },
  { value: "purple", label: "Purple", hex: "var(--belt-purple)", onLight: false },
  { value: "brown", label: "Brown", hex: "var(--belt-brown)", onLight: false },
  { value: "black", label: "Black", hex: "var(--belt-black)", onLight: false },
];

export const LANGUAGES = [
  "Portuguese", "English", "Spanish", "French", "German", "Italian",
  "Arabic", "Russian", "Japanese", "Mandarin", "Korean", "Dutch",
  "Swedish", "Norwegian", "Polish", "Turkish", "Hebrew", "Hindi",
] as const;

export const AFFILIATIONS = [
  "IBJJF", "ADCC", "UAEJJF", "JJWL", "AJP", "CBJJ", "NAGA", "Grappling Industries",
] as const;

export const COACHING_FOCUS = [
  "Gi", "No-Gi", "Competition team", "Fundamentals", "Kids", "MMA grappling", "Private lessons",
] as const;

// Roles/positions a person is open to — beyond coaching, the staff/creative
// roles a gym hires for.
export const ROLE_TYPES = [
  // Coaching
  "Head coach", "Assistant coach", "Private lessons coach", "Kids program coach",
  // Fitness
  "Personal trainer", "Strength & conditioning", "Nutritionist",
  // Operations
  "Gym manager", "Front desk manager", "Receptionist", "Sales", "Events coordinator",
  // Creative / marketing
  "Marketing", "Social media", "Videographer", "Photographer",
] as const;

export const AVAILABILITY = [
  "Full-time", "Part-time", "Seminars", "Short camps",
] as const;

// Broad regions an athlete is open to relocating to (§5 step 4, §7 filter).
export const RELOCATION_REGIONS = [
  "North America", "South America", "Europe", "Middle East",
  "Asia", "Oceania", "Africa",
] as const;

export const LINK_TYPES: { value: LinkType; label: string; placeholder: string }[] = [
  { value: "ibjjf", label: "IBJJF profile", placeholder: "https://ibjjf.com/athlete/…" },
  { value: "bjjheroes", label: "BJJ Heroes", placeholder: "https://bjjheroes.com/…" },
  { value: "flograppling", label: "FloGrappling", placeholder: "https://flograppling.com/…" },
  { value: "smoothcomp", label: "Smoothcomp", placeholder: "https://smoothcomp.com/…" },
  { value: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
  { value: "youtube", label: "YouTube reel", placeholder: "https://youtube.com/…" },
  { value: "other", label: "Other", placeholder: "https://…" },
];

// Max black-belt degree (0 = no degree / coral handled as 7+ not modeled in v1).
export const MAX_BELT_DEGREE = 6;

import { z } from "zod";

// Helpers — validate FORMAT when present; presence is enforced only at submit.
const optionalText = z.string().trim().max(2000).optional().or(z.literal(""));
const e164 = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, "Use international format, e.g. +5511999999999");
const httpUrl = z.string().trim().url("Enter a full URL (https://…)");
const belt = z.enum(["white", "blue", "purple", "brown", "black"]);

// Multi-selects are plain string[] (the UI constrains the options); this keeps
// the types DB-compatible (text[]) and simple.
const tagList = () => z.array(z.string()).default([]);

// ── Per-step schemas (lenient — used for autosave drafts) ────────────────────

export const identitySchema = z.object({
  full_name: optionalText,
  photo_url: optionalText,
  cover_url: optionalText,
  dob: z.string().optional().or(z.literal("")),
  nationality: optionalText,
  location_country: optionalText,
  location_city: optionalText,
  languages: tagList(),
});

export const credentialsSchema = z.object({
  belt: belt.optional(),
  belt_degree: z.coerce.number().int().min(0).max(6).optional(),
  years_training: z.coerce.number().int().min(0).max(80).optional(),
  professor: optionalText,
  academy: optionalText,
  ibjjf_number: optionalText,
  affiliations: tagList(),
});

export const resultItemSchema = z.object({
  competition: z.string().trim().min(1, "Competition name is required").max(160),
  division: optionalText,
  year: z.coerce.number().int().min(1990).max(new Date().getFullYear()).optional(),
  placement: optionalText,
});

export const linkItemSchema = z.object({
  type: z.enum([
    "ibjjf", "bjjheroes", "flograppling", "smoothcomp", "instagram", "youtube", "other",
  ]),
  url: httpUrl,
});

export const recordSchema = z.object({
  highlights: optionalText,
  results: z.array(resultItemSchema).default([]),
  links: z.array(linkItemSchema).default([]),
});

export const offerSchema = z.object({
  headline: z.string().trim().max(160).optional().or(z.literal("")),
  bio: optionalText,
  coaching_focus: tagList(),
  open_to_relocation: z.boolean().default(false),
  relocation_regions: tagList(),
  needs_visa: z.boolean().default(false),
  availability: tagList(),
  rate_note: optionalText,
});

export const referenceItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  relationship: optionalText,
  contact: optionalText,
  note: optionalText,
});

export const referencesSchema = z.object({
  references: z.array(referenceItemSchema).default([]),
  credentials_consent: z.boolean().default(false),
});

export const contactSchema = z.object({
  whatsapp_e164: e164.optional().or(z.literal("")),
  public_email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
});

// ── Strict submit schema — the bar to publish & request verification ─────────

export const submitSchema = z.object({
  full_name: z.string().trim().min(2, "Add your full name"),
  photo_url: z.string().trim().min(1, "Add a profile photo"),
  nationality: z.string().trim().min(1, "Add your nationality"),
  location_country: z.string().trim().min(1, "Add your country"),
  belt: belt,
  years_training: z.coerce.number().int().min(0, "Add years training"),
  headline: z.string().trim().min(10, "Write a short headline"),
  whatsapp_e164: e164,
  credentials_consent: z.literal(true, {
    message: "Confirm your credentials are accurate",
  }),
});

// ── Gym profile (lightweight, §4/§8) ─────────────────────────────────────────
export const gymProfileSchema = z.object({
  gym_name: z.string().trim().max(120).optional().or(z.literal("")),
  location_country: optionalText,
  location_city: optionalText,
  website: httpUrl.optional().or(z.literal("")),
  looking_for: optionalText,
});
export type GymProfileInput = z.infer<typeof gymProfileSchema>;

export type IdentityInput = z.infer<typeof identitySchema>;
export type CredentialsInput = z.infer<typeof credentialsSchema>;
export type RecordInput = z.infer<typeof recordSchema>;
export type OfferInput = z.infer<typeof offerSchema>;
export type ReferencesInput = z.infer<typeof referencesSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export const STEPS = [
  { slug: "identity", n: 1, label: "Identity", title: "Identity & basics" },
  { slug: "credentials", n: 2, label: "Credentials", title: "BJJ credentials" },
  { slug: "record", n: 3, label: "Record", title: "Competition record" },
  { slug: "offer", n: 4, label: "Offer", title: "What you offer" },
  { slug: "references", n: 5, label: "References", title: "References & docs" },
  { slug: "contact", n: 6, label: "Contact", title: "Contact & submit" },
] as const;

export type StepSlug = (typeof STEPS)[number]["slug"];

export function stepIndex(slug: StepSlug) {
  return STEPS.findIndex((s) => s.slug === slug);
}

export function nextStep(slug: StepSlug) {
  const i = stepIndex(slug);
  return i < STEPS.length - 1 ? STEPS[i + 1].slug : null;
}

export function prevStep(slug: StepSlug) {
  const i = stepIndex(slug);
  return i > 0 ? STEPS[i - 1].slug : null;
}

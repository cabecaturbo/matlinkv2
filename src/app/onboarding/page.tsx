import { redirect } from "next/navigation";
import { getFullProfile, buildSnapshot } from "@/lib/profile";
import { stepCompletion } from "@/lib/onboarding/progress";
import { STEPS } from "@/lib/onboarding/steps";

// Resume where the athlete left off: first incomplete step (or step 1).
export default async function OnboardingIndex() {
  const bundle = await getFullProfile();
  const done = stepCompletion(buildSnapshot(bundle));
  const firstIncomplete = STEPS.find((s) => !done[s.slug])?.slug ?? "identity";
  redirect(`/onboarding/${firstIncomplete}`);
}

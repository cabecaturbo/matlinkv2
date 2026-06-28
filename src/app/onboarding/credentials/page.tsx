import { getFullProfile, buildSnapshot } from "@/lib/profile";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { CredentialsForm } from "./credentials-form";

export default async function Page() {
  const b = await getFullProfile();
  return (
    <>
      <OnboardingHeader current="credentials" snapshot={buildSnapshot(b)} />
      <main className="mx-auto w-full max-w-2xl px-6 py-8">
        <p className="eyebrow">Step 2 of 6</p>
        <h1 className="mt-2 mb-6 font-display text-2xl font-bold tracking-tight">
          BJJ credentials
        </h1>
        <CredentialsForm
          initial={{
            belt: b.profile.belt ?? undefined,
            belt_degree: b.profile.belt_degree ?? undefined,
            years_training: b.profile.years_training ?? undefined,
            professor: b.profile.professor ?? "",
            academy: b.profile.academy ?? "",
            ibjjf_number: b.profile.ibjjf_number ?? "",
            affiliations: b.profile.affiliations ?? [],
          }}
        />
      </main>
    </>
  );
}

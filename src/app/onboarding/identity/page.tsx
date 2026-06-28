import { getFullProfile, buildSnapshot } from "@/lib/profile";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { IdentityForm } from "./identity-form";

export default async function Page() {
  const b = await getFullProfile();
  return (
    <>
      <OnboardingHeader current="identity" snapshot={buildSnapshot(b)} />
      <main className="mx-auto w-full max-w-2xl px-6 py-8">
        <p className="eyebrow">Step 1 of 6</p>
        <h1 className="mt-2 mb-6 font-display text-2xl font-bold tracking-tight">
          Identity &amp; basics
        </h1>
        <IdentityForm
          userId={b.userId}
          initial={{
            full_name: b.profile.full_name ?? "",
            photo_url: b.profile.photo_url ?? "",
            cover_url: b.profile.cover_url ?? "",
            dob: b.profile.dob ?? "",
            nationality: b.profile.nationality ?? "",
            location_country: b.profile.location_country ?? "",
            location_city: b.profile.location_city ?? "",
            languages: b.profile.languages ?? [],
          }}
        />
      </main>
    </>
  );
}

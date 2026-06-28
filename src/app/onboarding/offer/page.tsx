import { getFullProfile, buildSnapshot } from "@/lib/profile";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { OfferForm } from "./offer-form";

export default async function Page() {
  const b = await getFullProfile();
  return (
    <>
      <OnboardingHeader current="offer" snapshot={buildSnapshot(b)} />
      <main className="mx-auto w-full max-w-2xl px-6 py-8">
        <p className="eyebrow">Step 4 of 6</p>
        <h1 className="mt-2 mb-6 font-display text-2xl font-bold tracking-tight">
          What you offer
        </h1>
        <OfferForm
          initial={{
            headline: b.profile.headline ?? "",
            bio: b.profile.bio ?? "",
            coaching_focus: b.profile.coaching_focus ?? [],
            open_to_relocation: b.profile.open_to_relocation ?? false,
            relocation_regions: b.profile.relocation_regions ?? [],
            needs_visa: b.profile.needs_visa ?? false,
            availability: b.profile.availability ?? [],
            rate_note: b.profile.rate_note ?? "",
          }}
        />
      </main>
    </>
  );
}

import { getFullProfile, buildSnapshot } from "@/lib/profile";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { ReferencesForm } from "./references-form";

export default async function Page() {
  const b = await getFullProfile();
  return (
    <>
      <OnboardingHeader current="references" snapshot={buildSnapshot(b)} />
      <main className="mx-auto w-full max-w-2xl px-6 py-8">
        <p className="eyebrow">Step 5 of 6</p>
        <h1 className="mt-2 mb-6 font-display text-2xl font-bold tracking-tight">
          References &amp; documents
        </h1>
        <ReferencesForm
          userId={b.userId}
          initialDocs={b.docs}
          initial={{
            references: b.references.map((r) => ({
              name: r.name,
              relationship: r.relationship ?? "",
              contact: r.contact ?? "",
              note: r.note ?? "",
            })),
            credentials_consent: b.profile.credentials_consent ?? false,
          }}
        />
      </main>
    </>
  );
}

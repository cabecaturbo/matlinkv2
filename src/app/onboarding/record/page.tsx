import { getFullProfile, buildSnapshot } from "@/lib/profile";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { RecordForm } from "./record-form";

export default async function Page() {
  const b = await getFullProfile();
  return (
    <>
      <OnboardingHeader current="record" snapshot={buildSnapshot(b)} />
      <main className="mx-auto w-full max-w-2xl px-6 py-8">
        <p className="eyebrow">Step 3 of 6</p>
        <h1 className="mt-2 mb-6 font-display text-2xl font-bold tracking-tight">
          Competition record
        </h1>
        <RecordForm
          initial={{
            highlights: b.profile.highlights ?? "",
            results: b.results.map((r) => ({
              competition: r.competition,
              division: r.division ?? "",
              year: r.year ?? undefined,
              placement: r.placement ?? "",
            })),
            links: b.links.map((l) => ({ type: l.type, url: l.url })),
          }}
        />
      </main>
    </>
  );
}

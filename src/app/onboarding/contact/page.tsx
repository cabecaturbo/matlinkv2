import { getFullProfile, buildSnapshot } from "@/lib/profile";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { ContactForm } from "./contact-form";

export default async function Page() {
  const b = await getFullProfile();
  return (
    <>
      <OnboardingHeader current="contact" snapshot={buildSnapshot(b)} />
      <main className="mx-auto w-full max-w-2xl px-6 py-8">
        <p className="eyebrow">Step 6 of 6</p>
        <h1 className="mt-2 mb-6 font-display text-2xl font-bold tracking-tight">
          Contact &amp; submit
        </h1>
        <ContactForm
          alreadyLive={b.profile.status !== "draft"}
          initial={{
            whatsapp_e164: b.contact?.whatsapp_e164 ?? "",
            public_email: b.contact?.public_email ?? "",
          }}
        />
      </main>
    </>
  );
}

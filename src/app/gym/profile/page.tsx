import { getOrCreateGymProfile } from "@/lib/gym";
import { Card } from "@/components/ui/card";
import { GymProfileForm } from "./gym-profile-form";

export default async function GymProfilePage() {
  const { profile } = await getOrCreateGymProfile();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <p className="eyebrow">Gym profile</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Your gym
      </h1>
      <p className="mt-1 text-sm text-muted">
        Optional, but a complete profile makes your outreach to coaches more
        credible.
      </p>

      <Card className="mt-6">
        <GymProfileForm
          initial={{
            gym_name: profile.gym_name ?? "",
            location_country: profile.location_country ?? "",
            location_city: profile.location_city ?? "",
            website: profile.website ?? "",
            looking_for: profile.looking_for ?? "",
          }}
        />
      </Card>
    </main>
  );
}

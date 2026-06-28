import { requireAthlete } from "@/lib/auth";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAthlete(); // gym/admin redirected to /dashboard
  return <div className="flex min-h-dvh flex-col">{children}</div>;
}

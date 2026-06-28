import { requireGym } from "@/lib/auth";
import { AppHeader } from "@/components/app-header";

export default async function GymLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireGym(); // athlete/admin redirected to /dashboard
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader role="gym" />
      {children}
    </div>
  );
}

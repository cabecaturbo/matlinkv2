import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { ResetPasswordForm } from "./reset-password-form";

// Reached via the recovery email link → /auth/confirm establishes a session →
// redirects here. Only a session is required (not a chosen role).
export default async function ResetPasswordPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  return (
    <Card>
      <p className="eyebrow">Reset password</p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
        Set a new password
      </h1>
      <ResetPasswordForm />
    </Card>
  );
}

import { requireUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { ResetPasswordForm } from "./reset-password-form";

// Reached via the recovery email link → /auth/confirm establishes a session →
// redirects here. requireUser sends anyone without that session back to login.
export default async function ResetPasswordPage() {
  await requireUser();

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

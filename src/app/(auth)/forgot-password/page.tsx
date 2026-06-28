"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { requestPasswordReset, type AuthState } from "../actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Sending…" : "Send reset link"}
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    undefined,
  );

  return (
    <Card>
      <p className="eyebrow">Reset password</p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
        Forgot your password?
      </h1>

      {state?.notice ? (
        <Alert variant="notice" className="mt-6">
          {state.notice}
        </Alert>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <p className="text-sm text-muted">
            Enter your email and we&apos;ll send you a link to set a new password.
          </p>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>
          {state?.error && <Alert>{state.error}</Alert>}
          <SubmitButton />
        </form>
      )}

      <p className="mt-6 text-sm text-muted">
        Remembered it?{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </Card>
  );
}

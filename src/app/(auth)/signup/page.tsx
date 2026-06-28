"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Check } from "lucide-react";
import { signup, type AuthState } from "../actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { GoogleButton } from "@/components/auth/google-button";
import { AuthDivider } from "@/components/auth/auth-divider";
import { cn } from "@/lib/utils";

function CreateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating account…" : "Create account"}
    </Button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useActionState<AuthState, FormData>(signup, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const longEnough = password.length >= 8;

  return (
    <Card>
      <p className="eyebrow">Join MatLink</p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
        Create your account
      </h1>

      {state?.notice ? (
        <Alert variant="notice" className="mt-6">
          {state.notice}
        </Alert>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            <GoogleButton />
            <MagicLinkForm label="Sign up with an email link" />
          </div>

          <div className="my-5">
            <AuthDivider label="or use a password" />
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <p
                className={cn(
                  "mt-1.5 flex items-center gap-1.5 text-xs",
                  longEnough ? "text-success" : "text-muted",
                )}
              >
                <Check size={12} strokeWidth={3} /> At least 8 characters
              </p>
            </div>

            {state?.error && <Alert>{state.error}</Alert>}

            <CreateButton />
          </form>
        </>
      )}

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </Card>
  );
}

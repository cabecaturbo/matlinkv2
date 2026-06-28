"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signup, type AuthState } from "../actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

function RoleOption({
  value,
  title,
  desc,
}: {
  value: "athlete" | "gym";
  title: string;
  desc: string;
}) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name="role" value={value} className="peer sr-only" />
      <div className="rounded-lg border border-border bg-surface p-4 transition-colors peer-checked:border-accent peer-checked:bg-surface-2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
        <div className="font-display font-semibold">{title}</div>
        <div className="mt-0.5 text-xs text-muted">{desc}</div>
      </div>
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Creating account…" : "Create account"}
    </Button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    signup,
    undefined,
  );

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
        <form action={formAction} className="mt-6 space-y-5">
          <fieldset>
            <legend className="eyebrow mb-2">I&apos;m joining as</legend>
            <div className="grid grid-cols-2 gap-3">
              <RoleOption
                value="athlete"
                title="Athlete"
                desc="I coach / compete"
              />
              <RoleOption value="gym" title="Gym" desc="I'm hiring a coach" />
            </div>
          </fieldset>

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
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>

          {state?.error && <Alert>{state.error}</Alert>}

          <SubmitButton />
        </form>
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

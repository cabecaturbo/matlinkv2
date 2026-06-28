"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Mail } from "lucide-react";
import { signInWithMagicLink, type AuthState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      <Mail size={16} />
      {pending ? "Sending…" : label}
    </Button>
  );
}

export function MagicLinkForm({ label = "Email me a sign-in link" }: { label?: string }) {
  const [state, action] = useActionState<AuthState, FormData>(
    signInWithMagicLink,
    undefined,
  );
  const [email, setEmail] = useState("");

  if (state?.notice) {
    return <Alert variant="notice">{state.notice}</Alert>;
  }

  return (
    <form action={action} className="space-y-2">
      <Input
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        aria-label="Email for magic link"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {state?.error && <Alert>{state.error}</Alert>}
      <SubmitButton label={label} />
    </form>
  );
}

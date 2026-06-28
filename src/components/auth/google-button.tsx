"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

// Only rendered when Google is actually configured (env flag set after the
// provider is enabled in Supabase) — so it never dead-ends.
export function GoogleButton() {
  const [busy, setBusy] = useState(false);
  if (process.env.NEXT_PUBLIC_GOOGLE_AUTH !== "1") return null;

  async function go() {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/confirm?next=/dashboard` },
    });
    if (error) setBusy(false);
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full"
      onClick={go}
      disabled={busy}
    >
      {busy ? "Redirecting…" : "Continue with Google"}
    </Button>
  );
}

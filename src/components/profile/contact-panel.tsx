"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Copy, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactPanel({
  signedIn,
  profileId,
  firstName,
  whatsapp,
  email,
}: {
  signedIn: boolean;
  profileId: string;
  firstName: string;
  whatsapp: string | null;
  email: string | null;
}) {
  const [copied, setCopied] = useState(false);

  // Gym must be signed in to see/use contact (§6 — no paywall in v1, just sign-in).
  if (!signedIn) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <p className="flex items-center gap-2 text-sm text-muted">
          <Lock size={14} /> Contact is visible to signed-in members.
        </p>
        <Link href={`/login?next=/athletes/${profileId}`} className="mt-3 block">
          <Button className="w-full">Sign in to contact</Button>
        </Link>
      </div>
    );
  }

  const waNumber = whatsapp?.replace(/[^0-9]/g, "");
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Hi ${firstName}, I found your MatLink profile and I'd like to talk about a coaching role at my gym.`,
      )}`
    : null;

  async function copyEmail() {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      {waHref ? (
        <a href={waHref} target="_blank" rel="noopener noreferrer">
          <Button className="w-full" size="lg">
            <MessageCircle size={16} /> Contact on WhatsApp
          </Button>
        </a>
      ) : (
        <p className="text-sm text-muted">No WhatsApp number provided.</p>
      )}

      {email && (
        <button
          type="button"
          onClick={copyEmail}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-2"
        >
          {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
          {copied ? "Email copied" : "Copy email"}
        </button>
      )}

      <p className="mt-3 text-center text-xs text-muted">
        Contact happens off-platform, on WhatsApp.
      </p>
    </div>
  );
}

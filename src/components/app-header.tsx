import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { SignOutButton } from "@/components/sign-out-button";
import type { Role } from "@/lib/auth";

// Header for signed-in surfaces. Admin link only shows for admins.
export function AppHeader({ role }: { role: Role | null }) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <Wordmark href="/dashboard" />
      <nav className="flex items-center gap-2">
        {role === "admin" && (
          <Link
            href="/admin"
            className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            Admin
          </Link>
        )}
        <SignOutButton />
      </nav>
    </header>
  );
}

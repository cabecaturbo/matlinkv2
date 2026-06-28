import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth";

// Auth-aware header for public pages (marketplace, profiles).
export async function PublicHeader() {
  const session = await getSessionUser();
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <Wordmark />
      <nav className="flex items-center gap-2">
        {session ? (
          <Link href="/dashboard">
            <Button size="sm" variant="secondary">
              Dashboard
            </Button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button size="sm" variant="ghost">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

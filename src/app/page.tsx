import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth";

export default async function Home() {
  const session = await getSessionUser();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <Wordmark />
        <nav className="flex items-center gap-2">
          <Link href="/athletes">
            <Button size="sm" variant="ghost">
              Browse coaches
            </Button>
          </Link>
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

      <main className="flex flex-1 items-center px-6">
        <div className="mx-auto w-full max-w-3xl py-20">
          <p className="eyebrow">Verified BJJ coaches · worldwide</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Where gyms find
            <br />
            their next <span className="text-accent">coach</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-7 text-muted">
            A marketplace of verified Brazilian Jiu-Jitsu instructors open to
            teaching and relocating. Browse credentials you can trust — then
            reach out directly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/athletes">
              <Button size="lg" className="w-full sm:w-auto">
                Browse coaches
              </Button>
            </Link>
            {!session && (
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Join MatLink
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

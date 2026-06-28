import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-6 py-5">
        <Wordmark />
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="mt-6 flex gap-2">
          <Link href="/">
            <Button variant="secondary">Home</Button>
          </Link>
          <Link href="/athletes">
            <Button>Browse coaches</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

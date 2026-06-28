import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
          This profile isn&apos;t available
        </h1>
        <p className="mt-2 text-sm text-muted">
          It may not be live yet, or the link is wrong.
        </p>
        <Link href="/" className="mt-6">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </main>
    </div>
  );
}

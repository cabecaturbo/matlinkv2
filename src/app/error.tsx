"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
        That didn&apos;t work
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        An unexpected error occurred. Try again, and if it keeps happening, come
        back in a moment.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}

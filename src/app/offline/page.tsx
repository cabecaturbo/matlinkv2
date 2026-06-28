import { Wordmark } from "@/components/wordmark";

export const dynamic = "force-static";

export const metadata = { title: "Offline — MatLink" };

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-6 py-5">
        <Wordmark href={null} />
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow">No connection</p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
          You&apos;re offline
        </h1>
        <p className="mt-2 text-sm text-muted">
          MatLink needs a connection to load coaches. Reconnect and try again.
        </p>
      </main>
    </div>
  );
}

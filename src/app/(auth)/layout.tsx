import Link from "next/link";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import { DEMO_MODE } from "@/lib/demo/mode";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Demo mode replaces every auth screen with the "who are you viewing as"
  // picker — there is nothing to sign in to.
  if (DEMO_MODE) redirect("/demo");

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <Wordmark />
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          Back to home
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}

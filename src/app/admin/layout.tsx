import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AppHeader } from "@/components/app-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader role="admin" />
      <div className="border-b border-border">
        <nav className="mx-auto flex max-w-5xl gap-4 px-6 py-3 text-sm">
          <Link href="/admin" className="text-muted hover:text-foreground">
            Overview
          </Link>
          <Link href="/admin/users" className="text-muted hover:text-foreground">
            Users
          </Link>
          <Link href="/athletes" className="text-muted hover:text-foreground">
            View marketplace
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}

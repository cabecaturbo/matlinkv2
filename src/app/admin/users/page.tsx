import { Search } from "lucide-react";
import { listUsers } from "@/lib/admin";
import { UserRow } from "@/components/admin/user-row";
import { Input } from "@/components/ui/input";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q ?? "";
  const users = await listUsers(q);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Users</h1>

      <form className="mt-6 max-w-sm">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search by email"
            className="pl-9"
          />
        </div>
      </form>

      <p className="mt-4 text-sm text-muted">{users.length} users</p>

      <div className="mt-3 space-y-2">
        {users.map((u) => (
          <UserRow key={u.id} user={u} />
        ))}
      </div>
    </main>
  );
}

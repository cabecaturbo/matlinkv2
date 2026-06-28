"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setProfileStatus, setVerification } from "@/app/admin/actions";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { AdminUser } from "@/lib/admin";
import type { Database } from "@/lib/supabase/database.types";

type VerificationStatus = Database["public"]["Enums"]["verification_status"];

export function UserRow({ user }: { user: AdminUser }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const profile = user.profile;
  const suspended = profile?.status === "suspended";

  function run(fn: () => Promise<{ error?: string }>) {
    start(async () => {
      const r = await fn();
      if (r.error) alert(r.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {user.email}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          <span className="font-mono uppercase">{user.role}</span>
          {profile ? ` · profile ${profile.status}` : ""}
        </p>
      </div>

      {profile && (
        <div className="flex flex-wrap items-center gap-2">
          <Select
            className="h-9 w-36"
            value={profile.verification_status}
            disabled={pending}
            onChange={(e) =>
              run(() =>
                setVerification(profile.id, e.target.value as VerificationStatus),
              )
            }
          >
            <option value="unverified">Unverified</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </Select>
          <Button
            size="sm"
            variant="secondary"
            disabled={pending}
            onClick={() =>
              run(() =>
                setProfileStatus(profile.id, suspended ? "live" : "suspended"),
              )
            }
          >
            {suspended ? "Unsuspend" : "Suspend"}
          </Button>
          <Link href={`/admin/athletes/${profile.id}`}>
            <Button size="sm" variant="ghost">
              Review
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

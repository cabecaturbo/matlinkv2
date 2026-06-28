"use client";

import { useState, useTransition } from "react";
import { Dumbbell, Building2 } from "lucide-react";
import { chooseRole } from "../actions";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

function RoleCard({
  onPick,
  pending,
  icon,
  title,
  desc,
}: {
  onPick: () => void;
  pending: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={pending}
      className={cn(
        "flex w-full items-start gap-4 rounded-lg border border-border bg-surface p-5 text-left",
        "transition-colors hover:border-accent hover:bg-surface-2 disabled:opacity-50",
      )}
    >
      <span className="mt-0.5 text-accent">{icon}</span>
      <span>
        <span className="block font-display text-lg font-semibold tracking-tight">
          {title}
        </span>
        <span className="mt-1 block text-sm text-muted">{desc}</span>
      </span>
    </button>
  );
}

export function RoleForm() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();

  const pick = (role: "gym" | "athlete") => {
    setError(undefined);
    start(async () => {
      const res = await chooseRole(role);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <div className="space-y-3">
      <RoleCard
        onPick={() => pick("gym")}
        pending={pending}
        icon={<Building2 size={22} />}
        title="I'm a gym looking to hire"
        desc="Browse and contact verified BJJ coaches and staff."
      />
      <RoleCard
        onPick={() => pick("athlete")}
        pending={pending}
        icon={<Dumbbell size={22} />}
        title="I'm an athlete offering coaching"
        desc="Build a profile and get discovered by gyms worldwide."
      />
      {error && <Alert>{error}</Alert>}
      <p className="pt-1 text-center text-xs text-muted">
        Picked the wrong one? You can change it later in settings.
      </p>
    </div>
  );
}

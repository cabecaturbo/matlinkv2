"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { approveAthlete, rejectAthlete } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";

export function DecisionPanel({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string>();

  function approve() {
    setError(undefined);
    start(async () => {
      const r = await approveAthlete(profileId);
      if (r.error) setError(r.error);
      else router.push("/admin");
    });
  }

  function reject() {
    setError(undefined);
    start(async () => {
      const r = await rejectAthlete(profileId, reason);
      if (r.error) setError(r.error);
      else router.push("/admin");
    });
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="eyebrow mb-3">Decision</h2>

      {!rejecting ? (
        <div className="space-y-2">
          <Button className="w-full" onClick={approve} disabled={pending}>
            <Check size={16} /> Approve &amp; verify
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setRejecting(true)}
            disabled={pending}
          >
            <X size={16} /> Reject…
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason the athlete can act on (e.g. IBJJF number doesn't match the name on record)."
            autoFocus
          />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setRejecting(false)} disabled={pending}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={reject} disabled={pending}>
              Confirm rejection
            </Button>
          </div>
        </div>
      )}

      {error && <Alert className="mt-3">{error}</Alert>}
    </div>
  );
}

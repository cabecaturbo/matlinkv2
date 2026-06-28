"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { referencesSchema, type ReferencesInput } from "@/lib/validation/profile";
import { saveReferences } from "../actions";
import { useAutosave } from "@/hooks/use-autosave";
import { Field } from "@/components/onboarding/field";
import { StepFooter } from "@/components/onboarding/step-footer";
import { DocUpload } from "@/components/onboarding/doc-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function ReferencesForm({
  initial,
  userId,
  initialDocs,
}: {
  initial: ReferencesInput;
  userId: string;
  initialDocs: { id: string; doc_type: string | null }[];
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const [pending, setPending] = useState(false);
  const { register, control, handleSubmit } = useForm<
    z.input<typeof referencesSchema>,
    unknown,
    ReferencesInput
  >({
    resolver: zodResolver(referencesSchema),
    defaultValues: initial,
  });

  const refs = useFieldArray({ control, name: "references" });
  const values = useWatch({ control });
  const status = useAutosave(values, (v) => saveReferences(v));

  const onContinue = handleSubmit(async (values) => {
    setPending(true);
    const res = await saveReferences(values);
    setPending(false);
    if (res?.error) return setServerError(res.error);
    router.push("/onboarding/contact");
  });

  return (
    <form onSubmit={onContinue} className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="eyebrow">References</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              refs.append({ name: "", relationship: "", contact: "", note: "" })
            }
          >
            <Plus size={14} /> Add reference
          </Button>
        </div>
        <p className="mb-3 text-xs text-muted">
          Names and notes appear on your public profile. Contact details stay
          private — visible only to you and MatLink admins.
        </p>
        <div className="space-y-3">
          {refs.fields.map((f, i) => (
            <div key={f.id} className="rounded-lg border border-border bg-surface p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Input placeholder="Name" {...register(`references.${i}.name`)} />
                <Input
                  placeholder="Relationship (e.g. head coach)"
                  {...register(`references.${i}.relationship`)}
                />
                <Input
                  placeholder="Contact (private)"
                  {...register(`references.${i}.contact`)}
                />
                <Input placeholder="Note" {...register(`references.${i}.note`)} />
              </div>
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => refs.remove(i)}
                  className="inline-flex items-center gap-1 text-xs text-muted hover:text-danger"
                >
                  <X size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Field
        label="Verification documents"
        hint="IBJJF card, belt certificate, or ID. Private — shown only to admins."
      >
        <DocUpload userId={userId} initialDocs={initialDocs} />
      </Field>

      <label className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
        <input
          type="checkbox"
          {...register("credentials_consent")}
          className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
        />
        <span className="text-sm text-foreground">
          I confirm these credentials are accurate.
        </span>
      </label>

      {serverError && <Alert>{serverError}</Alert>}

      <StepFooter status={status} backHref="/onboarding/offer" pending={pending} />
    </form>
  );
}

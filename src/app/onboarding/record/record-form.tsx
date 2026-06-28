"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { recordSchema, type RecordInput } from "@/lib/validation/profile";
import { saveRecord } from "../actions";
import { useAutosave } from "@/hooks/use-autosave";
import { Field } from "@/components/onboarding/field";
import { StepFooter } from "@/components/onboarding/step-footer";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { LINK_TYPES } from "@/lib/constants/profile";

export function RecordForm({ initial }: { initial: RecordInput }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const [pending, setPending] = useState(false);
  const { register, control, handleSubmit } = useForm<
    z.input<typeof recordSchema>,
    unknown,
    RecordInput
  >({
    resolver: zodResolver(recordSchema),
    defaultValues: initial,
  });

  const results = useFieldArray({ control, name: "results" });
  const links = useFieldArray({ control, name: "links" });
  const values = useWatch({ control });
  const status = useAutosave(values, (v) => saveRecord(v));

  const onContinue = handleSubmit(async (values) => {
    setPending(true);
    const res = await saveRecord(values);
    setPending(false);
    if (res?.error) return setServerError(res.error);
    router.push("/onboarding/offer");
  });

  return (
    <form onSubmit={onContinue} className="space-y-6">
      <Field
        label="Career highlights"
        htmlFor="highlights"
        hint="A short paragraph on your competitive achievements."
      >
        <Textarea
          id="highlights"
          rows={4}
          {...register("highlights")}
          placeholder="Two-time IBJJF Pan champion, ADCC trials finalist…"
        />
      </Field>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="eyebrow">Notable results</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              results.append({ competition: "", division: "", placement: "" })
            }
          >
            <Plus size={14} /> Add result
          </Button>
        </div>
        <div className="space-y-3">
          {results.fields.length === 0 && (
            <p className="text-sm text-muted">
              No results yet — add your standout competition finishes.
            </p>
          )}
          {results.fields.map((f, i) => (
            <div
              key={f.id}
              className="rounded-lg border border-border bg-surface p-3"
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Competition (e.g. IBJJF Worlds)"
                  {...register(`results.${i}.competition`)}
                />
                <Input
                  placeholder="Division / belt"
                  {...register(`results.${i}.division`)}
                />
                <Input
                  type="number"
                  placeholder="Year"
                  {...register(`results.${i}.year`)}
                />
                <Input
                  placeholder="Placement (e.g. Gold)"
                  {...register(`results.${i}.placement`)}
                />
              </div>
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => results.remove(i)}
                  className="inline-flex items-center gap-1 text-xs text-muted hover:text-danger"
                >
                  <X size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="eyebrow">Public profile links</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => links.append({ type: "ibjjf", url: "" })}
          >
            <Plus size={14} /> Add link
          </Button>
        </div>
        <p className="mb-2 text-xs text-muted">
          These let gyms verify you independently — IBJJF, BJJ Heroes, Smoothcomp,
          Instagram, highlight reels.
        </p>
        <div className="space-y-2">
          {links.fields.map((f, i) => (
            <div key={f.id} className="flex items-center gap-2">
              <Select className="w-40 shrink-0" {...register(`links.${i}.type`)}>
                {LINK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
              <Input placeholder="https://…" {...register(`links.${i}.url`)} />
              <button
                type="button"
                onClick={() => links.remove(i)}
                aria-label="Remove link"
                className="shrink-0 text-muted hover:text-danger"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {serverError && <Alert>{serverError}</Alert>}

      <StepFooter
        status={status}
        backHref="/onboarding/credentials"
        pending={pending}
      />
    </form>
  );
}

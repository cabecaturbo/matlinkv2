"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { credentialsSchema, type CredentialsInput } from "@/lib/validation/profile";
import { saveCredentials } from "../actions";
import { useAutosave } from "@/hooks/use-autosave";
import { Field } from "@/components/onboarding/field";
import { StepFooter } from "@/components/onboarding/step-footer";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ChipGroup } from "@/components/ui/chip-group";
import { Alert } from "@/components/ui/alert";
import { BELTS, AFFILIATIONS, MAX_BELT_DEGREE } from "@/lib/constants/profile";

export function CredentialsForm({
  initial,
}: {
  initial: CredentialsInput;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const [pending, setPending] = useState(false);
  const { register, control, handleSubmit } = useForm<
    z.input<typeof credentialsSchema>,
    unknown,
    CredentialsInput
  >({
    resolver: zodResolver(credentialsSchema),
    defaultValues: initial,
  });

  const values = useWatch({ control });
  const status = useAutosave(values, (v) => saveCredentials(v));
  const belt = values.belt;

  const onContinue = handleSubmit(async (values) => {
    setPending(true);
    const res = await saveCredentials(values);
    setPending(false);
    if (res?.error) return setServerError(res.error);
    router.push("/onboarding/record");
  });

  return (
    <form onSubmit={onContinue} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Belt rank" htmlFor="belt" required>
          <Select id="belt" {...register("belt")}>
            <option value="">Select…</option>
            {BELTS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </Select>
        </Field>
        {belt === "black" && (
          <Field label="Degree" htmlFor="belt_degree">
            <Select id="belt_degree" {...register("belt_degree")}>
              {Array.from({ length: MAX_BELT_DEGREE + 1 }, (_, i) => (
                <option key={i} value={i}>
                  {i}° degree
                </option>
              ))}
            </Select>
          </Field>
        )}
      </div>

      <Field label="Years training" htmlFor="years_training" required>
        <Input
          id="years_training"
          type="number"
          min={0}
          max={80}
          {...register("years_training")}
          placeholder="12"
        />
      </Field>

      <Field label="Lineage / professor" htmlFor="professor">
        <Input id="professor" {...register("professor")} placeholder="e.g. under Marcelo Garcia" />
      </Field>

      <Field label="Primary academy / team" htmlFor="academy">
        <Input id="academy" {...register("academy")} placeholder="Alliance, Atos, …" />
      </Field>

      <Field
        label="IBJJF membership number"
        htmlFor="ibjjf_number"
        hint="Optional, but boosts trust — admins verify it."
      >
        <Input id="ibjjf_number" {...register("ibjjf_number")} placeholder="e.g. 123456" />
      </Field>

      <Field label="Other affiliations">
        <Controller
          control={control}
          name="affiliations"
          render={({ field }) => (
            <ChipGroup
              options={AFFILIATIONS}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      {serverError && <Alert>{serverError}</Alert>}

      <StepFooter
        status={status}
        backHref="/onboarding/identity"
        pending={pending}
      />
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { offerSchema, type OfferInput } from "@/lib/validation/profile";
import { saveOffer } from "../actions";
import { useAutosave } from "@/hooks/use-autosave";
import { Field } from "@/components/onboarding/field";
import { StepFooter } from "@/components/onboarding/step-footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChipGroup } from "@/components/ui/chip-group";
import { Toggle } from "@/components/ui/toggle";
import { Alert } from "@/components/ui/alert";
import {
  ROLE_TYPES,
  COACHING_FOCUS,
  AVAILABILITY,
  RELOCATION_REGIONS,
} from "@/lib/constants/profile";

export function OfferForm({ initial }: { initial: OfferInput }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const [pending, setPending] = useState(false);
  const { register, control, handleSubmit } = useForm<
    z.input<typeof offerSchema>,
    unknown,
    OfferInput
  >({
    resolver: zodResolver(offerSchema),
    defaultValues: initial,
  });

  const values = useWatch({ control });
  const status = useAutosave(values, (v) => saveOffer(v));
  const openToRelocation = values.open_to_relocation;

  const onContinue = handleSubmit(async (values) => {
    setPending(true);
    const res = await saveOffer(values);
    setPending(false);
    if (res?.error) return setServerError(res.error);
    router.push("/onboarding/references");
  });

  return (
    <form onSubmit={onContinue} className="space-y-6">
      <Field
        label="Headline"
        htmlFor="headline"
        hint="One line a gym sees first."
        required
      >
        <Input
          id="headline"
          {...register("headline")}
          placeholder="Black belt competitor available for head instructor role"
        />
      </Field>

      <Field label="Bio / about" htmlFor="bio">
        <Textarea
          id="bio"
          rows={5}
          {...register("bio")}
          placeholder="Your coaching philosophy, experience, what you bring to a gym…"
        />
      </Field>

      <Field
        label="Roles open to"
        hint="Positions you'd take on at a gym — coaching and beyond."
      >
        <Controller
          control={control}
          name="roles"
          render={({ field }) => (
            <ChipGroup
              options={ROLE_TYPES}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      <Field label="Coaching focus">
        <Controller
          control={control}
          name="coaching_focus"
          render={({ field }) => (
            <ChipGroup
              options={COACHING_FOCUS}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-8">
        <Field label="Open to relocation">
          <Controller
            control={control}
            name="open_to_relocation"
            render={({ field }) => (
              <Toggle value={!!field.value} onChange={field.onChange} />
            )}
          />
        </Field>
        <Field label="Needs visa sponsorship">
          <Controller
            control={control}
            name="needs_visa"
            render={({ field }) => (
              <Toggle value={!!field.value} onChange={field.onChange} />
            )}
          />
        </Field>
      </div>

      {openToRelocation && (
        <Field label="Regions open to" hint="Where would you move for the right role?">
          <Controller
            control={control}
            name="relocation_regions"
            render={({ field }) => (
              <ChipGroup
                options={RELOCATION_REGIONS}
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </Field>
      )}

      <Field label="Availability">
        <Controller
          control={control}
          name="availability"
          render={({ field }) => (
            <ChipGroup
              options={AVAILABILITY}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      <Field label="Rate expectations" htmlFor="rate_note" hint="Optional, keep it loose.">
        <Input
          id="rate_note"
          {...register("rate_note")}
          placeholder="Negotiable / depends on package"
        />
      </Field>

      {serverError && <Alert>{serverError}</Alert>}

      <StepFooter status={status} backHref="/onboarding/record" pending={pending} />
    </form>
  );
}

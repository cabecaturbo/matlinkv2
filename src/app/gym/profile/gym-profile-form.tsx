"use client";

import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gymProfileSchema, type GymProfileInput } from "@/lib/validation/profile";
import { saveGymProfile } from "../actions";
import { useAutosave } from "@/hooks/use-autosave";
import { Field } from "@/components/onboarding/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { COUNTRIES } from "@/lib/constants/countries";

export function GymProfileForm({ initial }: { initial: GymProfileInput }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const { register, control, handleSubmit } = useForm<
    z.input<typeof gymProfileSchema>,
    unknown,
    GymProfileInput
  >({ resolver: zodResolver(gymProfileSchema), defaultValues: initial });

  const values = useWatch({ control });
  const status = useAutosave(values, (v) => saveGymProfile(v));

  const onSubmit = handleSubmit(async (v) => {
    setPending(true);
    setError(undefined);
    const r = await saveGymProfile(v);
    setPending(false);
    if (r.error) setError(r.error);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field label="Gym name" htmlFor="gym_name">
        <Input id="gym_name" {...register("gym_name")} placeholder="Apex BJJ" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Country" htmlFor="location_country">
          <Select id="location_country" {...register("location_country")}>
            <option value="">Select…</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="City" htmlFor="location_city">
          <Input id="location_city" {...register("location_city")} placeholder="Dubai" />
        </Field>
      </div>

      <Field label="Website" htmlFor="website">
        <Input id="website" {...register("website")} placeholder="https://yourgym.com" />
      </Field>

      <Field
        label="What you're looking for"
        htmlFor="looking_for"
        hint="Role, level, schedule, and what makes your gym a great place to coach."
      >
        <Textarea
          id="looking_for"
          rows={5}
          {...register("looking_for")}
          placeholder="Seeking a full-time head instructor for our competition program…"
        />
      </Field>

      {error && <Alert>{error}</Alert>}

      <div className="flex items-center justify-between border-t border-border pt-5">
        <span className="font-mono text-xs text-muted">
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : ""}
        </span>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" type="button">
              Done
            </Button>
          </Link>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

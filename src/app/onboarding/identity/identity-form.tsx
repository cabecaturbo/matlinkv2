"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { identitySchema, type IdentityInput } from "@/lib/validation/profile";
import { saveIdentity } from "../actions";
import { useAutosave } from "@/hooks/use-autosave";
import { Field } from "@/components/onboarding/field";
import { StepFooter } from "@/components/onboarding/step-footer";
import { ImageField } from "@/components/onboarding/image-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ChipGroup } from "@/components/ui/chip-group";
import { Alert } from "@/components/ui/alert";
import { COUNTRIES } from "@/lib/constants/countries";
import { LANGUAGES } from "@/lib/constants/profile";

export function IdentityForm({
  initial,
  userId,
}: {
  initial: IdentityInput;
  userId: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const [pending, setPending] = useState(false);
  const { register, control, handleSubmit, formState } =
    useForm<z.input<typeof identitySchema>, unknown, IdentityInput>({
      resolver: zodResolver(identitySchema),
      defaultValues: initial,
    });

  const values = useWatch({ control });
  const status = useAutosave(values, (v) => saveIdentity(v));

  const onContinue = handleSubmit(async (values) => {
    setPending(true);
    const res = await saveIdentity(values);
    setPending(false);
    if (res?.error) return setServerError(res.error);
    router.push("/onboarding/credentials");
  });

  return (
    <form onSubmit={onContinue} className="space-y-6">
      <Field label="Profile photo" hint="A clear, square headshot." required>
        <Controller
          control={control}
          name="photo_url"
          render={({ field }) => (
            <ImageField
              kind="photo"
              userId={userId}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      <Field label="Cover / action photo" hint="Optional — you on the mats.">
        <Controller
          control={control}
          name="cover_url"
          render={({ field }) => (
            <ImageField
              kind="cover"
              userId={userId}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      <Field label="Full name" htmlFor="full_name" required>
        <Input id="full_name" {...register("full_name")} placeholder="Rafael Silva" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date of birth" htmlFor="dob" hint="Used to show your age.">
          <Input id="dob" type="date" {...register("dob")} />
        </Field>
        <Field label="Nationality" htmlFor="nationality" required>
          <Select id="nationality" {...register("nationality")}>
            <option value="">Select…</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Current country" htmlFor="location_country" required>
          <Select id="location_country" {...register("location_country")}>
            <option value="">Select…</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Current city" htmlFor="location_city">
          <Input id="location_city" {...register("location_city")} placeholder="São Paulo" />
        </Field>
      </div>

      <Field label="Languages spoken" hint="Important for international placements.">
        <Controller
          control={control}
          name="languages"
          render={({ field }) => (
            <ChipGroup
              options={LANGUAGES}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      {serverError && <Alert>{serverError}</Alert>}

      <StepFooter
        status={status}
        backHref={null}
        pending={pending || formState.isSubmitting}
      />
    </form>
  );
}

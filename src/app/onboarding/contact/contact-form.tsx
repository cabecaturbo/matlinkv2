"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validation/profile";
import { saveContact, submitForReview } from "../actions";
import { useAutosave } from "@/hooks/use-autosave";
import { Field } from "@/components/onboarding/field";
import { StepFooter } from "@/components/onboarding/step-footer";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export function ContactForm({ initial }: { initial: ContactInput }) {
  const [serverError, setServerError] = useState<string>();
  const [pending, setPending] = useState(false);
  const { register, control, handleSubmit, formState } = useForm<
    z.input<typeof contactSchema>,
    unknown,
    ContactInput
  >({
    resolver: zodResolver(contactSchema),
    defaultValues: initial,
  });

  const values = useWatch({ control });
  const status = useAutosave(values, (v) => saveContact(v));

  const onSubmit = handleSubmit(async (values) => {
    setPending(true);
    setServerError(undefined);
    const saved = await saveContact(values);
    if (saved?.error) {
      setPending(false);
      return setServerError(saved.error);
    }
    const res = await submitForReview();
    setPending(false);
    if (res?.error) setServerError(res.error);
    // on success the server action redirects to /dashboard
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field
        label="WhatsApp number"
        htmlFor="whatsapp_e164"
        hint="International format, e.g. +5511999999999. This is how gyms reach you."
        required
      >
        <Input
          id="whatsapp_e164"
          {...register("whatsapp_e164")}
          placeholder="+5511999999999"
        />
        {formState.errors.whatsapp_e164 && (
          <p className="mt-1 text-xs text-danger">
            {formState.errors.whatsapp_e164.message}
          </p>
        )}
      </Field>

      <Field label="Public email" htmlFor="public_email" hint="Optional.">
        <Input
          id="public_email"
          type="email"
          {...register("public_email")}
          placeholder="you@example.com"
        />
        {formState.errors.public_email && (
          <p className="mt-1 text-xs text-danger">
            {formState.errors.public_email.message}
          </p>
        )}
      </Field>

      <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted">
        Submitting publishes your profile and sends it to MatLink for
        verification. You can keep editing afterward.
      </div>

      {serverError && <Alert>{serverError}</Alert>}

      <StepFooter
        status={status}
        backHref="/onboarding/references"
        continueLabel="Submit for review"
        pending={pending}
      />
    </form>
  );
}

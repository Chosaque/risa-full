"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitContact, type SubmissionState } from "@/actions/submissions";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { t, type Locale } from "@/lib/i18n";

const INITIAL: SubmissionState = { ok: false };

const EMPTY = { name: "", email: "", phone: "", subject: "", message: "" };

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(submitContact, INITIAL);
  const [values, setValues] = useState(EMPTY);

  const set =
    (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const errors = state.fieldErrors ?? {};
  const label = {
    name: t(locale, "name"),
    email: t(locale, "email"),
    phone: t(locale, "phone"),
    subject: t(locale, "subject"),
    message: t(locale, "message"),
  };

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-8">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 className="size-5" strokeWidth={1.7} aria-hidden />
        </span>
        <p className="text-[17px] font-semibold">{t(locale, "sentOk")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {/* Honeypot: only a bot ever fills this in. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={label.name} required>
          <Input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            aria-label={label.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            value={values.name}
            onChange={set("name")}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 text-[13px] text-red-600">
              {errors.name}
            </p>
          )}
        </Field>

        <Field label={label.email} required>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-label={label.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            value={values.email}
            onChange={set("email")}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1.5 text-[13px] text-red-600">
              {errors.email}
            </p>
          )}
        </Field>
      </div>

      <Field label={label.phone}>
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          aria-label={label.phone}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          value={values.phone}
          onChange={set("phone")}
        />
        {errors.phone && (
          <p id="contact-phone-error" className="mt-1.5 text-[13px] text-red-600">
            {errors.phone}
          </p>
        )}
      </Field>

      <Field label={label.subject} required>
        <Input
          id="contact-subject"
          name="subject"
          required
          aria-label={label.subject}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          value={values.subject}
          onChange={set("subject")}
        />
        {errors.subject && (
          <p id="contact-subject-error" className="mt-1.5 text-[13px] text-red-600">
            {errors.subject}
          </p>
        )}
      </Field>

      <Field label={label.message} required>
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          aria-label={label.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          value={values.message}
          onChange={set("message")}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-[13px] text-red-600">
            {errors.message}
          </p>
        )}
      </Field>

      {state.error && (
        <p role="alert" className="rounded-lg border border-red-600/25 bg-red-600/5 px-4 py-3 text-[14px] text-red-600">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="accent" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? t(locale, "sending") : t(locale, "submit")}
      </Button>
    </form>
  );
}

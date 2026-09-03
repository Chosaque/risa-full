"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitMembership, type SubmissionState } from "@/actions/submissions";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { t, type Locale } from "@/lib/i18n";

const INITIAL: SubmissionState = { ok: false };

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  position: "",
  membership_type: "ordinary",
  message: "",
};

/**
 * Membership tiers are a fixed enum on the server, so their labels live here
 * rather than in `list_items` — the visible tier cards stay admin-editable.
 */
const TYPE_LABELS = {
  th: {
    field: "ประเภทสมาชิก",
    ordinary: "สมาชิกสามัญ",
    student: "สมาชิกนักศึกษา",
    corporate: "สมาชิกนิติบุคคล",
  },
  en: {
    field: "Membership type",
    ordinary: "Ordinary member",
    student: "Student member",
    corporate: "Corporate member",
  },
} as const;

export function MembershipForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(submitMembership, INITIAL);
  const [values, setValues] = useState(EMPTY);

  const set =
    (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const errors = state.fieldErrors ?? {};
  const types = TYPE_LABELS[locale];
  const label = {
    name: t(locale, "name"),
    email: t(locale, "email"),
    phone: t(locale, "phone"),
    organization: t(locale, "organization"),
    position: t(locale, "position"),
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
        <label htmlFor="membership-website">Website</label>
        <input
          id="membership-website"
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
            id="membership-name"
            name="name"
            required
            autoComplete="name"
            aria-label={label.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "membership-name-error" : undefined}
            value={values.name}
            onChange={set("name")}
          />
          {errors.name && (
            <p id="membership-name-error" className="mt-1.5 text-[13px] text-red-600">
              {errors.name}
            </p>
          )}
        </Field>

        <Field label={label.email} required>
          <Input
            id="membership-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-label={label.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "membership-email-error" : undefined}
            value={values.email}
            onChange={set("email")}
          />
          {errors.email && (
            <p id="membership-email-error" className="mt-1.5 text-[13px] text-red-600">
              {errors.email}
            </p>
          )}
        </Field>

        <Field label={label.phone} required>
          <Input
            id="membership-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            aria-label={label.phone}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "membership-phone-error" : undefined}
            value={values.phone}
            onChange={set("phone")}
          />
          {errors.phone && (
            <p id="membership-phone-error" className="mt-1.5 text-[13px] text-red-600">
              {errors.phone}
            </p>
          )}
        </Field>

        <Field label={types.field} required>
          <Select
            id="membership-type"
            name="membership_type"
            required
            aria-label={types.field}
            aria-invalid={errors.membership_type ? true : undefined}
            aria-describedby={errors.membership_type ? "membership-type-error" : undefined}
            value={values.membership_type}
            onChange={set("membership_type")}
          >
            <option value="ordinary">{types.ordinary}</option>
            <option value="student">{types.student}</option>
            <option value="corporate">{types.corporate}</option>
          </Select>
          {errors.membership_type && (
            <p id="membership-type-error" className="mt-1.5 text-[13px] text-red-600">
              {errors.membership_type}
            </p>
          )}
        </Field>

        <Field label={label.organization}>
          <Input
            id="membership-organization"
            name="organization"
            autoComplete="organization"
            aria-label={label.organization}
            aria-invalid={errors.organization ? true : undefined}
            aria-describedby={errors.organization ? "membership-organization-error" : undefined}
            value={values.organization}
            onChange={set("organization")}
          />
          {errors.organization && (
            <p id="membership-organization-error" className="mt-1.5 text-[13px] text-red-600">
              {errors.organization}
            </p>
          )}
        </Field>

        <Field label={label.position}>
          <Input
            id="membership-position"
            name="position"
            autoComplete="organization-title"
            aria-label={label.position}
            aria-invalid={errors.position ? true : undefined}
            aria-describedby={errors.position ? "membership-position-error" : undefined}
            value={values.position}
            onChange={set("position")}
          />
          {errors.position && (
            <p id="membership-position-error" className="mt-1.5 text-[13px] text-red-600">
              {errors.position}
            </p>
          )}
        </Field>
      </div>

      <Field label={label.message}>
        <Textarea
          id="membership-message"
          name="message"
          rows={5}
          aria-label={label.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "membership-message-error" : undefined}
          value={values.message}
          onChange={set("message")}
        />
        {errors.message && (
          <p id="membership-message-error" className="mt-1.5 text-[13px] text-red-600">
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

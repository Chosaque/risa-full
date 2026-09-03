"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { sql } from "@/lib/db";

export type SubmissionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

/** More than this many rows from one IP inside the window is treated as abuse. */
const RATE_LIMIT = 5;

const GENERIC_ERROR = "ส่งข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง";
const RATE_LIMIT_ERROR =
  "คุณส่งข้อมูลถี่เกินไป กรุณารอสักครู่แล้วลองอีกครั้ง";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อ-นามสกุล")
    .max(120, "ชื่อยาวเกินไป"),
  email: z
    .string()
    .trim()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง")
    .max(160, "อีเมลยาวเกินไป"),
  phone: z.string().trim().max(40, "เบอร์โทรศัพท์ยาวเกินไป"),
  subject: z
    .string()
    .trim()
    .min(1, "กรุณากรอกหัวข้อที่ต้องการติดต่อ")
    .max(160, "หัวข้อยาวเกินไป"),
  message: z
    .string()
    .trim()
    .min(10, "กรุณาพิมพ์ข้อความอย่างน้อย 10 ตัวอักษร")
    .max(4000, "ข้อความยาวเกินไป"),
});

const membershipSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อ-นามสกุล")
    .max(120, "ชื่อยาวเกินไป"),
  email: z
    .string()
    .trim()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง")
    .max(160, "อีเมลยาวเกินไป"),
  phone: z
    .string()
    .trim()
    .min(6, "กรุณากรอกเบอร์โทรศัพท์ที่ติดต่อได้")
    .max(40, "เบอร์โทรศัพท์ยาวเกินไป"),
  organization: z.string().trim().max(160, "ชื่อหน่วยงานยาวเกินไป"),
  position: z.string().trim().max(120, "ชื่อตำแหน่งยาวเกินไป"),
  membership_type: z.enum(["ordinary", "student", "corporate"], {
    error: "กรุณาเลือกประเภทสมาชิก",
  }),
  message: z.string().trim().max(4000, "ข้อความยาวเกินไป"),
});

/** First message per field, keyed by the input `name` the browser posted. */
function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in out)) out[field] = issue.message;
  }
  return out;
}

function text(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

/** Bots fill every input they find; a human never sees this one. */
function isBot(formData: FormData): boolean {
  return text(formData, "website").trim() !== "";
}

async function clientIp(): Promise<string> {
  return (await headers()).get("x-forwarded-for") ?? "";
}

async function isRateLimited(ip: string): Promise<boolean> {
  if (!ip) return false;
  const [row] = await sql<{ n: number }[]>`
    select count(*)::int as n from submissions
    where ip = ${ip} and created_at > now() - interval '10 minutes'`;
  return (row?.n ?? 0) > RATE_LIMIT;
}

export async function submitContact(
  prevState: SubmissionState,
  formData: FormData,
): Promise<SubmissionState> {
  if (isBot(formData)) return { ok: true };

  const parsed = contactSchema.safeParse({
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    subject: text(formData, "subject"),
    message: text(formData, "message"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "กรุณาตรวจสอบข้อมูลที่กรอกอีกครั้ง",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  try {
    const ip = await clientIp();
    if (await isRateLimited(ip)) return { ok: false, error: RATE_LIMIT_ERROR };

    await sql`
      insert into submissions (kind, name, email, subject, payload, ip)
      values ('contact', ${data.name}, ${data.email}, ${data.subject},
              ${sql.json({ phone: data.phone, message: data.message })}, ${ip})`;
    return { ok: true };
  } catch {
    return { ok: false, error: GENERIC_ERROR };
  }
}

export async function submitMembership(
  prevState: SubmissionState,
  formData: FormData,
): Promise<SubmissionState> {
  if (isBot(formData)) return { ok: true };

  const parsed = membershipSchema.safeParse({
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    organization: text(formData, "organization"),
    position: text(formData, "position"),
    membership_type: text(formData, "membership_type"),
    message: text(formData, "message"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "กรุณาตรวจสอบข้อมูลที่กรอกอีกครั้ง",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  try {
    const ip = await clientIp();
    if (await isRateLimited(ip)) return { ok: false, error: RATE_LIMIT_ERROR };

    await sql`
      insert into submissions (kind, name, email, subject, payload, ip)
      values ('membership', ${data.name}, ${data.email},
              ${`ใบสมัครสมาชิก · ${data.membership_type}`},
              ${sql.json({
                phone: data.phone,
                organization: data.organization,
                position: data.position,
                membership_type: data.membership_type,
                message: data.message,
              })}, ${ip})`;
    return { ok: true };
  } catch {
    return { ok: false, error: GENERIC_ERROR };
  }
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSession, destroySession, verifyLogin } from "@/lib/auth";

const LoginSchema = z.object({
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }

  const user = await verifyLogin(parsed.data.email, parsed.data.password);
  if (!user) return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };

  await createSession(user);
  const next = String(formData.get("next") || "/admin");
  redirect(next.startsWith("/") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

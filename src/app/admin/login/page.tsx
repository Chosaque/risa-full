import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "เข้าสู่ระบบ · RISA Admin" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await getCurrentUser()) redirect("/admin");
  const { next } = await searchParams;
  const target = typeof next === "string" && next.startsWith("/") ? next : "/admin";

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/risa-lockup.png" alt="RISA" className="h-12 w-auto" />
        </div>
        <div className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
          <h1 className="mb-1 text-lg font-semibold">เข้าสู่ระบบผู้ดูแล</h1>
          <p className="mb-6 text-sm text-muted">สำหรับเจ้าหน้าที่สมาคมเท่านั้น</p>
          <LoginForm next={target} />
        </div>
      </div>
    </div>
  );
}

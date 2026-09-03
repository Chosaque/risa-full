import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/admin/ui";
import { UsersScreen } from "@/components/admin/UsersScreen";

type User = {
  id: string; email: string; name: string; role: "admin" | "editor";
  created_at: string; last_login_at: string | null;
};

export default async function UsersPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/login?next=/admin/users");
  if (me.role !== "admin") redirect("/admin");

  const users = await sql<User[]>`
    select id, email, name, role, created_at, last_login_at
    from admin_users order by created_at asc`;

  return (
    <div>
      <PageHeader title="ผู้ดูแลระบบ" description="จัดการบัญชีเจ้าหน้าที่ที่เข้าถึงระบบหลังบ้าน" />
      <UsersScreen initial={users} currentUserId={me.id} />
    </div>
  );
}

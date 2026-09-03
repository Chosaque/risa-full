import { sql } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { SubmissionsInbox } from "@/components/admin/SubmissionsInbox";

type Submission = {
  id: string; kind: "contact" | "membership" | "job";
  name: string; email: string; subject: string;
  payload: Record<string, unknown>; status: "new" | "read" | "archived";
  notes: string; created_at: string;
};

export default async function SubmissionsPage() {
  const items = await sql<Submission[]>`
    select id, kind, name, email, subject, payload, status, notes, created_at
    from submissions order by created_at desc limit 500`;

  return (
    <div>
      <PageHeader title="กล่องข้อความ" description="ข้อความจากฟอร์มติดต่อ สมัครสมาชิก และสมัครงาน" />
      <SubmissionsInbox items={items} />
    </div>
  );
}

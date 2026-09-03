import { sql } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { MediaLibraryScreen } from "@/components/admin/MediaLibraryScreen";

export default async function MediaPage() {
  const items = await sql<
    { id: string; url: string; filename: string; mime: string; size_bytes: number | null; created_at: string }[]
  >`select id, url, filename, mime, size_bytes, created_at from media order by created_at desc limit 300`;

  return (
    <div>
      <PageHeader title="คลังไฟล์" description="รูปภาพและเอกสารทั้งหมดที่เคยอัปโหลดเข้าระบบ" />
      <MediaLibraryScreen initial={items} />
    </div>
  );
}

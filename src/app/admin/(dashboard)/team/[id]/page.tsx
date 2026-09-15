import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { getCollection } from "@/components/admin/collection-config";
import { getRow } from "@/components/admin/collection-data";
import { PageHeader } from "@/components/admin/ui";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const config = getCollection("team");
  const initial = id === "new" ? null : await getRow("team", id);
  if (id !== "new" && !initial) notFound();
  return <div>
    <PageHeader title={id === "new" ? "เพิ่มบุคลากร" : "แก้ไขบุคลากร"} description="รูปถ่ายจะอยู่ในกรอบอัตโนมัติ อีเมลและเบอร์โทรที่ใส่จะเปิดเผยบนเว็บไซต์เมื่อเลือกเผยแพร่" />
    <CollectionForm key={id} config={config} initial={initial} backHref={config.adminPath} />
  </div>;
}

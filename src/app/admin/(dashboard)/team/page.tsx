import Link from "next/link";
import { CollectionListScreen } from "@/components/admin/CollectionTable";
import { getCollection } from "@/components/admin/collection-config";
import { listRows } from "@/components/admin/collection-data";

export default async function Page() {
  const config = getCollection("team");
  const rows = await listRows("team");
  return <>
    <div className="mb-6 rounded-lg border border-line bg-surface p-5 text-sm leading-relaxed text-muted">
      <p>เพิ่มบุคลากร → ใส่ชื่อ ตำแหน่ง รูปภาพ และช่องทางติดต่อ → บันทึกเป็นฉบับร่าง → เลือกเผยแพร่เมื่อพร้อม</p>
      <p className="mt-2">รูปภาพจะมีกรอบให้อัตโนมัติ แก้ไขหรือจัดลำดับได้จากรายการด้านล่าง ใช้เฉพาะภาพและข้อมูลติดต่อที่เจ้าของอนุญาตให้เผยแพร่</p>
      <Link href="/th/team" className="mt-3 inline-block text-accent underline underline-offset-4">ดูหน้าบุคลากร ↗</Link>
    </div>
    <CollectionListScreen config={config} rows={rows} />
  </>;
}

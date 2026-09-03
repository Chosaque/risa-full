import { CollectionTable } from "@/components/admin/CollectionTable";
import { getCollection } from "@/components/admin/collection-config";
import { listRows } from "@/components/admin/collection-data";
import { Card, CardHead, PageHeader } from "@/components/admin/ui";
import { LIST_DEFS } from "@/content/registry";

export default async function Page() {
  const config = getCollection("list_items");
  const groups = await Promise.all(
    LIST_DEFS.map(async (def) => ({ def, rows: await listRows("list_items", def.key) })),
  );

  return (
    <div>
      <PageHeader
        title="รายการย่อย"
        description="กลุ่มข้อมูลที่แสดงเป็นการ์ดหรือรายการซ้ำ ๆ บนหน้าเว็บ — เพิ่ม แก้ไข หรือจัดลำดับได้อิสระในแต่ละกลุ่ม"
      />
      <div className="space-y-6">
        {groups.map(({ def, rows }) => (
          <Card key={def.key}>
            <CardHead title={def.label} hint={def.key} />
            <div className="p-5">
              <CollectionTable
                config={config}
                rows={rows}
                scopeValue={def.key}
                hrefFor={(id) => `/admin/lists/${encodeURIComponent(def.key)}/${id}`}
                newHref={`/admin/lists/${encodeURIComponent(def.key)}/new`}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

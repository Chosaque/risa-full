import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { getCollection } from "@/components/admin/collection-config";
import { getRow } from "@/components/admin/collection-data";
import { PageHeader } from "@/components/admin/ui";
import { LIST_DEFS } from "@/content/registry";

export default async function Page({
  params,
}: PageProps<"/admin/lists/[listKey]/[id]">) {
  const { listKey, id } = await params;
  const key = decodeURIComponent(listKey);
  const def = LIST_DEFS.find((d) => d.key === key);
  if (!def) notFound();

  const config = getCollection("list_items");
  const initial = id === "new" ? null : await getRow("list_items", id);
  if (id !== "new" && !initial) notFound();

  return (
    <div>
      <PageHeader title={`${id === "new" ? "เพิ่มรายการ" : "แก้ไขรายการ"} · ${def.label}`} />
      <CollectionForm
        key={id}
        config={config}
        initial={initial}
        scope={{ list_key: key }}
        backHref="/admin/lists"
      />
    </div>
  );
}

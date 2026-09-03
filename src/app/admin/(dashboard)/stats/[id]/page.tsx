import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { getCollection } from "@/components/admin/collection-config";
import { getRow } from "@/components/admin/collection-data";
import { PageHeader } from "@/components/admin/ui";

export default async function Page({ params }: PageProps<"/admin/stats/[id]">) {
  const { id } = await params;
  const config = getCollection("stats");
  const initial = id === "new" ? null : await getRow("stats", id);
  if (id !== "new" && !initial) notFound();

  return (
    <div>
      <PageHeader title={id === "new" ? `เพิ่ม${config.singular}` : `แก้ไข${config.singular}`} />
      <CollectionForm key={id} config={config} initial={initial} backHref={config.adminPath} />
    </div>
  );
}

import { CollectionListScreen } from "@/components/admin/CollectionTable";
import { getCollection } from "@/components/admin/collection-config";
import { listRows } from "@/components/admin/collection-data";

export default async function Page() {
  const config = getCollection("gallery");
  const rows = await listRows("gallery");
  return (
    <CollectionListScreen
      config={config}
      rows={rows}
      description="แต่ละอัลบั้มจัดการภาพย่อยได้จากหน้ารายละเอียด"
    />
  );
}

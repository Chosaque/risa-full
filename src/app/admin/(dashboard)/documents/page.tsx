import { CollectionListScreen } from "@/components/admin/CollectionTable";
import { getCollection } from "@/components/admin/collection-config";
import { listRows } from "@/components/admin/collection-data";

export default async function Page() {
  const config = getCollection("documents");
  const rows = await listRows("documents");
  return <CollectionListScreen config={config} rows={rows} />;
}

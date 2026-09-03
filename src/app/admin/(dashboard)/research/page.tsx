import { CollectionListScreen } from "@/components/admin/CollectionTable";
import { getCollection } from "@/components/admin/collection-config";
import { listRows } from "@/components/admin/collection-data";

export default async function Page() {
  const config = getCollection("research");
  const rows = await listRows("research");
  return <CollectionListScreen config={config} rows={rows} />;
}

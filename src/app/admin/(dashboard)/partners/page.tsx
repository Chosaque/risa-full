import { CollectionListScreen } from "@/components/admin/CollectionTable";
import { getCollection } from "@/components/admin/collection-config";
import { listRows } from "@/components/admin/collection-data";

export default async function Page() {
  const config = getCollection("partners");
  const rows = await listRows("partners");
  return <CollectionListScreen config={config} rows={rows} />;
}

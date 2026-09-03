import { CollectionListScreen } from "@/components/admin/CollectionTable";
import { getCollection } from "@/components/admin/collection-config";
import { listRows } from "@/components/admin/collection-data";

export default async function Page() {
  const config = getCollection("committee");
  const rows = await listRows("committee");
  return <CollectionListScreen config={config} rows={rows} />;
}

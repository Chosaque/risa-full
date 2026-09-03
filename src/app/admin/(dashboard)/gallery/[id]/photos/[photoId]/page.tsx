import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { getCollection } from "@/components/admin/collection-config";
import { getRow } from "@/components/admin/collection-data";
import { PageHeader } from "@/components/admin/ui";

export default async function Page({
  params,
}: PageProps<"/admin/gallery/[id]/photos/[photoId]">) {
  const { id, photoId } = await params;
  const config = getCollection("gallery_photos");
  const initial = photoId === "new" ? null : await getRow("gallery_photos", photoId);
  if (photoId !== "new" && !initial) notFound();

  return (
    <div>
      <PageHeader title={photoId === "new" ? "เพิ่มภาพ" : "แก้ไขภาพ"} />
      <CollectionForm
        key={photoId}
        config={config}
        initial={initial}
        scope={{ album_id: id }}
        backHref={`/admin/gallery/${id}`}
      />
    </div>
  );
}

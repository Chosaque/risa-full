import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { CollectionTable } from "@/components/admin/CollectionTable";
import { getCollection } from "@/components/admin/collection-config";
import { getRow, listRows } from "@/components/admin/collection-data";
import { Card, CardHead, PageHeader } from "@/components/admin/ui";
import { AddPhotoButton } from "@/components/admin/AddPhotoButton";

export default async function Page({ params }: PageProps<"/admin/gallery/[id]">) {
  const { id } = await params;
  const config = getCollection("gallery");
  const initial = id === "new" ? null : await getRow("gallery", id);
  if (id !== "new" && !initial) notFound();

  const photoConfig = getCollection("gallery_photos");
  const photos = id === "new" ? [] : await listRows("gallery_photos", id);

  return (
    <div>
      <PageHeader title={id === "new" ? "เพิ่มอัลบั้ม" : "แก้ไขอัลบั้ม"} />
      <CollectionForm
        key={id}
        config={config}
        initial={initial}
        backHref="/admin/gallery"
        createdHref={(newId) => `/admin/gallery/${newId}`}
      />

      {id !== "new" && (
        <div className="mt-8">
          <Card>
            <CardHead
              title="ภาพในอัลบั้ม"
              hint={`${photos.length} ภาพ`}
              actions={<AddPhotoButton albumId={id} />}
            />
            <div className="p-5">
              <CollectionTable
                config={photoConfig}
                rows={photos}
                scopeValue={id}
                hrefFor={(photoId) => `/admin/gallery/${id}/photos/${photoId}`}
                hideNew
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

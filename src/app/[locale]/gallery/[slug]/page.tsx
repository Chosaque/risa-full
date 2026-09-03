import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLocale } from "@/lib/request";
import { formatDate, localePath, pick, t } from "@/lib/i18n";
import { getAlbumBySlug, getAlbumPhotos } from "@/lib/queries";
import { Placeholder } from "@/components/site/Placeholder";
import { EmptyState } from "@/components/site/EmptyState";
import { CtaBand } from "@/components/site/CtaBand";

/** Cycled so a wall of empty slots still reads as a photo wall, not a grid. */
const RATIOS = ["aspect-[4/3]", "aspect-[3/4]", "aspect-square", "aspect-[16/10]"];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/gallery/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const album = await getAlbumBySlug(slug);
  if (!album) return {};
  return {
    title: pick(album, "title", locale),
    description: pick(album, "description", locale),
  };
}

export default async function AlbumPage({ params }: PageProps<"/[locale]/gallery/[slug]">) {
  const { slug } = await params;
  const locale = await getLocale();
  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  const photos = await getAlbumPhotos(album.id);

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-12 md:py-16">
          <Link
            href={localePath(locale, "/gallery")}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            {t(locale, "back")}
          </Link>
          <h1 className="max-w-3xl text-[1.9rem] font-semibold leading-tight md:text-[2.5rem]">
            {pick(album, "title", locale)}
          </h1>
          {pick(album, "description", locale) && (
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
              {pick(album, "description", locale)}
            </p>
          )}
          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-faint">
            {album.event_date && (
              <time dateTime={album.event_date}>{formatDate(album.event_date, locale)}</time>
            )}
            {album.event_date && photos.length > 0 && <span aria-hidden>·</span>}
            {photos.length > 0 && (
              <span>
                {photos.length} {t(locale, "photos")}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="container-page py-12 md:py-16">
        {photos.length === 0 ? (
          <EmptyState label={t(locale, "noResults")} />
        ) : (
          <div className="gap-5 sm:columns-2 lg:columns-3">
            {photos.map((photo, i) => (
              <figure key={photo.id} className="mb-5 break-inside-avoid">
                <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                  {photo.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.image_url}
                      alt={pick(photo, "caption", locale)}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  ) : (
                    <Placeholder
                      seed={photo.id}
                      className={`w-full ${RATIOS[i % RATIOS.length]}`}
                    />
                  )}
                </div>
                {pick(photo, "caption", locale) && (
                  <figcaption className="mt-2.5 px-1 text-[13px] leading-relaxed text-muted">
                    {pick(photo, "caption", locale)}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>

      <CtaBand />
    </>
  );
}

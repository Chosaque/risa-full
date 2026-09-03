import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { formatDate, localePath, pick, t } from "@/lib/i18n";
import { getAlbums } from "@/lib/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Placeholder } from "@/components/site/Placeholder";
import { EmptyState } from "@/components/site/EmptyState";
import { CtaBand } from "@/components/site/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: await content("gallery.seo.title", locale),
    description: await content("gallery.seo.description", locale),
  };
}

export default async function GalleryPage() {
  const [locale, albums] = await Promise.all([getLocale(), getAlbums()]);

  return (
    <>
      <PageHero
        eyebrowKey="gallery.hero.eyebrow"
        titleKey="gallery.hero.title"
        subtitleKey="gallery.hero.subtitle"
      />

      <Section>
        {albums.length === 0 ? (
          <EmptyState label={t(locale, "noResults")} />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <li key={album.id}>
                <Link
                  href={localePath(locale, `/gallery/${album.slug}`)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-colors hover:border-ink/25"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-surface">
                    {album.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={album.cover_url}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <Placeholder seed={album.slug} className="size-full" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-[17px] font-semibold leading-snug">
                      {pick(album, "title", locale)}
                    </h2>
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
                      {album.event_date && (
                        <time dateTime={album.event_date}>{formatDate(album.event_date, locale)}</time>
                      )}
                      {album.event_date && album.photo_count != null && (
                        <span aria-hidden className="text-faint">·</span>
                      )}
                      {album.photo_count != null && (
                        <span>
                          {album.photo_count} {t(locale, "photos")}
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <CtaBand />
    </>
  );
}

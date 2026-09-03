import type { Metadata } from "next";
import { content } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { t } from "@/lib/i18n";
import { countNews, getNews } from "@/lib/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { NewsCard } from "@/components/site/Cards";
import { EmptyState } from "@/components/site/EmptyState";
import { Pagination } from "@/components/site/Pagination";
import { CtaBand } from "@/components/site/CtaBand";

const PER_PAGE = 9;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: await content("news.seo.title", locale),
    description: await content("news.seo.description", locale),
  };
}

export default async function NewsPage({ searchParams }: PageProps<"/[locale]/news">) {
  const locale = await getLocale();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const [items, total] = await Promise.all([
    getNews(PER_PAGE, (page - 1) * PER_PAGE),
    countNews(),
  ]);

  return (
    <>
      <PageHero eyebrowKey="news.hero.eyebrow" titleKey="news.hero.title" subtitleKey="news.hero.subtitle" />
      <Section>
        {items.length === 0 ? (
          <EmptyState label={t(locale, "noResults")} />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => <NewsCard key={item.id} item={item} locale={locale} />)}
            </div>
            <Pagination
              page={page}
              pageCount={Math.ceil(total / PER_PAGE)}
              basePath={`/${locale}/news`}
              locale={locale}
            />
          </>
        )}
      </Section>
      <CtaBand />
    </>
  );
}

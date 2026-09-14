import type { Metadata } from "next";
import { ExternalLink, FileText } from "lucide-react";
import { content } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { pick, t } from "@/lib/i18n";
import { getResearch, type ResearchItem } from "@/lib/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { EmptyState } from "@/components/site/EmptyState";
import { CtaBand } from "@/components/site/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: await content("research.seo.title", locale),
    description: await content("research.seo.description", locale),
  };
}

/** Newest year first; items keep the admin's sort order inside each year. */
function groupByYear(items: ResearchItem[]): [number, ResearchItem[]][] {
  const groups = new Map<number, ResearchItem[]>();
  for (const item of items) {
    const list = groups.get(item.year);
    if (list) list.push(item);
    else groups.set(item.year, [item]);
  }
  return [...groups.entries()].sort((a, b) => b[0] - a[0]);
}

export default async function ResearchPage() {
  const [locale, items] = await Promise.all([getLocale(), getResearch()]);
  const years = groupByYear(items);

  return (
    <>
      <PageHero
        eyebrowKey="research.hero.eyebrow"
        titleKey="research.hero.title"
        subtitleKey="research.hero.subtitle"
      />

      <Section>
        {items.length === 0 ? (
          <EmptyState label={t(locale, "noResults")} />
        ) : (
          <div className="space-y-14">
            {years.map(([year, list]) => (
              <div key={year} className="grid gap-5 lg:grid-cols-12 lg:gap-10">
                <h2 className="font-mono text-[15px] font-semibold tracking-wide text-accent lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
                  {year}
                </h2>
                <ul className="border-t border-line lg:col-span-10">
                  {list.map((item) => (
                    <li key={item.id} className="border-b border-line py-6">
                      {item.cover_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.cover_url} alt={pick(item, "title", locale)} className="mb-5 max-h-96 w-full object-contain object-left" loading="lazy" />
                      )}
                      <h3 className="text-[17px] font-semibold leading-snug">
                        {pick(item, "title", locale)}
                      </h3>
                      {item.authors && (
                        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{item.authors}</p>
                      )}
                      {pick(item, "venue", locale) && (
                        <p className="mt-1 text-sm text-muted">{pick(item, "venue", locale)}</p>
                      )}

                      {item.tags?.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full border border-line bg-surface px-3 py-1 text-[12.5px] text-ink-2"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}

                      {(item.doi || item.pdf_url) && (
                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                          {item.doi && (
                            <a
                              href={`https://doi.org/${item.doi}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
                            >
                              DOI
                              <ExternalLink className="size-3.5" aria-hidden />
                            </a>
                          )}
                          {item.pdf_url && (
                            <a
                              href={item.pdf_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
                            >
                              <FileText className="size-3.5" strokeWidth={1.7} aria-hidden />
                              PDF
                            </a>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Section>

      <CtaBand />
    </>
  );
}

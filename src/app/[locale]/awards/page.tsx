import type { Metadata } from "next";
import { content } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { pick, t } from "@/lib/i18n";
import { getAwards, type AwardItem } from "@/lib/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { EmptyState } from "@/components/site/EmptyState";
import { CtaBand } from "@/components/site/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: await content("awards.seo.title", locale),
    description: await content("awards.seo.description", locale),
  };
}

/** Newest year first; awards keep the admin's sort order inside each year. */
function groupByYear(items: AwardItem[]): [number, AwardItem[]][] {
  const groups = new Map<number, AwardItem[]>();
  for (const item of items) {
    const list = groups.get(item.year);
    if (list) list.push(item);
    else groups.set(item.year, [item]);
  }
  return [...groups.entries()].sort((a, b) => b[0] - a[0]);
}

export default async function AwardsPage() {
  const [locale, awards] = await Promise.all([getLocale(), getAwards()]);
  const years = groupByYear(awards);

  return (
    <>
      <PageHero
        eyebrowKey="awards.hero.eyebrow"
        titleKey="awards.hero.title"
        subtitleKey="awards.hero.subtitle"
      />

      <Section>
        {awards.length === 0 ? (
          <EmptyState label={t(locale, "noResults")} />
        ) : (
          <div className="space-y-14">
            {years.map(([year, list]) => (
              <div key={year}>
                <h2 className="mb-6 border-b border-line pb-3 font-mono text-[15px] font-semibold tracking-wide text-faint">
                  {year}
                </h2>
                <div className="grid gap-5 lg:grid-cols-2">
                  {list.map((award) => (
                    <article
                      key={award.id}
                      className="flex flex-col gap-5 rounded-2xl border border-line bg-paper p-6 sm:flex-row sm:items-start"
                    >
                      {award.photo_url && (
                        <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-line">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={award.photo_url}
                            alt={pick(award, "recipient", locale)}
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold uppercase tracking-wide text-accent">
                          {pick(award, "category", locale)}
                        </p>
                        <h3 className="mt-1.5 text-[19px] font-semibold leading-snug">
                          {pick(award, "recipient", locale)}
                        </h3>
                        {pick(award, "citation", locale) && (
                          <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                            {pick(award, "citation", locale)}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, MapPin } from "lucide-react";
import { content } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { formatDate, localePath, pick, t, type Locale } from "@/lib/i18n";
import { getJobs } from "@/lib/queries";
import { Editable } from "@/components/editable/Editable";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { EmptyState } from "@/components/site/EmptyState";
import { CtaBand } from "@/components/site/CtaBand";

/** `employment_type` is a free-text column; these are the values we ship with. */
const EMPLOYMENT_TYPES: Record<string, { th: string; en: string }> = {
  full_time: { th: "งานประจำ", en: "Full-time" },
  part_time: { th: "งานไม่เต็มเวลา", en: "Part-time" },
  contract: { th: "สัญญาจ้าง", en: "Contract" },
  temporary: { th: "งานชั่วคราว", en: "Temporary" },
  internship: { th: "ฝึกงาน", en: "Internship" },
  volunteer: { th: "อาสาสมัคร", en: "Volunteer" },
};

function employmentLabel(value: string, locale: Locale): string {
  return EMPLOYMENT_TYPES[value]?.[locale] ?? value.replace(/[_-]+/g, " ");
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: await content("careers.seo.title", locale),
    description: await content("careers.seo.description", locale),
  };
}

export default async function CareersPage() {
  const [locale, jobs] = await Promise.all([getLocale(), getJobs()]);

  return (
    <>
      <PageHero
        eyebrowKey="careers.hero.eyebrow"
        titleKey="careers.hero.title"
        subtitleKey="careers.hero.subtitle"
      >
        <Link
          href={localePath(locale, "/contact")}
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-paper px-5 text-sm font-medium transition-colors hover:border-ink hover:bg-surface"
        >
          <Editable k="careers.hero.post_label" />
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </PageHero>

      <Section>
        {jobs.length === 0 ? (
          <EmptyState label={t(locale, "noResults")} />
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-line">
            {jobs.map((job) => (
              <li key={job.id} className="border-b border-line last:border-b-0">
                <Link
                  href={localePath(locale, `/careers/${job.slug}`)}
                  className="group flex flex-col gap-5 bg-paper p-6 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:justify-between md:p-7"
                >
                  <div className="min-w-0">
                    <h2 className="text-[19px] font-semibold leading-snug">
                      {pick(job, "title", locale)}
                    </h2>
                    <p className="mt-1.5 text-[15px] text-ink-2">{pick(job, "org", locale)}</p>
                    <dl className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
                      {pick(job, "location", locale) && (
                        <div className="flex items-center gap-1.5">
                          <dt className="sr-only">{t(locale, "venue")}</dt>
                          <MapPin className="size-3.5 shrink-0 text-faint" strokeWidth={1.7} aria-hidden />
                          <dd>{pick(job, "location", locale)}</dd>
                        </div>
                      )}
                      {job.deadline && (
                        <div className="flex items-center gap-1.5">
                          <dt className="sr-only">{t(locale, "deadline")}</dt>
                          <CalendarClock className="size-3.5 shrink-0 text-faint" strokeWidth={1.7} aria-hidden />
                          <dd>
                            {t(locale, "deadline")} {formatDate(job.deadline, locale)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    {job.employment_type && (
                      <span className="rounded-full bg-accent-soft px-3 py-1 text-[12.5px] font-medium text-accent">
                        {employmentLabel(job.employment_type, locale)}
                      </span>
                    )}
                    <ArrowUpRight
                      className="size-4 text-faint transition-colors group-hover:text-accent"
                      aria-hidden
                    />
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

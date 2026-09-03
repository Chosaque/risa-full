import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Briefcase, Building2, CalendarClock, ExternalLink, MapPin,
} from "lucide-react";
import { getLocale } from "@/lib/request";
import { formatDate, localePath, pick, t, type Locale } from "@/lib/i18n";
import { getJobBySlug } from "@/lib/queries";
import { sanitizeHtml } from "@/lib/utils";
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

const EMPLOYMENT_FIELD = { th: "ประเภทการจ้างงาน", en: "Employment type" } as const;

function employmentLabel(value: string, locale: Locale): string {
  return EMPLOYMENT_TYPES[value]?.[locale] ?? value.replace(/[_-]+/g, " ");
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const job = await getJobBySlug(slug);
  if (!job) return {};
  return {
    title: pick(job, "title", locale),
    description: `${pick(job, "org", locale)} · ${pick(job, "location", locale)}`,
  };
}

export default async function JobDetailPage({ params }: PageProps<"/[locale]/careers/[slug]">) {
  const { slug } = await params;
  const locale = await getLocale();
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const applyHref = job.apply_url.startsWith("/")
    ? localePath(locale, job.apply_url)
    : job.apply_url;

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-12 md:py-16">
          <Link
            href={localePath(locale, "/careers")}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            {t(locale, "back")}
          </Link>
          <h1 className="max-w-3xl text-[1.9rem] font-semibold leading-tight md:text-[2.5rem]">
            {pick(job, "title", locale)}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            {pick(job, "org", locale)}
          </p>
        </div>
      </div>

      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-8">
          <div
            className="prose-risa"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(pick(job, "description", locale)) }}
          />
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-line bg-surface p-6">
            <dl className="space-y-5 text-sm">
              {pick(job, "org", locale) && (
                <div>
                  <dt className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-faint">
                    <Building2 className="size-3.5" strokeWidth={1.7} aria-hidden />
                    {t(locale, "organization")}
                  </dt>
                  <dd className="font-medium leading-relaxed">{pick(job, "org", locale)}</dd>
                </div>
              )}
              {pick(job, "location", locale) && (
                <div>
                  <dt className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-faint">
                    <MapPin className="size-3.5" strokeWidth={1.7} aria-hidden />
                    {t(locale, "venue")}
                  </dt>
                  <dd className="leading-relaxed">{pick(job, "location", locale)}</dd>
                </div>
              )}
              {job.employment_type && (
                <div>
                  <dt className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-faint">
                    <Briefcase className="size-3.5" strokeWidth={1.7} aria-hidden />
                    {EMPLOYMENT_FIELD[locale]}
                  </dt>
                  <dd>
                    <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-[12.5px] font-medium text-accent">
                      {employmentLabel(job.employment_type, locale)}
                    </span>
                  </dd>
                </div>
              )}
              {job.deadline && (
                <div>
                  <dt className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-faint">
                    <CalendarClock className="size-3.5" strokeWidth={1.7} aria-hidden />
                    {t(locale, "deadline")}
                  </dt>
                  <dd className="font-medium">{formatDate(job.deadline, locale)}</dd>
                </div>
              )}
            </dl>
            {job.apply_url && (
              <a
                href={applyHref}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-ink transition-[filter] hover:brightness-110"
              >
                {t(locale, "apply")}
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            )}
          </div>
        </aside>
      </div>

      <CtaBand />
    </>
  );
}

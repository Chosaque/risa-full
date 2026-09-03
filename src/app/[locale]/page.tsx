import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getContentMap, blockValue } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { localePath, pick, t } from "@/lib/i18n";
import {
  getNews, getPartners, getServiceCards, getUpcomingActivities,
} from "@/lib/queries";
import { Editable } from "@/components/editable/Editable";
import { EditableImage } from "@/components/editable/EditableImage";
import { Section, SectionHead } from "@/components/site/Section";
import { StatsStrip } from "@/components/site/StatsStrip";
import { ListSection } from "@/components/site/ListSection";
import { NewsCard, ActivityCard } from "@/components/site/Cards";
import { EmptyState } from "@/components/site/EmptyState";
import { CtaBand } from "@/components/site/CtaBand";
import { Icon } from "@/components/site/Icon";

export default async function HomePage() {
  const [locale, map, news, activities, services, partners] = await Promise.all([
    getLocale(), getContentMap(), getNews(3), getUpcomingActivities(3),
    getServiceCards(), getPartners(),
  ]);
  const L = (h: string) => (h.startsWith("/") ? localePath(locale, h) : h);
  const v = (k: string) => blockValue(map.get(k), locale);

  return (
    <>
      {/* ── hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-1/2 size-[38rem] -translate-y-1/2 rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "var(--color-accent)" }}
        />
        <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Editable
              k="home.hero.eyebrow"
              as="p"
              className="mb-5 inline-flex rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12.5px] font-medium text-ink-2"
            />
            <Editable
              k="home.hero.title"
              as="h1"
              multiline
              className="text-[2.4rem] font-semibold leading-[1.14] tracking-[-0.02em] sm:text-[3rem] lg:text-[3.4rem]"
            />
            <Editable
              k="home.hero.subtitle"
              as="p"
              className="mt-6 max-w-xl text-[17px] leading-[1.85] text-muted"
            />
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={L(v("home.hero.primary_href"))}
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-6 text-[15px] font-medium text-white transition-colors hover:bg-ink-2"
              >
                <Editable k="home.hero.primary_label" />
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={L(v("home.hero.secondary_href"))}
                className="inline-flex h-12 items-center rounded-lg border border-line bg-paper px-6 text-[15px] font-medium transition-colors hover:border-ink hover:bg-surface"
              >
                <Editable k="home.hero.secondary_label" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <EditableImage
              k="home.hero.image"
              seed="risa-hero"
              className="aspect-[4/3] rounded-2xl border border-line shadow-[0_24px_70px_-30px_rgb(10_10_11/0.35)]"
            />
          </div>
        </div>
      </section>

      {/* ── vision & mission ────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHead
              eyebrow={<Editable k="home.vision.eyebrow" />}
              title={<Editable k="home.vision.title" as="span" />}
              lead={<Editable k="home.vision.body" as="span" />}
            />
          </div>
          <div className="lg:col-span-7">
            <Editable
              k="home.vision.mission_title"
              as="h3"
              className="mb-5 text-[13px] font-semibold uppercase tracking-wider text-faint"
            />
            <ListSection listKey="home.mission" columns={2} variant="plain" />
          </div>
        </div>
      </Section>

      {/* ── numbers ─────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <SectionHead
          title={<Editable k="home.stats.title" as="span" />}
          lead={<Editable k="home.stats.body" as="span" />}
          align="center"
          className="mb-10"
        />
        <StatsStrip />
      </Section>

      {/* ── services ────────────────────────────────────────────────────── */}
      <Section>
        <SectionHead
          eyebrow={<Editable k="home.services.eyebrow" />}
          title={<Editable k="home.services.title" as="span" />}
          lead={<Editable k="home.services.body" as="span" />}
          className="mb-10"
        />
        {services.length === 0 ? (
          <EmptyState label={t(locale, "noResults")} />
        ) : (
          <ul className="grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:grid-cols-3">
            {services.map((card) => {
              const body = (
                <>
                  <span className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={card.icon} />
                  </span>
                  <h3 className="text-[17px] font-semibold">{pick(card, "title", locale)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    {pick(card, "body", locale)}
                  </p>
                  {card.href && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                      {t(locale, "readMore")}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </>
              );
              const cls = "group flex h-full flex-col bg-paper p-7 transition-colors hover:bg-surface/70";
              return (
                <li key={card.id}>
                  {card.href ? (
                    <Link href={L(card.href)} className={cls}>{body}</Link>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {/* ── news ────────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHead
            eyebrow={<Editable k="home.news.eyebrow" />}
            title={<Editable k="home.news.title" as="span" />}
          />
          <Link
            href={localePath(locale, "/news")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <Editable k="home.news.link_label" />
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {news.length === 0 ? (
          <EmptyState label={t(locale, "noResults")} />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {news.map((item) => <NewsCard key={item.id} item={item} locale={locale} />)}
          </div>
        )}
      </Section>

      {/* ── activities ──────────────────────────────────────────────────── */}
      <Section>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHead
            eyebrow={<Editable k="home.activities.eyebrow" />}
            title={<Editable k="home.activities.title" as="span" />}
          />
          <Link
            href={localePath(locale, "/activities")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <Editable k="home.activities.link_label" />
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {activities.length === 0 ? (
          <EmptyState label={t(locale, "noResults")} />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {activities.map((item) => <ActivityCard key={item.id} item={item} locale={locale} />)}
          </div>
        )}
      </Section>

      {/* ── partners ────────────────────────────────────────────────────── */}
      {partners.length > 0 && (
        <Section tone="surface" className="py-14 md:py-16">
          <SectionHead
            title={<Editable k="home.partners.title" as="span" />}
            lead={<Editable k="home.partners.body" as="span" />}
            align="center"
            className="mb-9"
          />
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((p) => (
              <li key={p.id} className="flex min-h-24 items-center justify-center bg-paper p-5 text-center">
                {p.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logo_url} alt={p.name} className="max-h-10 w-auto opacity-70" loading="lazy" />
                ) : (
                  <span className="text-[12.5px] leading-snug text-muted">{p.name}</span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand />
    </>
  );
}

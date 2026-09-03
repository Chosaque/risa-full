import type { Metadata } from "next";
import { content } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { pick } from "@/lib/i18n";
import { getTimeline } from "@/lib/queries";
import { Editable, EditableRich } from "@/components/editable/Editable";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHead } from "@/components/site/Section";
import { ListSection } from "@/components/site/ListSection";
import { StatsStrip } from "@/components/site/StatsStrip";
import { CtaBand } from "@/components/site/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: await content("about.seo.title", locale),
    description: await content("about.seo.description", locale),
  };
}

export default async function AboutPage() {
  const [locale, timeline] = await Promise.all([getLocale(), getTimeline()]);

  return (
    <>
      <PageHero
        eyebrowKey="about.hero.eyebrow"
        titleKey="about.hero.title"
        subtitleKey="about.hero.subtitle"
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Editable
              k="about.vision.title"
              as="h2"
              className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent"
            />
            <EditableRich
              k="about.vision.body"
              className="mt-4 text-[22px] font-medium leading-[1.6] text-ink md:text-[26px]"
            />
          </div>
          <div className="lg:col-span-7">
            <Editable
              k="about.objectives.title"
              as="h2"
              className="mb-5 text-[13px] font-semibold uppercase tracking-wider text-faint"
            />
            <ListSection listKey="about.objectives" columns={2} variant="plain" />
          </div>
        </div>
      </Section>

      {/* ── timeline ────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <SectionHead
          title={<Editable k="about.timeline.title" as="span" />}
          lead={<Editable k="about.timeline.body" as="span" />}
          className="mb-12"
        />
        <ol className="relative border-l border-line pl-8 md:pl-10">
          {timeline.map((event) => (
            <li key={event.id} className="relative pb-10 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[2.3rem] top-1 flex size-4 items-center justify-center rounded-full border-2 border-accent bg-paper md:-left-[2.8rem]"
              >
                <span className="size-1.5 rounded-full bg-accent" />
              </span>
              <p className="font-mono text-sm font-semibold tracking-wide text-accent">
                {pick(event, "year", locale)}
              </p>
              <h3 className="mt-1.5 text-[19px] font-semibold">{pick(event, "title", locale)}</h3>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
                {pick(event, "body", locale)}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHead
          title={<Editable k="about.stats.title" as="span" />}
          align="center"
          className="mb-10"
        />
        <StatsStrip />
      </Section>

      <CtaBand />
    </>
  );
}

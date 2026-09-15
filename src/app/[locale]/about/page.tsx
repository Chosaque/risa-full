import type { Metadata } from "next";
import { content } from "@/lib/content";
import { getLocale } from "@/lib/request";
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

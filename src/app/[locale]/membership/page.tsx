import type { Metadata } from "next";
import { content } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { Editable, EditableRich } from "@/components/editable/Editable";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHead } from "@/components/site/Section";
import { ListSection } from "@/components/site/ListSection";
import { CtaBand } from "@/components/site/CtaBand";
import { MembershipForm } from "@/components/site/forms/MembershipForm";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: await content("membership.seo.title", locale),
    description: await content("membership.seo.description", locale),
  };
}

export default async function MembershipPage() {
  const locale = await getLocale();

  return (
    <>
      <PageHero
        eyebrowKey="membership.hero.eyebrow"
        titleKey="membership.hero.title"
        subtitleKey="membership.hero.subtitle"
      />

      {/* ── benefits ──────────────────────────────────────────────────────── */}
      <Section>
        <SectionHead
          title={<Editable k="membership.benefits.title" as="span" />}
          lead={<Editable k="membership.benefits.body" as="span" />}
          className="mb-12"
        />
        <ListSection listKey="membership.benefits" columns={2} variant="plain" />
      </Section>

      {/* ── tiers ─────────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <SectionHead
          title={<Editable k="membership.types.title" as="span" />}
          lead={<Editable k="membership.types.body" as="span" />}
          className="mb-12"
        />
        <ListSection listKey="membership.types" columns={2} />
      </Section>

      {/* ── how to apply ──────────────────────────────────────────────────── */}
      <Section>
        <SectionHead
          title={<Editable k="membership.steps.title" as="span" />}
          className="mb-12"
        />
        <ListSection listKey="membership.steps" columns={4} variant="numbered" />
      </Section>

      {/* ── application form ──────────────────────────────────────────────── */}
      <Section tone="surface" id="apply">
        <div className="mx-auto max-w-3xl">
          <SectionHead
            title={<Editable k="membership.form.title" as="span" />}
            lead={<Editable k="membership.form.body" as="span" />}
            className="mb-10"
          />
          <div className="rounded-2xl border border-line bg-paper p-6 md:p-8">
            <MembershipForm locale={locale} />
          </div>
          <EditableRich k="membership.form.note" className="mt-6 text-[15px] text-muted" />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { content } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { pick, t } from "@/lib/i18n";
import { getCommittee, type CommitteeMember } from "@/lib/queries";
import { Editable } from "@/components/editable/Editable";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Placeholder } from "@/components/site/Placeholder";
import { EmptyState } from "@/components/site/EmptyState";
import { CtaBand } from "@/components/site/CtaBand";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: await content("committee.seo.title", locale),
    description: await content("committee.seo.description", locale),
  };
}

const GROUPS = [
  { key: "president", titleKey: "committee.group.president", featured: true },
  { key: "committee", titleKey: "committee.group.committee", featured: false },
  { key: "advisor", titleKey: "committee.group.advisor", featured: false },
] as const;

function MemberCard({
  member, locale, featured,
}: { member: CommitteeMember; locale: Locale; featured: boolean }) {
  const name = pick(member, "name", locale);
  return (
    <article
      className={
        featured
          ? "flex flex-col gap-6 rounded-2xl border border-line bg-paper p-6 sm:flex-row sm:items-center sm:p-8"
          : "flex flex-col rounded-2xl border border-line bg-paper p-5"
      }
    >
      <div
        className={
          featured
            ? "size-32 shrink-0 overflow-hidden rounded-2xl sm:size-40"
            : "mb-4 aspect-square w-full overflow-hidden rounded-xl"
        }
      >
        {member.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.photo_url} alt={name} className="size-full object-cover" loading="lazy" />
        ) : (
          <Placeholder seed={member.id} kind="portrait" className="size-full" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-accent">
          {pick(member, "position", locale)}
        </p>
        <h3 className={featured ? "mt-1.5 text-2xl font-semibold" : "mt-1.5 text-[17px] font-semibold"}>
          {name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{pick(member, "org", locale)}</p>
        {member.term && (
          <p className="mt-2 text-xs text-faint">
            {t(locale, "term")} {member.term}
          </p>
        )}
        {pick(member, "bio", locale) && (
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{pick(member, "bio", locale)}</p>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            <Mail className="size-3.5" strokeWidth={1.7} />
            {member.email}
          </a>
        )}
      </div>
    </article>
  );
}

export default async function CommitteePage() {
  const [locale, members] = await Promise.all([getLocale(), getCommittee()]);

  return (
    <>
      <PageHero
        eyebrowKey="committee.hero.eyebrow"
        titleKey="committee.hero.title"
        subtitleKey="committee.hero.subtitle"
      />

      <Section>
        {members.length === 0 ? (
          <EmptyState label={t(locale, "noResults")} />
        ) : (
          <div className="space-y-14">
            {GROUPS.map((group) => {
              const list = members.filter((m) => m.group_key === group.key);
              if (list.length === 0) return null;
              return (
                <div key={group.key}>
                  <Editable
                    k={group.titleKey}
                    as="h2"
                    className="mb-6 border-b border-line pb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-faint"
                  />
                  <div
                    className={
                      group.featured
                        ? "grid gap-6"
                        : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    }
                  >
                    {list.map((m) => (
                      <MemberCard key={m.id} member={m} locale={locale} featured={group.featured} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <CtaBand />
    </>
  );
}

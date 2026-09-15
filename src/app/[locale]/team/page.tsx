import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "@/lib/db";
import { getLocale } from "@/lib/request";
import type { StaffProfile } from "@/lib/staff";
import { StaffCard } from "@/components/site/StaffCard";
import { Section } from "@/components/site/Section";

export async function generateMetadata(): Promise<Metadata> {
  const th = (await getLocale()) === "th";
  return { title: th ? "บุคลากร · RISA" : "Our Team · RISA", description: th ? "รู้จักบุคลากรและช่องทางติดต่อของ RISA" : "Meet the RISA team and find their professional contact details." };
}

export default async function TeamPage() {
  const locale = await getLocale();
  const th = locale === "th";
  const members = await sql<(StaffProfile & { id: string })[]>`
    select id, name_th, name_en, position_th, position_en, department_th, department_en,
      bio_th, bio_en, photo_url, photo_position, email, phone
    from staff_members where status = 'published' order by sort, created_at`;
  return <Section>
    <nav aria-label={th ? "เกี่ยวกับสมาคม" : "About the association"} className="mb-10 flex flex-wrap gap-6 border-b border-line text-sm">
      <Link href={`/${locale}/about`} className="pb-3 text-muted hover:text-ink">{th ? "เกี่ยวกับสมาคม" : "About RISA"}</Link>
      <Link href={`/${locale}/committee`} className="pb-3 text-muted hover:text-ink">{th ? "คณะกรรมการ" : "Committee"}</Link>
      <Link href={`/${locale}/team`} aria-current="page" className="border-b-2 border-accent pb-3 text-ink">{th ? "บุคลากร" : "Our Team"}</Link>
    </nav>
    <h1 className="text-4xl font-normal tracking-tight md:text-5xl">{th ? "บุคลากร" : "Our Team"}</h1>
    <p className="mb-12 mt-4 max-w-2xl text-base leading-relaxed text-muted">{th ? "รู้จักทีมงานและช่องทางติดต่อของ RISA" : "Meet the people behind RISA and find their professional contact details."}</p>
    {members.length ? <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{members.map(member => <StaffCard key={member.id} member={member} locale={locale} />)}</div>
      : <div className="border-y border-line py-14 text-center text-muted"><p>{th ? "กำลังจัดเตรียมข้อมูลบุคลากร" : "Team profiles are coming soon."}</p><Link href={`/${locale}/contact`} className="mt-4 inline-block text-accent underline underline-offset-4">{th ? "ติดต่อสมาคม" : "Contact RISA"}</Link></div>}
  </Section>;
}

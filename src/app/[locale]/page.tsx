import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getContentMap, blockValue } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { localePath, pick } from "@/lib/i18n";
import { getNews, getUpcomingActivities } from "@/lib/queries";
import { Editable } from "@/components/editable/Editable";
import { EditableImage } from "@/components/editable/EditableImage";

export default async function HomePage() {
  const [locale, map, news, activities] = await Promise.all([
    getLocale(), getContentMap(), getNews(3), getUpcomingActivities(2),
  ]);
  const L = (href: string) => href.startsWith("/") ? localePath(locale, href) : href;
  const v = (key: string) => blockValue(map.get(key), locale);
  const features = [
    { href: "/research", number: "01", th: "งานวิจัย", en: "Research", subTh: "องค์ความรู้และผลงานวิจัย", subEn: "Knowledge and research publications", position: "right center" },
    { href: "/about", number: "02", th: "เกี่ยวกับ RISA", en: "About RISA", subTh: "รู้จักสมาคมและพันธกิจของเรา", subEn: "Our association and our purpose", position: "center center" },
    { href: "/activities", number: "03", th: "กิจกรรม", en: "Activities", subTh: "เชื่อมโยงงานวิจัยกับภาคอุตสาหกรรม", subEn: "Connecting research with industry", position: "right bottom" },
  ];
  return (
    <div className="minimal-home">
      <section className="minimal-hero">
        <div className="minimal-hero-copy">
          <Editable k="home.hero.eyebrow" as="p" className="minimal-eyebrow" />
          <Editable k="home.hero.title" as="h1" multiline />
          <Editable k="home.hero.subtitle" as="p" className="minimal-intro" />
          <Link href={L(v("home.hero.primary_href") || "/about")} className="minimal-hero-link">
            <span className="minimal-circle"><ArrowRight size={22} aria-hidden /></span>
            <Editable k="home.hero.primary_label" />
          </Link>
        </div>
        <EditableImage k="home.hero.image" fallbackSrc="/precision-research.png" priority className="minimal-hero-image" alt={locale === "th" ? "ภาพประกอบเครื่องมือวัดความละเอียดสูง" : "Illustration of precision measurement equipment"} />
      </section>
      <section className="container-page minimal-features" aria-label={locale === "th" ? "สำรวจ RISA" : "Explore RISA"}>
        {features.map((feature) => (
          <Link className="minimal-feature" href={L(feature.href)} key={feature.href}>
            <div className="minimal-feature-image" style={{ backgroundPosition: feature.position }} aria-hidden />
            <div className="minimal-feature-heading"><span>{feature.number}</span><h2>{locale === "th" ? feature.th : feature.en}</h2><ArrowRight size={18} aria-hidden /></div>
            <p>{locale === "th" ? feature.subTh : feature.subEn}</p>
          </Link>
        ))}
      </section>
      <section className="container-page minimal-updates">
        <div className="minimal-updates-heading"><Editable k="home.news.title" as="h2" /><Link href={L("/news")}><Editable k="home.news.link_label" /> <ArrowRight size={16} aria-hidden /></Link></div>
        {news.length ? <div className="minimal-news-list">{news.map(item => <Link key={item.id} href={L(`/news/${item.slug}`)} className="minimal-news-item"><span className="minimal-news-date">{item.published_at ? new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.published_at)) : ""}</span><h3>{pick(item, "title", locale)}</h3><ArrowRight size={18} aria-hidden /></Link>)}</div> : <p className="text-muted">{locale === "th" ? "ติดตามข่าวสารจาก RISA ได้เร็ว ๆ นี้" : "Updates from RISA are coming soon."}</p>}
        {activities.length > 0 && <div className="minimal-activities"><Link href={L("/activities")} className="minimal-activity-label"><Editable k="home.activities.title" /></Link>{activities.map(item => <Link key={item.id} href={L(`/activities/${item.slug}`)}>{pick(item, "title", locale)} <ArrowRight size={16} aria-hidden /></Link>)}</div>}
      </section>
    </div>
  );
}

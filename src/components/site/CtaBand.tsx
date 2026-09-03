import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getContentMap, blockValue } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { localePath } from "@/lib/i18n";
import { Editable } from "@/components/editable/Editable";

export async function CtaBand() {
  const [map, locale] = await Promise.all([getContentMap(), getLocale()]);
  const L = (h: string) => (h.startsWith("/") ? localePath(locale, h) : h);
  const primaryHref = blockValue(map.get("global.cta.primary_href"), locale);
  const secondaryHref = blockValue(map.get("global.cta.secondary_href"), locale);

  return (
    <section className="bg-ink text-white">
      <div className="container-page flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="max-w-xl">
          <Editable k="global.cta.title" as="h2" className="text-2xl font-semibold md:text-[1.75rem]" />
          <Editable k="global.cta.body" as="p" className="mt-3 text-[16px] leading-relaxed text-white/70" />
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href={L(primaryHref)}
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-6 text-[15px] font-medium text-accent-ink transition-[filter] hover:brightness-110"
          >
            <Editable k="global.cta.primary_label" />
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={L(secondaryHref)}
            className="inline-flex h-12 items-center rounded-lg border border-white/25 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
          >
            <Editable k="global.cta.secondary_label" />
          </Link>
        </div>
      </div>
    </section>
  );
}

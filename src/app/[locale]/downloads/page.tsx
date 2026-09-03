import type { Metadata } from "next";
import { Download } from "lucide-react";
import { content } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { pick, t } from "@/lib/i18n";
import { getDocuments, type DocumentItem } from "@/lib/queries";
import { formatBytes } from "@/lib/utils";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { EmptyState } from "@/components/site/EmptyState";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: await content("downloads.seo.title", locale),
    description: await content("downloads.seo.description", locale),
  };
}

const MIME_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/vnd.ms-powerpoint": "PPT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "application/zip": "ZIP",
  "text/csv": "CSV",
  "text/plain": "TXT",
  "image/jpeg": "JPG",
  "image/png": "PNG",
};

function fileType(mime: string): string {
  if (!mime) return "";
  return MIME_LABELS[mime] ?? (mime.split("/").pop() ?? "").slice(0, 8).toUpperCase();
}

/** Groups keep the admin's sort order; a category appears where its first doc does. */
function groupByCategory(docs: DocumentItem[], locale: Locale): [string, DocumentItem[]][] {
  const groups = new Map<string, DocumentItem[]>();
  for (const doc of docs) {
    const key = pick(doc, "category", locale);
    const list = groups.get(key);
    if (list) list.push(doc);
    else groups.set(key, [doc]);
  }
  return [...groups.entries()];
}

export default async function DownloadsPage() {
  const [locale, docs] = await Promise.all([getLocale(), getDocuments()]);
  const groups = groupByCategory(docs, locale);

  return (
    <>
      <PageHero
        eyebrowKey="downloads.hero.eyebrow"
        titleKey="downloads.hero.title"
        subtitleKey="downloads.hero.subtitle"
      />

      <Section>
        {docs.length === 0 ? (
          <EmptyState label={t(locale, "noResults")} />
        ) : (
          <div className="space-y-12">
            {groups.map(([category, list]) => (
              <div key={category}>
                {category && (
                  <h2 className="mb-5 border-b border-line pb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">
                    {category}
                  </h2>
                )}
                <ul className="overflow-hidden rounded-2xl border border-line">
                  {list.map((doc) => {
                    const meta = [fileType(doc.mime), formatBytes(doc.size_bytes)].filter(Boolean);
                    return (
                      <li
                        key={doc.id}
                        className="flex flex-col gap-4 border-b border-line bg-paper p-6 last:border-b-0 sm:flex-row sm:items-center sm:justify-between md:p-7"
                      >
                        <div className="min-w-0">
                          <h3 className="text-[17px] font-semibold leading-snug">
                            {pick(doc, "title", locale)}
                          </h3>
                          {pick(doc, "description", locale) && (
                            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                              {pick(doc, "description", locale)}
                            </p>
                          )}
                          {meta.length > 0 && (
                            <p className="mt-2 text-[13px] uppercase tracking-wide text-faint">
                              {meta.join(" · ")}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0">
                          {doc.file_url ? (
                            <Button asChild variant="outline">
                              <a href={doc.file_url} download>
                                <Download className="size-4" strokeWidth={1.7} aria-hidden />
                                {t(locale, "download")}
                              </a>
                            </Button>
                          ) : (
                            <Button variant="outline" disabled>
                              <Download className="size-4" strokeWidth={1.7} aria-hidden />
                              {t(locale, "download")}
                            </Button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Section>

      <CtaBand />
    </>
  );
}

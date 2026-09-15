import type { MetadataRoute } from "next";
import { sql } from "@/lib/db";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Content changes through the admin console, so the sitemap cannot be frozen at build time. */
export const revalidate = 3600;

/** Every page that exists without a database row behind it. `""` is the home page. */
const STATIC_ROUTES = [
  "",
  "/about",
  "/committee",
  "/team",
  "/news",
  "/activities",
  "/membership",
  "/careers",
  "/research",
  "/awards",
  "/gallery",
  "/downloads",
  "/map",
  "/contact",
] as const;

type SlugRow = { slug: string; updated_at: Date };

/**
 * One entry per locale for the same path, each pointing at both translations —
 * `/th/about` and `/en/about` are the same document in two languages.
 */
function localised(path: string, lastModified?: Date): MetadataRoute.Sitemap {
  const languages = { th: `${BASE}/th${path}`, en: `${BASE}/en${path}` };
  return [
    { url: languages.th, lastModified, alternates: { languages } },
    { url: languages.en, lastModified, alternates: { languages } },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, activities, jobs, albums] = await Promise.all([
    sql<SlugRow[]>`select slug, updated_at from news where status = 'published'`,
    sql<SlugRow[]>`select slug, updated_at from activities where status = 'published'`,
    sql<SlugRow[]>`select slug, updated_at from job_posts where status = 'published'`,
    sql<SlugRow[]>`select slug, updated_at from gallery_albums where status = 'published'`,
  ]);

  return [
    ...STATIC_ROUTES.flatMap((path) => localised(path)),
    ...news.flatMap((row) => localised(`/news/${row.slug}`, row.updated_at)),
    ...activities.flatMap((row) => localised(`/activities/${row.slug}`, row.updated_at)),
    ...jobs.flatMap((row) => localised(`/careers/${row.slug}`, row.updated_at)),
    ...albums.flatMap((row) => localised(`/gallery/${row.slug}`, row.updated_at)),
  ];
}

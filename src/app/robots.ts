import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin console and the internal API are of no use to a crawler.
      disallow: ["/admin", "/api"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}

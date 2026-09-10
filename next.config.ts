import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Default is 60s. The database is a Supabase pooler in ap-northeast-1;
  // Vercel builds run in iad1, so cross-region query latency under
  // concurrent static generation can exceed the default budget.
  staticPageGenerationTimeout: 180,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Uploaded assets are content-addressed by a random suffix, so they can
        // be cached hard — a replacement always gets a new URL.
        //
        // Uploads accept image/svg+xml, and an SVG is executable markup: a
        // malicious upload could embed a <script> that runs when the file is
        // opened directly (same-origin document navigation), even though it
        // is inert when only embedded via <img>. The sandbox directive makes
        // the browser treat a direct visit as an opaque, scriptless origin —
        // <img>-embedded display elsewhere on the site is unaffected.
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Content-Security-Policy", value: "sandbox" },
        ],
      },
    ];
  },
};

export default nextConfig;

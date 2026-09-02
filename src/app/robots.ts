import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://example.com";

// Development-mode lockdown: the site is not ready for search indexing yet.
// Before launch, flip `disallow` back to `allow` here and remove the
// `robots` block in layout.tsx metadata -- see the SEO indexing SOP.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { SERVICES } from "../data/site";

export const dynamic = "force-static";

const SITE_URL = "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/blogs",
    "/privacy-policy",
    "/terms-of-service",
    "/team",
    "/services",
    "/work",
  ];

  const serviceRoutes = SERVICES.flatMap((s) => [`/services/${s.slug}`, `/work/${s.slug}`]);

  return [...staticRoutes, ...serviceRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}

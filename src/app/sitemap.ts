import type { MetadataRoute } from "next";
import { chennaiZones } from "@/lib/chennai-zones";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mychennaicity.in";
  const now = new Date();

  const staticPaths = ["", "/news", "/events", "/jobs", "/directory"];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const areaEntries: MetadataRoute.Sitemap = chennaiZones.map((z) => ({
    url: `${base}/areas/${z.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...areaEntries];
}

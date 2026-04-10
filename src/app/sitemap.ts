import type { MetadataRoute } from "next";
import { listDirectoryForSitemap } from "@/domains/directory";
import { listEventsForSitemap } from "@/domains/events";
import { listJobsForSitemap } from "@/domains/jobs";
import { listPropertiesForSitemap } from "@/domains/properties";
import { listArticlesForSitemap, listTopicKeysForSite } from "@/domains/news";
import { nanganallurAreas } from "@/lib/nanganallur-areas";
import { categoryToTopicSlug } from "@/lib/news-topics";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mynanganallur.in";

  let topicKeys: string[] = [];
  let articleEntries: { slug: string; lastModified: Date }[] = [];
  let eventEntries: { slug: string; lastModified: Date }[] = [];
  let jobEntries: { slug: string; lastModified: Date }[] = [];
  let propertyEntries: { slug: string; lastModified: Date }[] = [];
  let directoryEntries: { type: string; slug: string; lastModified: Date }[] =
    [];
  try {
    topicKeys = await listTopicKeysForSite();
    articleEntries = await listArticlesForSitemap();
    eventEntries = await listEventsForSitemap();
    jobEntries = await listJobsForSitemap();
    propertyEntries = await listPropertiesForSitemap();
    directoryEntries = await listDirectoryForSitemap();
  } catch {
    /* DATABASE_URL unset or DB unreachable at build */
  }

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/local-news`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${base}/local-events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${base}/directory`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.75,
    },
    {
      url: `${base}/properties`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.72,
    },
  ];

  const areaEntries: MetadataRoute.Sitemap = nanganallurAreas.map((z) => ({
    url: `${base}/areas/${z.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const articleSitemap: MetadataRoute.Sitemap = articleEntries.map((a) => ({
    url: `${base}/local-news/${a.slug}`,
    lastModified: a.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const topicSitemap: MetadataRoute.Sitemap = topicKeys.map((cat) => ({
    url: `${base}/local-news/topic/${categoryToTopicSlug(cat)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.55,
  }));

  const eventSitemap: MetadataRoute.Sitemap = eventEntries.map((ev) => ({
    url: `${base}/local-events/${ev.slug}`,
    lastModified: ev.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.62,
  }));

  const jobSitemap: MetadataRoute.Sitemap = jobEntries.map((j) => ({
    url: `${base}/jobs/${j.slug}`,
    lastModified: j.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.63,
  }));

  const propertySitemap: MetadataRoute.Sitemap = propertyEntries.map((p) => ({
    url: `${base}/properties/${p.slug}`,
    lastModified: p.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.61,
  }));

  const directorySitemap: MetadataRoute.Sitemap = directoryEntries.map((d) => ({
    url: `${base}/directory/${d.type}/${d.slug}`,
    lastModified: d.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.58,
  }));

  return [
    ...staticEntries,
    ...areaEntries,
    ...topicSitemap,
    ...articleSitemap,
    ...eventSitemap,
    ...jobSitemap,
    ...propertySitemap,
    ...directorySitemap,
  ];
}

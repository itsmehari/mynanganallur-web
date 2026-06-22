import type { MetadataRoute } from "next";
import {
  DIRECTORY_TYPE_SLUGS,
  listDirectoryForSitemap,
} from "@/domains/directory";
import { listEventsForSitemap } from "@/domains/events";
import { listJobsForSitemap } from "@/domains/jobs";
import { listOpenToWorkForSitemap } from "@/domains/open-to-work";
import { listPropertiesForSitemap } from "@/domains/properties";
import { listArticlesForSitemap, listTopicKeysForSite } from "@/domains/news";
import { nanganallurAreas } from "@/lib/nanganallur-areas";
import { categoryToTopicSlug } from "@/lib/news-topics";

/** Regenerate from Neon on each request (ISR). */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mynanganallur.in";

  let topicKeys: string[] = [];
  let articleEntries: { slug: string; lastModified: Date }[] = [];
  let eventEntries: { slug: string; lastModified: Date }[] = [];
  let jobEntries: { slug: string; lastModified: Date }[] = [];
  let openToWorkEntries: { slug: string; lastModified: Date }[] = [];
  let propertyEntries: { slug: string; lastModified: Date }[] = [];
  let directoryEntries: { type: string; slug: string; lastModified: Date }[] =
    [];
  try {
    topicKeys = await listTopicKeysForSite();
    articleEntries = await listArticlesForSitemap();
    eventEntries = await listEventsForSitemap();
    jobEntries = await listJobsForSitemap();
    openToWorkEntries = await listOpenToWorkForSitemap();
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
      url: `${base}/careers/open-to-work`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${base}/properties`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.72,
    },
    {
      url: `${base}/nanganallur-connect`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${base}/nanganallur-whatsapp-group`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.82,
    },
    {
      url: `${base}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: `${base}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.48,
    },
    {
      url: `${base}/submit/business`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.52,
    },
    {
      url: `${base}/submit/job`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.48,
    },
    {
      url: `${base}/submit/open-to-work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.48,
    },
    {
      url: `${base}/submit/event`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.48,
    },
    {
      url: `${base}/submit/property`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.48,
    },
  ];

  const directoryTypeEntries: MetadataRoute.Sitemap = DIRECTORY_TYPE_SLUGS.map(
    (type) => ({
      url: `${base}/directory/${type}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.56,
    }),
  );

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

  const openToWorkSitemap: MetadataRoute.Sitemap = openToWorkEntries.map((p) => ({
    url: `${base}/careers/open-to-work/${p.slug}`,
    lastModified: p.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.58,
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
    ...directoryTypeEntries,
    ...areaEntries,
    ...topicSitemap,
    ...articleSitemap,
    ...eventSitemap,
    ...jobSitemap,
    ...openToWorkSitemap,
    ...propertySitemap,
    ...directorySitemap,
  ];
}

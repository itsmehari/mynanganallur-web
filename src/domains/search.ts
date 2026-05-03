import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  articles,
  cities,
  directoryEntries,
  events,
  jobPostings,
  propertyListings,
} from "@/db/schema";

export type SearchEntity =
  | "article"
  | "event"
  | "job"
  | "property"
  | "directory";

export type SearchHit = {
  entity: SearchEntity;
  id: string;
  title: string;
  snippet?: string | null;
  href: string;
  locality?: string | null;
};

export type SearchOptions = {
  q?: string | null;
  locality?: string | null;
  type?: SearchEntity | null;
  limit?: number;
};

export type SearchResults = {
  query: string | null;
  locality: string | null;
  hits: Record<SearchEntity, SearchHit[]>;
  total: number;
};

const SITE_CITY_SLUG = "nanganallur";

async function getSiteCityId(): Promise<string | null> {
  const db = getDb();
  const [c] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, SITE_CITY_SLUG))
    .limit(1);
  return c?.id ?? null;
}

function emptyHits(): Record<SearchEntity, SearchHit[]> {
  return { article: [], event: [], job: [], property: [], directory: [] };
}

function pattern(q: string): string {
  return `%${q.replace(/[%_]/g, "\\$&")}%`;
}

export async function searchAcross(
  opts: SearchOptions = {},
): Promise<SearchResults> {
  const cityId = await getSiteCityId();
  const out: SearchResults = {
    query: opts.q?.trim() || null,
    locality: opts.locality?.trim() || null,
    hits: emptyHits(),
    total: 0,
  };
  if (!cityId) return out;

  const limit = Math.min(Math.max(opts.limit ?? 8, 1), 25);
  const q = out.query;
  const loc = out.locality;
  const db = getDb();

  const wantArticles = !opts.type || opts.type === "article";
  const wantEvents = !opts.type || opts.type === "event";
  const wantJobs = !opts.type || opts.type === "job";
  const wantProps = !opts.type || opts.type === "property";
  const wantDir = !opts.type || opts.type === "directory";

  const tasks: Promise<void>[] = [];

  if (wantArticles) {
    tasks.push(
      (async () => {
        const conds = [eq(articles.cityId, cityId), eq(articles.status, "published")];
        if (q) {
          conds.push(
            or(
              ilike(articles.title, pattern(q)),
              ilike(articles.body, pattern(q)),
              ilike(articles.summary, pattern(q)),
            )!,
          );
        }
        const rows = await db
          .select({
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
            summary: articles.summary,
            category: articles.category,
          })
          .from(articles)
          .where(and(...conds))
          .orderBy(desc(articles.publishedAt))
          .limit(limit);
        out.hits.article = rows.map((r) => ({
          entity: "article",
          id: r.id,
          title: r.title,
          snippet: r.summary,
          href: `/local-news/${r.slug}`,
          locality: r.category,
        }));
      })(),
    );
  }

  if (wantEvents) {
    tasks.push(
      (async () => {
        const conds = [eq(events.cityId, cityId), eq(events.status, "scheduled")];
        if (q) {
          conds.push(
            or(
              ilike(events.title, pattern(q)),
              ilike(events.description, pattern(q)),
            )!,
          );
        }
        if (loc) {
          conds.push(ilike(events.localityLabel, pattern(loc)));
        }
        const rows = await db
          .select({
            id: events.id,
            title: events.title,
            slug: events.slug,
            description: events.description,
            localityLabel: events.localityLabel,
          })
          .from(events)
          .where(and(...conds))
          .orderBy(desc(events.startsAt))
          .limit(limit);
        out.hits.event = rows.map((r) => ({
          entity: "event",
          id: r.id,
          title: r.title,
          snippet: r.description?.slice(0, 200) ?? null,
          href: `/local-events/${r.slug}`,
          locality: r.localityLabel,
        }));
      })(),
    );
  }

  if (wantJobs) {
    tasks.push(
      (async () => {
        const conds = [eq(jobPostings.cityId, cityId), eq(jobPostings.status, "open")];
        if (q) {
          conds.push(
            or(
              ilike(jobPostings.title, pattern(q)),
              ilike(jobPostings.body, pattern(q)),
            )!,
          );
        }
        if (loc) {
          conds.push(ilike(jobPostings.locationLabel, pattern(loc)));
        }
        const rows = await db
          .select({
            id: jobPostings.id,
            title: jobPostings.title,
            slug: jobPostings.slug,
            locationLabel: jobPostings.locationLabel,
            body: jobPostings.body,
          })
          .from(jobPostings)
          .where(and(...conds))
          .orderBy(desc(jobPostings.featured), desc(jobPostings.createdAt))
          .limit(limit);
        out.hits.job = rows.map((r) => ({
          entity: "job",
          id: r.id,
          title: r.title,
          snippet: r.body.slice(0, 200),
          href: `/jobs/${r.slug}`,
          locality: r.locationLabel,
        }));
      })(),
    );
  }

  if (wantProps) {
    tasks.push(
      (async () => {
        const conds = [
          eq(propertyListings.cityId, cityId),
          eq(propertyListings.status, "published"),
        ];
        if (q) {
          conds.push(
            or(
              ilike(propertyListings.title, pattern(q)),
              ilike(propertyListings.body, pattern(q)),
            )!,
          );
        }
        if (loc) {
          conds.push(ilike(propertyListings.localityLabel, pattern(loc)));
        }
        const rows = await db
          .select({
            id: propertyListings.id,
            title: propertyListings.title,
            slug: propertyListings.slug,
            summary: propertyListings.summary,
            localityLabel: propertyListings.localityLabel,
          })
          .from(propertyListings)
          .where(and(...conds))
          .orderBy(desc(propertyListings.featured), desc(propertyListings.createdAt))
          .limit(limit);
        out.hits.property = rows.map((r) => ({
          entity: "property",
          id: r.id,
          title: r.title,
          snippet: r.summary,
          href: `/properties/${r.slug}`,
          locality: r.localityLabel,
        }));
      })(),
    );
  }

  if (wantDir) {
    tasks.push(
      (async () => {
        const conds = [eq(directoryEntries.cityId, cityId)];
        if (q) {
          conds.push(
            or(
              ilike(directoryEntries.name, pattern(q)),
              ilike(directoryEntries.address, pattern(q)),
            )!,
          );
        }
        if (loc) {
          conds.push(ilike(directoryEntries.localityLabel, pattern(loc)));
        }
        const rows = await db
          .select({
            id: directoryEntries.id,
            name: directoryEntries.name,
            slug: directoryEntries.slug,
            type: directoryEntries.type,
            address: directoryEntries.address,
            localityLabel: directoryEntries.localityLabel,
          })
          .from(directoryEntries)
          .where(and(...conds))
          .orderBy(sql`${directoryEntries.verified} desc`, desc(directoryEntries.createdAt))
          .limit(limit);
        out.hits.directory = rows.map((r) => ({
          entity: "directory",
          id: r.id,
          title: r.name,
          snippet: r.address,
          href: `/directory/${r.type}/${r.slug}`,
          locality: r.localityLabel,
        }));
      })(),
    );
  }

  await Promise.all(tasks);
  out.total =
    out.hits.article.length +
    out.hits.event.length +
    out.hits.job.length +
    out.hits.property.length +
    out.hits.directory.length;
  return out;
}

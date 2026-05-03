import Link from "next/link";
import { and, desc, eq, ne, or, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  articles,
  cities,
  events,
  jobPostings,
  propertyListings,
} from "@/db/schema";

export type RelatedKind = "article" | "event" | "job" | "property";

type Props = {
  kind: RelatedKind;
  excludeId: string;
  locality?: string | null;
  topic?: string | null;
  /** Employer slug, only relevant for jobs. */
  employerId?: string | null;
  heading?: string;
};

type Item = { name: string; href: string; sub?: string | null };

async function getCityId(): Promise<string | null> {
  const db = getDb();
  const [c] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "nanganallur"))
    .limit(1);
  return c?.id ?? null;
}

async function loadItems(props: Props): Promise<Item[]> {
  const cityId = await getCityId();
  if (!cityId) return [];
  const db = getDb();

  switch (props.kind) {
    case "article": {
      const conds = [eq(articles.cityId, cityId), eq(articles.status, "published"), ne(articles.id, props.excludeId)];
      if (props.topic) {
        conds.push(eq(articles.category, props.topic));
      }
      const rows = await db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          category: articles.category,
        })
        .from(articles)
        .where(and(...conds))
        .orderBy(desc(articles.publishedAt))
        .limit(5);
      return rows.map((r) => ({
        name: r.title,
        href: `/local-news/${r.slug}`,
        sub: r.category,
      }));
    }
    case "event": {
      const conds = [
        eq(events.cityId, cityId),
        eq(events.status, "scheduled"),
        ne(events.id, props.excludeId),
      ];
      if (props.locality) {
        conds.push(eq(events.localityLabel, props.locality));
      }
      const rows = await db
        .select({
          id: events.id,
          title: events.title,
          slug: events.slug,
          localityLabel: events.localityLabel,
        })
        .from(events)
        .where(and(...conds))
        .orderBy(desc(events.startsAt))
        .limit(5);
      return rows.map((r) => ({
        name: r.title,
        href: `/local-events/${r.slug}`,
        sub: r.localityLabel,
      }));
    }
    case "job": {
      const conds = [eq(jobPostings.cityId, cityId), eq(jobPostings.status, "open"), ne(jobPostings.id, props.excludeId)];
      if (props.locality) {
        conds.push(eq(jobPostings.locationLabel, props.locality));
      }
      if (props.employerId) {
        conds.push(
          or(
            eq(jobPostings.employerId, props.employerId),
            sql`true`,
          )!,
        );
      }
      const rows = await db
        .select({
          id: jobPostings.id,
          title: jobPostings.title,
          slug: jobPostings.slug,
          locationLabel: jobPostings.locationLabel,
        })
        .from(jobPostings)
        .where(and(...conds))
        .orderBy(desc(jobPostings.featured), desc(jobPostings.createdAt))
        .limit(5);
      return rows.map((r) => ({
        name: r.title,
        href: `/jobs/${r.slug}`,
        sub: r.locationLabel,
      }));
    }
    case "property": {
      const conds = [
        eq(propertyListings.cityId, cityId),
        eq(propertyListings.status, "published"),
        ne(propertyListings.id, props.excludeId),
      ];
      if (props.locality) {
        conds.push(eq(propertyListings.localityLabel, props.locality));
      }
      const rows = await db
        .select({
          id: propertyListings.id,
          title: propertyListings.title,
          slug: propertyListings.slug,
          localityLabel: propertyListings.localityLabel,
        })
        .from(propertyListings)
        .where(and(...conds))
        .orderBy(desc(propertyListings.featured), desc(propertyListings.createdAt))
        .limit(5);
      return rows.map((r) => ({
        name: r.title,
        href: `/properties/${r.slug}`,
        sub: r.localityLabel,
      }));
    }
  }
}

export async function RelatedBlock(props: Props) {
  let items: Item[] = [];
  try {
    items = await loadItems(props);
  } catch {
    items = [];
  }
  if (items.length === 0) return null;
  const heading =
    props.heading ??
    (props.locality
      ? `More in ${props.locality}`
      : "More on mynanganallur.in");
  return (
    <section className="mt-12" aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="text-lg font-semibold text-[var(--foreground)]"
      >
        {heading}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <li
            key={it.href}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 hover:border-[var(--accent)]"
          >
            <Link href={it.href} className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]">
              {it.name}
            </Link>
            {it.sub ? (
              <p className="mt-0.5 text-xs text-[var(--muted)]">{it.sub}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

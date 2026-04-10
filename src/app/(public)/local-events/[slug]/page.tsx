import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { ArticleProse } from "@/components/news/article-prose";
import {
  getPublishedEventBySlug,
  getPublishedEventSlugsForSite,
} from "@/domains/events";
import { getSiteUrl } from "@/lib/env";
import {
  buildEventBreadcrumbJsonLd,
  buildEventJsonLd,
} from "@/lib/seo/event-jsonld";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 120;

function clipMetaDescription(raw: string, max = 155): string {
  const t = raw.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function stripMarkdownLite(s: string): string {
  return s
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedEventSlugsForSite();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let event: Awaited<ReturnType<typeof getPublishedEventBySlug>> = null;
  try {
    event = await getPublishedEventBySlug(slug);
  } catch {
    return { title: "Event" };
  }
  if (!event) {
    return { title: "Event" };
  }
  const base = getSiteUrl();
  const url = `${base}/local-events/${event.slug}`;
  const desc = clipMetaDescription(
    event.description
      ? stripMarkdownLite(event.description)
      : `${event.title} — ${event.localityLabel ?? event.venueName ?? "Nanganallur area"}`,
  );
  return {
    title: `${event.title} · Local events`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${event.title} · Local events · mynanganallur.in`,
      description: desc,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} · Local events · mynanganallur.in`,
      description: desc,
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);
  if (!event) {
    notFound();
  }

  const when = event.startsAt.toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: event.allDay ? undefined : "short",
    timeZone: "Asia/Kolkata",
  });
  const where =
    event.venueName ??
    event.localityLabel ??
    (event.venueAddress ? event.venueAddress : "Venue details on organiser");

  const eventLd = buildEventJsonLd(event);
  const crumbLd = buildEventBreadcrumbJsonLd(event.slug, event.title);

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent-warm)]">
        Local event
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {event.title}
      </h1>
      <p className="mt-4 text-sm text-[var(--muted)]">
        <time dateTime={event.startsAt.toISOString()}>{when}</time>
        {event.allDay ? " · All day" : null}
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{where}</p>

      <AdSlot
        slotId="events-detail-top"
        size="728x90"
        seed={buildRotationSeed(`/local-events/${slug}`, "events-detail-top")}
        className="mt-8 max-w-full"
      />

      {event.description ? (
        <section className="mt-10" aria-labelledby="event-details">
          <h2
            id="event-details"
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            Details
          </h2>
          <div className="mt-4">
            <ArticleProse content={event.description} />
          </div>
        </section>
      ) : null}

      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-events"
        className="mt-10"
      />

      <p className="mt-10">
        <Link
          href="/local-events"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          ← All local events
        </Link>
      </p>
    </div>
  );
}

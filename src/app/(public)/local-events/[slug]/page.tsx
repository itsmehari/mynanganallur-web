import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { RelatedBlock } from "@/components/internal-linking/related-block";
import { ListingBreadcrumb } from "@/components/listings/listing-breadcrumb";
import { ListingGeoBlock } from "@/components/listings/listing-geo-block";
import { ResponsiveAdSlot } from "@/components/listings/responsive-ad-slot";
import { StickyListingActions } from "@/components/listings/sticky-listing-actions";
import { ArticleProse } from "@/components/news/article-prose";
import { ShareRow } from "@/components/share/share-row";
import { HelpfulButtons } from "@/components/reactions/helpful";
import {
  getPublishedEventBySlug,
  getPublishedEventSlugsForSite,
} from "@/domains/events";
import {
  buildEventAutoFaq,
  resolveFaqItems,
} from "@/lib/listings/faq-generators";
import { getSiteUrl } from "@/lib/env";
import { buildOgImageUrl } from "@/lib/seo/og";
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
  const ogImage = buildOgImageUrl({
    title: event.title,
    kind: "event",
    locality: event.localityLabel ?? event.venueName ?? null,
  });
  return {
    title: `${event.title} · Local events`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${event.title} · Local events · mynanganallur.in`,
      description: desc,
      url,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} · Local events · mynanganallur.in`,
      description: desc,
      images: [ogImage],
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
  const pageUrl = `${getSiteUrl()}/local-events/${event.slug}`;
  const faqItems = resolveFaqItems(event.faqJson, buildEventAutoFaq(event));

  const mapsQuery = event.venueAddress ?? where;
  const mapsUrl = mapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`
    : null;

  const stickyActions = [
    ...(mapsUrl
      ? [
          {
            type: "link" as const,
            href: mapsUrl,
            label: "Open map",
            external: true,
            variant: "secondary" as const,
          },
        ]
      : []),
    {
      type: "share" as const,
      url: pageUrl,
      title: event.title,
      channelLabel: "event",
    },
  ];

  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 pb-20 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <ListingBreadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Local events", href: "/local-events" },
          { name: event.title, href: `/local-events/${event.slug}` },
        ]}
      />

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-[var(--accent-warm)]">
        Local event
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
        {event.title}
      </h1>
      <p className="mt-4 text-sm text-[var(--muted)]">
        <time dateTime={event.startsAt.toISOString()}>{when}</time>
        {event.allDay ? " · All day" : null}
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{where}</p>

      <ListingGeoBlock
        question={`When and where is ${event.title}?`}
        directAnswer={`${event.title} is on ${when}${event.allDay ? " (all day)" : ""} at ${where}. Confirm with the organiser before you travel.`}
        className="mt-6"
      />

      <ResponsiveAdSlot
        slotId="events-detail-top"
        pagePath={`/local-events/${slug}`}
        className="mt-8"
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

      <ShareRow url={pageUrl} title={event.title} channelLabel="event" />

      <HelpfulButtons entityType="event" entityId={event.id} />

      <FaqBlock items={faqItems} pageUrl={pageUrl} />

      <RelatedBlock
        kind="event"
        excludeId={event.id}
        locality={event.localityLabel}
      />

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

      <StickyListingActions actions={stickyActions} hideOnDesktop={false} />
    </div>
  );
}

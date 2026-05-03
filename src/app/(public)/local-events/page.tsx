import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { ListingFilterBar } from "@/components/search/listing-filter-bar";
import { listUpcomingEventsForSite } from "@/domains/events";
import { searchAcross } from "@/domains/search";
import { getSiteUrl } from "@/lib/env";
import { buildItemListJsonLd } from "@/lib/seo/itemlist-jsonld";

const canonicalPath = "/local-events";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Local events — festivals, culture & civic calendar",
  description:
    "Local events around Nanganallur: temple festivals, neighbourhood meetups, culture, and civic dates from mynanganallur.in.",
  alternates: { canonical: canonicalPath },
  openGraph: {
    title: "Local events | mynanganallur.in",
    description:
      "Festivals, meetups, and civic calendars for Nanganallur and nearby.",
    url: canonicalPath,
  },
};

function formatEventWhen(startsAt: Date, allDay: boolean): string {
  return startsAt.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: allDay ? undefined : "short",
    timeZone: "Asia/Kolkata",
  });
}

export default async function LocalEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locality?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || null;
  const locality = sp.locality?.trim() || null;
  let upcoming: Awaited<ReturnType<typeof listUpcomingEventsForSite>> = [];
  try {
    if (q || locality) {
      const search = await searchAcross({ q, locality, type: "event", limit: 25 });
      const all = await listUpcomingEventsForSite(200);
      const ids = new Set(search.hits.event.map((h) => h.id));
      upcoming = all.filter((e) => ids.has(e.id));
    } else {
      upcoming = await listUpcomingEventsForSite(50);
    }
  } catch {
    /* DATABASE_URL unset or DB unreachable */
  }

  const itemListLd = buildItemListJsonLd({
    name: "Upcoming local events near Nanganallur",
    pageUrl: `${getSiteUrl()}/local-events`,
    items: upcoming.map((e) => ({
      name: e.title,
      href: `/local-events/${e.slug}`,
    })),
  });

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <p className="text-sm font-medium text-[var(--accent-warm)]">
        Local events
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        What&apos;s on near Nanganallur
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Temple utsavams, concerts, workshops, and neighbourhood listings for
        the Nanganallur site. Open an event for full details — confirm dates
        and tickets with the organiser when contact info is provided.
      </p>

      <ListingFilterBar
        action="/local-events"
        q={q ?? undefined}
        locality={locality ?? undefined}
        qPlaceholder="Search events…"
      />

      {upcoming.length === 0 ? (
        <p className="mt-10 max-w-xl text-sm text-[var(--muted)]">
          No upcoming events in the calendar right now. Check back soon, or
          browse{" "}
          <Link href="/local-news" className="font-medium text-[var(--accent)]">
            local news
          </Link>{" "}
          for neighbourhood updates.
        </p>
      ) : (
        <ul className="mt-10 space-y-4">
          {upcoming.map((e) => (
            <li
              key={e.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-sm"
            >
              <Link
                href={`/local-events/${e.slug}`}
                className="block text-[var(--foreground)] transition hover:text-[var(--accent)]"
              >
                <span className="text-sm font-semibold">{e.title}</span>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  {formatEventWhen(e.startsAt, e.allDay)}
                  {" · "}
                  {e.venueName ?? e.localityLabel ?? "Details inside"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <AdSlot
        slotId="events-index-mid"
        size="728x90"
        seed={buildRotationSeed("/local-events", "events-index-mid")}
        className="mt-10 max-w-full"
      />
      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-events"
        className="mt-10 max-w-xl"
      />
      <Link
        href="/"
        className="mt-10 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}

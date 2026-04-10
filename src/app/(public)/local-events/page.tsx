import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { listUpcomingEventsForSite } from "@/domains/events";

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

export default async function LocalEventsPage() {
  let upcoming: Awaited<ReturnType<typeof listUpcomingEventsForSite>> = [];
  try {
    upcoming = await listUpcomingEventsForSite(50);
  } catch {
    /* DATABASE_URL unset or DB unreachable */
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
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

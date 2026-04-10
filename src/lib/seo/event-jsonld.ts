import type { PublicEventRow } from "@/domains/events";
import { getSiteUrl } from "@/lib/env";

function isOnlineVenue(event: PublicEventRow): boolean {
  const n = (event.venueName ?? "").toLowerCase();
  const loc = (event.localityLabel ?? "").toLowerCase();
  return (
    loc === "online" ||
    n.includes("online") ||
    n.includes("zoom") ||
    n.includes("google meet") ||
    n.includes("virtual")
  );
}

function stripMarkdownLite(s: string): string {
  return s
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

/**
 * Event JSON-LD when Google minimums are met: name, startDate, location.
 */
export function buildEventJsonLd(event: PublicEventRow) {
  const base = getSiteUrl();
  const url = `${base}/local-events/${event.slug}`;
  const startDate = event.startsAt.toISOString();
  const endDate = event.endsAt?.toISOString();
  const online = isOnlineVenue(event);

  const location = online
    ? {
        "@type": "VirtualLocation" as const,
        url,
      }
    : {
        "@type": "Place" as const,
        name: event.venueName ?? event.localityLabel ?? "Venue TBA",
        ...(event.venueAddress
          ? {
              address: {
                "@type": "PostalAddress" as const,
                streetAddress: event.venueAddress,
              },
            }
          : {}),
      };

  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate,
    eventAttendanceMode: online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location,
    url,
    ...(endDate ? { endDate } : {}),
    ...(event.description
      ? {
          description: stripMarkdownLite(event.description).slice(0, 5000),
        }
      : {}),
  };

  return payload;
}

export function buildEventBreadcrumbJsonLd(slug: string, title: string) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: base,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Local events",
        item: `${base}/local-events`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${base}/local-events/${slug}`,
      },
    ],
  };
}

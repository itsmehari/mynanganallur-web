import type { FaqItem } from "@/lib/seo/faq-jsonld";

export type ListingHubKey = "properties" | "jobs" | "events" | "directory";

export type ListingHubContent = {
  path: string;
  eyebrow: string;
  h1: string;
  intro: string;
  geoQuestion: string;
  geoDirectAnswer: string;
  localityLine: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogKind: "property" | "job" | "event" | "business";
  ogTitle: string;
  itemListName: string;
  faq: FaqItem[];
  emptyTitle: string;
  emptyBody: string;
  emptyCtaHref: string;
  emptyCtaLabel: string;
};

const NEARBY =
  "Nanganallur, Madipakkam, Adambakkam, Pazhavanthangal, Puzhuthivakkam, Ullagaram and nearby Chennai localities";

export const LISTING_HUB_CONTENT: Record<ListingHubKey, ListingHubContent> = {
  properties: {
    path: "/properties",
    eyebrow: "Properties",
    h1: "Rent & sale near Nanganallur",
    intro:
      "Local houses, flats and land with full detail pages. Every listing is advertiser-submitted — visit in person and verify paperwork before you pay.",
    geoQuestion: "Where can I find houses for rent or sale in Nanganallur?",
    geoDirectAnswer:
      "Browse rent and sale listings on mynanganallur.in for Nanganallur and nearby neighbourhoods. Each property has a dedicated page with location, terms and contact details. Confirm on site before paying any advance.",
    localityLine: `Listings across ${NEARBY}.`,
    metaTitle:
      "Properties for rent & sale in Nanganallur · mynanganallur.in",
    metaDescription:
      "Houses, flats and land for rent or sale in Nanganallur, Madipakkam, Adambakkam and nearby Chennai areas. Local listings with contact details on mynanganallur.in.",
    keywords: [
      "Nanganallur property",
      "houses for rent Nanganallur",
      "flats for sale Nanganallur",
      "Madipakkam rent",
      "Ullagaram property",
      "mynanganallur properties",
    ],
    ogKind: "property",
    ogTitle: "Properties for rent & sale",
    itemListName: "Properties for rent & sale near Nanganallur",
    faq: [
      {
        q: "Where can I find houses for rent in Nanganallur?",
        a: "Use the Properties section on mynanganallur.in and filter by Rent, or search by locality such as Madipakkam or Ullagaram. Open a listing for full details and contact the advertiser directly.",
      },
      {
        q: "How do I post a property on mynanganallur.in?",
        a: "Message us on WhatsApp from the property listings page or use Submit a listing. Share location, rent or sale terms, photos if available, and contact details. We publish after a quick review.",
      },
      {
        q: "Are property listings verified?",
        a: "Listings are advertiser-submitted community posts. mynanganallur.in does not guarantee title, condition or pricing. Always visit the property and verify documents before paying.",
      },
      {
        q: "What areas are covered?",
        a: "Nanganallur and nearby belts including Madipakkam, Adambakkam, Pazhavanthangal, Puzhuthivakkam and Ullagaram.",
      },
    ],
    emptyTitle: "No properties match your filters",
    emptyBody: "Try clearing filters or post your rent or sale listing.",
    emptyCtaHref: "/submit/property",
    emptyCtaLabel: "Submit a property",
  },
  jobs: {
    path: "/jobs",
    eyebrow: "Jobs",
    h1: "Work near Nanganallur",
    intro:
      "Open roles from local employers and residents. Verify salary and requirements with the employer before you apply.",
    geoQuestion: "Where can I find jobs in Nanganallur and nearby areas?",
    geoDirectAnswer:
      "mynanganallur.in lists open jobs for shops, schools, offices and homes around Nanganallur and adjacent neighbourhoods. Each role has a detail page; many accept applications via WhatsApp.",
    localityLine: `Roles in and around ${NEARBY}.`,
    metaTitle: "Jobs in Nanganallur & nearby · mynanganallur.in",
    metaDescription:
      "Local job openings in Nanganallur, Madipakkam, Adambakkam and nearby Chennai areas. Browse roles and apply via WhatsApp where listed.",
    keywords: [
      "Nanganallur jobs",
      "jobs Madipakkam",
      "local jobs Chennai",
      "part time jobs Nanganallur",
      "mynanganallur jobs",
    ],
    ogKind: "job",
    ogTitle: "Jobs near Nanganallur",
    itemListName: "Jobs near Nanganallur",
    faq: [
      {
        q: "How do I find jobs in Nanganallur?",
        a: "Browse the Jobs hub on mynanganallur.in. Filter by locality or search by role title. Open a listing for the full description and apply via WhatsApp when available.",
      },
      {
        q: "How do I post a job opening?",
        a: "Use Submit a listing → Post a job, or contact the site team. Share the role title, location, pay range if known, and how candidates should apply.",
      },
      {
        q: "Does mynanganallur.in charge job seekers?",
        a: "No fee should be paid to mynanganallur.in to apply. If an employer or intermediary asks for money, treat it as a red flag and verify independently.",
      },
    ],
    emptyTitle: "No open jobs match your filters",
    emptyBody: "Try different keywords or check back soon.",
    emptyCtaHref: "/submit/job",
    emptyCtaLabel: "Post a job",
  },
  events: {
    path: "/local-events",
    eyebrow: "Local events",
    h1: "What's on near Nanganallur",
    intro:
      "Temple utsavams, concerts, workshops and neighbourhood gatherings. Confirm dates and tickets with the organiser.",
    geoQuestion: "What events are happening in Nanganallur?",
    geoDirectAnswer:
      "The Local events calendar on mynanganallur.in lists upcoming festivals, cultural programmes and community gatherings in Nanganallur and nearby areas, with dates and venue details on each event page.",
    localityLine: `Events across ${NEARBY}.`,
    metaTitle:
      "Local events in Nanganallur · festivals & community calendar",
    metaDescription:
      "Upcoming events around Nanganallur: temple festivals, concerts, workshops and civic dates. Full details on mynanganallur.in.",
    keywords: [
      "Nanganallur events",
      "temple festival Nanganallur",
      "local events Chennai",
      "mynanganallur events",
    ],
    ogKind: "event",
    ogTitle: "Local events near Nanganallur",
    itemListName: "Upcoming local events near Nanganallur",
    faq: [
      {
        q: "How do I find events in Nanganallur?",
        a: "Visit the Local events page on mynanganallur.in for upcoming listings with dates and venues. Open an event for full details.",
      },
      {
        q: "How do I submit an event?",
        a: "Use Submit a listing → Announce an event with the title, date, venue and a short description. We publish after review.",
      },
      {
        q: "Are event dates guaranteed?",
        a: "Dates come from organisers and community posts. Always confirm with the organiser before you travel, especially for temple festivals.",
      },
    ],
    emptyTitle: "No upcoming events match your filters",
    emptyBody: "Browse local news for neighbourhood updates or submit an event.",
    emptyCtaHref: "/submit/event",
    emptyCtaLabel: "Submit an event",
  },
  directory: {
    path: "/directory",
    eyebrow: "Directory",
    h1: "Explore places, tutors, and businesses",
    intro:
      "Schools, temples, clinics, tutors and more around Nanganallur. Phones and hours change — confirm before you visit.",
    geoQuestion: "Where can I find local businesses and services in Nanganallur?",
    geoDirectAnswer:
      "The Directory on mynanganallur.in lists schools, temples, hospitals, tutors, banks and other neighbourhood services in Nanganallur and nearby areas, each with its own page for search and sharing.",
    localityLine: `Entries across ${NEARBY}.`,
    metaTitle: "Nanganallur directory · schools, temples & local services",
    metaDescription:
      "Local directory for Nanganallur: schools, tutors, temples, hospitals, food and daily services. Find contact details on mynanganallur.in.",
    keywords: [
      "Nanganallur directory",
      "schools Nanganallur",
      "tutors Nanganallur",
      "temples Nanganallur",
      "mynanganallur directory",
    ],
    ogKind: "business",
    ogTitle: "Nanganallur local directory",
    itemListName: "Local directory — Nanganallur",
    faq: [
      {
        q: "What is in the Nanganallur directory?",
        a: "Schools, colleges, tutors, temples, hospitals, banks, food outlets and other neighbourhood listings with locality labels and contact details where available.",
      },
      {
        q: "How do I list my business?",
        a: "Use Submit a listing → List your business with name, category, address and phone. We add or update entries after review.",
      },
      {
        q: "Are directory listings verified?",
        a: "Some entries are marked verified; others are seeded from public sources. Always call ahead to confirm hours and services.",
      },
    ],
    emptyTitle: "No directory entries match your search",
    emptyBody: "Try a different search or list your business.",
    emptyCtaHref: "/submit/business",
    emptyCtaLabel: "List your business",
  },
};

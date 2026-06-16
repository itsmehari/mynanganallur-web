import type { FaqItem } from "@/lib/seo/faq-jsonld";

/** Canonical path for the Nanganallur Connect locality pillar. */
export const NANGANALLUR_CONNECT_PATH = "/nanganallur-connect";

export const NANGANALLUR_CONNECT = {
  eyebrow: "Locality hub",
  h1: "Nanganallur Connect",
  intro:
    "Your front door to Nanganallur and nearby Chennai neighbourhoods — local news, jobs, events, homes, directory listings, and community on mynanganallur.in.",
  geoQuestion: "What is Nanganallur Connect on mynanganallur.in?",
  geoDirectAnswer:
    "Nanganallur Connect is the locality pillar on mynanganallur.in — a single place to discover Nanganallur and nearby belts including Madipakkam, Adambakkam, Pazhavanthangal, Puzhuthivakkam, and Ullagaram. Browse news, jobs, events, property listings, and neighbourhood services, or join the local WhatsApp community.",
  localityLine:
    "Editorial coverage and listings for Nanganallur, Madipakkam, Adambakkam, Pazhavanthangal, Puzhuthivakkam, Ullagaram and adjacent Chennai pockets.",
  metaTitle:
    "Nanganallur Connect · Local news, jobs, events & listings · mynanganallur.in",
  metaDescription:
    "Nanganallur Connect — your local hub for news, jobs, events, property listings, directory, and community across Nanganallur and nearby Chennai neighbourhoods on mynanganallur.in.",
  keywords: [
    "Nanganallur",
    "Nanganallur Connect",
    "Nanganallur Chennai",
    "Nanganallur local news",
    "Nanganallur jobs",
    "Nanganallur events",
    "Nanganallur property",
    "Nanganallur community",
    "Madipakkam",
    "mynanganallur",
  ],
  ogTitle: "Nanganallur Connect",
  livingMd: `## Living in Nanganallur

**Nanganallur** is a well-known residential neighbourhood in **south Chennai**, shaped by temple streets, dense bazaar lanes, and a strong sense of community. Most residents mean the **temple-and-bazaar cluster** when they say “Nanganallur” — flower vendors, kalyana mandapams, schools, and daily needs within walking distance.

## Connectivity

Families here balance **walkable local life** with wider city access. Suburban rail via **Pazhavanthangal** and **Velachery**, metro expansion, and road links toward **OMR** and airport corridors make Nanganallur a practical base for IT parks, hospitals, and schools across the south belt.

## Nearby pockets we cover

mynanganallur.in treats **Nanganallur as the anchor** but also covers adjacent neighbourhoods many families cross daily — **Madipakkam**, **Adambakkam**, **Pazhavanthangal**, **Puzhuthivakkam**, **Ullagaram**, and OMR-adjacent belts. Use the area hubs below for hyperlocal context, or jump straight to jobs, events, and listings.

## How to use this site

- **Local news** for civic updates, mobility, and neighbourhood explainers
- **Jobs** for openings at shops, schools, offices, and homes nearby
- **Events** for temple utsavams, workshops, and community gatherings
- **Properties** for rent and sale listings (always verify on site)
- **Directory** for schools, clinics, temples, and local services
- **WhatsApp group** to stay in the loop with residents and businesses`,
} as const;

export type ConnectActionTile = {
  href: string;
  label: string;
  description: string;
  accent: string;
};

export const CONNECT_ACTION_TILES: ConnectActionTile[] = [
  {
    href: "/local-news",
    label: "Local news",
    description: "GCC beats, mobility, elections, and neighbourhood explainers.",
    accent: "#1a5c4a",
  },
  {
    href: "/local-events",
    label: "Events",
    description: "Temple festivals, concerts, workshops, and civic dates.",
    accent: "#5c3d1a",
  },
  {
    href: "/jobs",
    label: "Jobs",
    description: "Open roles from local employers — many accept WhatsApp apply.",
    accent: "#1a3d5c",
  },
  {
    href: "/properties",
    label: "Properties",
    description: "Houses and flats for rent or sale in Nanganallur and nearby.",
    accent: "#3d1a5c",
  },
  {
    href: "/directory",
    label: "Directory",
    description: "Schools, clinics, temples, tutors, and neighbourhood services.",
    accent: "#5c1a3d",
  },
  {
    href: "/nanganallur-whatsapp-group",
    label: "WhatsApp community",
    description: "Join the free neighbourhood group for local updates and leads.",
    accent: "#2d5c1a",
  },
];

export const CONNECT_FAQ: FaqItem[] = [
  {
    q: "Where is Nanganallur in Chennai?",
    a: "Nanganallur is a residential neighbourhood in south Chennai, Tamil Nadu, known for its temples, schools, and dense local bazaar streets. It sits inland from the OMR IT corridor, with suburban rail and metro links via nearby stations such as Pazhavanthangal and Velachery.",
  },
  {
    q: "What is Nanganallur Connect?",
    a: "Nanganallur Connect is the locality hub on mynanganallur.in — one page that links you to local news, jobs, events, property listings, the directory, area guides, and the neighbourhood WhatsApp community.",
  },
  {
    q: "How do I find houses for rent or sale in Nanganallur?",
    a: "Visit the Properties section on mynanganallur.in and filter by rent or sale, or search by locality such as Madipakkam or Ullagaram. Each listing has a detail page with contact details. Always visit in person and verify documents before paying.",
  },
  {
    q: "How do I find jobs in Nanganallur?",
    a: "Browse the Jobs hub on mynanganallur.in for open roles around Nanganallur and nearby areas. Open a listing for the full description; many accept applications via WhatsApp or phone.",
  },
  {
    q: "Is there a Nanganallur WhatsApp group?",
    a: "Yes. mynanganallur.in hosts a free neighbourhood WhatsApp community for residents and businesses in Nanganallur, Madipakkam, Adambakkam, and nearby areas. Join from the Nanganallur WhatsApp group page on this site.",
  },
  {
    q: "What areas does mynanganallur.in cover?",
    a: "Nanganallur is the anchor locality. The site also covers Madipakkam, Adambakkam, Pazhavanthangal, Puzhuthivakkam, Ullagaram, and other adjacent Chennai pockets where residents commute or shop daily.",
  },
  {
    q: "How do I post a job, property, event, or business listing?",
    a: "Use Submit a listing on mynanganallur.in — choose property, job, event, or business. Share the key details and contact information. Listings are reviewed before they go live.",
  },
  {
    q: "Are listings on mynanganallur.in verified?",
    a: "Most listings are advertiser-submitted community posts. mynanganallur.in does not guarantee title, salary, event dates, or business hours. Always confirm details directly with the advertiser or organiser before you commit.",
  },
];

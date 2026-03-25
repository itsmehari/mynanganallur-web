/** Typed mock feeds for the homepage until Articles / Events / Jobs ship (FEATURE_MAP P0). */

export type MockArticle = {
  title: string;
  category: string;
  date: string;
  href: string;
  excerpt?: string;
  /** Original publisher (homepage shows curated links until Articles MVP). */
  source?: string;
  /** When true, `href` opens in a new tab. */
  external?: boolean;
};

export type MockEvent = {
  title: string;
  when: string;
  where: string;
  href: string;
  /** Opens publisher / ticket site in a new tab. */
  external?: boolean;
};

export type MockJob = {
  title: string;
  company: string;
  location: string;
  href: string;
  /** Opens employer careers in a new tab. */
  external?: boolean;
};

export type MockListing = {
  title: string;
  price: string;
  area: string;
  href: string;
};

export const homeStats = {
  jobsLive: 128,
  eventsWeek: 18,
  guidesNew: 6,
};

/**
 * Curated Mar 25 2026 from public job boards and employer sites.
 * Always confirm role and location on the employer’s careers page before applying.
 */
export const mockJobs: MockJob[] = [
  {
    title: "Software Engineer",
    company: "Chargebee",
    location: "City offices · commute from Nanganallur",
    href: "https://careers.chargebee.com/",
    external: true,
  },
  {
    title: "Software Development Engineer",
    company: "Comcast",
    location: "City offices · commute from Nanganallur",
    href: "https://jobs.comcast.com/",
    external: true,
  },
  {
    title: "Senior Staff Software Engineer — Full Stack",
    company: "Freshworks",
    location: "City offices · commute from Nanganallur",
    href: "https://www.freshworks.com/company/careers/",
    external: true,
  },
  {
    title: "Content editor — Tamil & English",
    company: "mynanganallur.in",
    location: "Remote · Nanganallur (Tamil Nadu)",
    href: "/jobs",
  },
];

/**
 * Upcoming picks reachable from Nanganallur (Mar–Apr 2026).
 * Confirm dates, venue, and tickets on the organiser or ticket site.
 */
export const mockEvents: MockEvent[] = [
  {
    title: "Rajadhiraaj Yatra — musical theatre (Krishna)",
    when: "Fri 27 Mar – Sun 29 Mar 2026",
    where: "Sir Mutha Venkatasubba Rao Concert Hall",
    href: "https://happeningnext.com/event/rajadhiraaj-yatra-chennai-eid3a0dhj2fm9",
    external: true,
  },
  {
    title: "Sam Vishal & Priyanka — live at theme park",
    when: "Sat 28 Mar 2026 · evening",
    where: "VGP Universal Kingdom, ECR",
    href: "https://happeningnext.com/event/sam-vishal-andamp-priyanka-live-eid1xhv2wspveu",
    external: true,
  },
  {
    title: "Subramanya Swamy — Panguni Uthiram Vaibhavam",
    when: "Wed 1 Apr 2026",
    where: "Sholinganallur (Classic Farms Road)",
    href: "/local-events",
  },
  {
    title: "Candlelight — Best of Bollywood",
    when: "Sun 12 Apr 2026",
    where: "Museum Theatre, Egmore",
    href: "https://concerts50.com/show/candlelight-best-of-bollywood-in-chennai-tickets-apr-12-2026",
    external: true,
  },
];

export const mockListings: MockListing[] = [
  {
    title: "2-BHK near ECR link road",
    price: "₹22,000 / mo",
    area: "Perungudi",
    href: "/directory",
  },
  {
    title: "Office desk + ergonomic chair",
    price: "₹9,500",
    area: "Velachery",
    href: "/directory",
  },
  {
    title: "Honda Activa — single owner",
    price: "₹58,000",
    area: "Tambaram belt",
    href: "/directory",
  },
];

/**
 * Mirrors Nanganallur desk themes (The Hindu, Wikipedia, HRCE, TANGEDCO).
 * Headlines paraphrased; links go to publishers. Verify before treating as legal record.
 */
export const mockArticles: MockArticle[] = [
  {
    title: "Nanganallur residents irked over power cuts — demand substation upgrade",
    category: "Local",
    date: "Jul 2025",
    href: "https://www.thehindu.com/todays-paper/tp-features/tp-downtown/nanganallur-residents-irked-over-power-cuts/article69778835.ece",
    source: "The Hindu",
    external: true,
    excerpt:
      "100 Feet Road 33 kV substation, new transformers, and ₹29 cr Fifth Main–Pazhavanthangal subway link.",
  },
  {
    title: "Roads damaged in civic works put motorists to hardship in Nanganallur",
    category: "Mobility",
    date: "May 2025",
    href: "https://www.thehindu.com/todays-paper/tp-national/tp-tamilnadu/roads-damaged-in-civic-works-put-motorists-to-hardship-in-nanganallur/article69523260.ece",
    source: "The Hindu",
    external: true,
    excerpt:
      "UGD and storm-water works — uneven stretches on 4th Main Road after trench refills.",
  },
  {
    title: "Nanganallur — suburb, temple town, airport adjacency (local overview)",
    category: "Local",
    date: "Reference",
    href: "https://en.wikipedia.org/wiki/Nanganallur",
    source: "Wikipedia",
    external: true,
    excerpt:
      "Wards 166–167, Zone 12 Alandur; Palavanthangal subway flooding pattern in monsoon.",
  },
  {
    title: "Arulmigu Adivyadhihara Bhaktha Anjaneyar Temple, Nanganallur (HRCE)",
    category: "Local",
    date: "Reference",
    href: "https://hrce.tn.gov.in/hrcehome/index_temple.php?tid=19",
    source: "HRCE Tamil Nadu",
    external: true,
    excerpt:
      "Official registry TM000019 — 32-ft Hanuman, Ram Nagar.",
  },
  {
    title: "Roller-skating rink on 100 Feet Road — Nanganallur sporting note",
    category: "Local",
    date: "2011 opening",
    href: "https://en.wikipedia.org/wiki/Nanganallur",
    source: "Wikipedia",
    external: true,
    excerpt:
      "GCC-era facility near Civil Aviation Colony; confirm hours with corporation.",
  },
  {
    title: "Pre-monsoon electrical safety — TANGEDCO advisory (TN-wide, applies here)",
    category: "Consumer",
    date: "Seasonal",
    href: "https://www.tangedco.gov.in/",
    source: "TANGEDCO",
    external: true,
    excerpt:
      "Meter boxes, earthing, outdoor runs — critical in tight Nanganallur lanes.",
  },
  {
    title: "Open Space Reservation near Dharmalingeshwarar — residents seek GCC action",
    category: "Local",
    date: "Jul 2025",
    href: "https://www.thehindu.com/todays-paper/tp-features/tp-downtown/nanganallur-residents-irked-over-power-cuts/article69778835.ece",
    source: "The Hindu",
    external: true,
    excerpt:
      "Same grievance forum as power and roads — encroachment concerns on OSR land.",
  },
];

export const editorsPicks: MockArticle[] = [
  {
    title: "When Palavanthangal subway floods — backup routes toward Velachery",
    category: "Mobility",
    date: "Mar 2026",
    href: "https://en.wikipedia.org/wiki/Nanganallur",
    source: "Wikipedia",
    external: true,
  },
  {
    title: "Power cuts on 100 Feet Road — what RWAs asked TANGEDCO",
    category: "Local",
    date: "Jul 2025",
    href: "https://www.thehindu.com/todays-paper/tp-features/tp-downtown/nanganallur-residents-irked-over-power-cuts/article69778835.ece",
    source: "The Hindu",
    external: true,
  },
  {
    title: "Metro + MTC from Nanganallur — route cheat sheet",
    category: "Mobility",
    date: "Mar 2026",
    href: "https://en.wikipedia.org/wiki/Nanganallur",
    source: "Wikipedia",
    external: true,
  },
];

export const cityPulseBullets = [
  {
    title: "Power: 100 Feet Road substation upgrade — track TANGEDCO replies",
    href: "/local-news/topic/local",
  },
  {
    title: "Roads: post-UGD resurfacing on 4th Main and side streets",
    href: "/local-news/topic/mobility",
  },
  {
    title: "Rain: Palavanthangal subway + inner ring detour habits",
    href: "/local-news/topic/mobility",
  },
];

export const trendingTags = [
  { label: "Metro", href: "/local-news/topic/mobility" },
  { label: "GCC", href: "/local-news/topic/local" },
  { label: "Monsoon ready", href: "/local-news/topic/local" },
  { label: "Temple corridor", href: "/local-news/topic/local" },
  { label: "Startups", href: "/jobs" },
  { label: "Heritage walks", href: "/local-events" },
];

export const categoryTiles = [
  { label: "Schools & colleges", count: "—", href: "/directory", emoji: "🎓" },
  { label: "Hospitals", count: "—", href: "/directory", emoji: "🏥" },
  { label: "Food & dining", count: "—", href: "/directory", emoji: "🍽️" },
  { label: "Parks & beaches", count: "—", href: "/directory", emoji: "🌴" },
  { label: "Government desks", count: "—", href: "/directory", emoji: "🏛️" },
  { label: "Transit hubs", count: "—", href: "/directory", emoji: "🚇" },
  { label: "Banks & ATMs", count: "—", href: "/directory", emoji: "🏧" },
  { label: "Coworking", count: "—", href: "/directory", emoji: "💼" },
];

export const zoneShortcuts = [
  { label: "Nanganallur core", slug: "nanganallur-core" },
  { label: "Pazhavanthangal", slug: "pazhavanthangal-thillai-ganga" },
  { label: "Adambakkam", slug: "adambakkam-lake-view" },
  { label: "Madipakkam belt", slug: "madipakkam-keelkattalai" },
  { label: "OMR (near)", slug: "omr-perungudi-near" },
  { label: "Alandur · Mount", slug: "alandur-st-thomas-mount" },
];

export const sponsors = [
  {
    name: "Ward & civic reference",
    blurb: "Official corporation open data — cross-check ward and zone facts for Nanganallur.",
    href: "https://chennaicorporation.gov.in",
    external: true,
  },
  {
    name: "Community signal",
    blurb: "Tip lines + neighbourhood WhatsApp groups — coming soon on mynanganallur.in.",
    href: "/news",
    external: false,
  },
];

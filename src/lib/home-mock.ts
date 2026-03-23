/** Typed mock feeds for the homepage until Articles / Events / Jobs ship (FEATURE_MAP P0). */

export type MockArticle = {
  title: string;
  category: string;
  date: string;
  href: string;
  excerpt?: string;
};

export type MockEvent = {
  title: string;
  when: string;
  where: string;
  href: string;
};

export type MockJob = {
  title: string;
  company: string;
  location: string;
  href: string;
};

export type MockListing = {
  title: string;
  price: string;
  area: string;
  href: string;
};

export const homeStats = {
  jobsLive: 128,
  eventsWeek: 24,
  guidesNew: 6,
};

export const mockJobs: MockJob[] = [
  {
    title: "Senior React developer",
    company: "Coastal SaaS Labs",
    location: "Sholinganallur",
    href: "/jobs",
  },
  {
    title: "Civil site engineer",
    company: "GCC contractor partner",
    location: "Guindy",
    href: "/jobs",
  },
  {
    title: "Emergency medicine resident",
    company: "Adyar tertiary hospital",
    location: "Adyar",
    href: "/jobs",
  },
  {
    title: "Content editor — Tamil & English",
    company: "mychennaicity.in",
    location: "Remote · Chennai",
    href: "/jobs",
  },
];

export const mockEvents: MockEvent[] = [
  {
    title: "Beach clean-up — Thiruvanmiyur to Besant Nagar",
    when: "Sun · 6:30 am",
    where: "Karl Schmidt Memorial",
    href: "/events",
  },
  {
    title: "Metro corridor photography walk",
    when: "Sat · 5:00 pm",
    where: "Anna Nagar Tower",
    href: "/events",
  },
  {
    title: "Startup pitch open mic",
    when: "Fri · 7:00 pm",
    where: "OMR coworking hub",
    href: "/events",
  },
  {
    title: "Carnatic fusion — monsoon edition",
    when: "Next Thu · 6:45 pm",
    where: "Mylapore Sabha",
    href: "/events",
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

export const mockArticles: MockArticle[] = [
  {
    title:
      "GCC stormwater audit: which zones cleared desilting targets before monsoon?",
    category: "Civic",
    date: "Mar 21, 2026",
    href: "/news",
    excerpt:
      "A ward-level look at readiness signals — without the corridor-only lens.",
  },
  {
    title: "Chennai Metro Phase II: commuter pulse from Anna Nagar to OMR",
    category: "Mobility",
    date: "Mar 20, 2026",
    href: "/news",
  },
  {
    title: "North Chennai heat islands: tree cover vs built density in 2026",
    category: "Environment",
    date: "Mar 19, 2026",
    href: "/news",
  },
  {
    title: "OMR office leasing: small floors see faster fill than large blocks",
    category: "Economy",
    date: "Mar 18, 2026",
    href: "/news",
  },
  {
    title: "Marina to Besant: weekend safety pilots and lighting upgrades",
    category: "Public safety",
    date: "Mar 17, 2026",
    href: "/news",
  },
  {
    title: "GCC budget takeaway: what changed for solid waste in 2026–27",
    category: "Civic",
    date: "Mar 16, 2026",
    href: "/news",
  },
];

export const editorsPicks: MockArticle[] = [
  {
    title: "Velachery–St Thomas Mount MRTS: what the new link changes for south commutes",
    category: "Mobility",
    date: "Mar 15, 2026",
    href: "/news",
  },
  {
    title: "Elections 2026 desk: Chennai rolls, vulnerable booths, and what voters asked us",
    category: "Politics",
    date: "Mar 14, 2026",
    href: "/news",
  },
  {
    title: "Food scene: home kitchens that became Chennai’s quiet supper clubs",
    category: "Culture",
    date: "Mar 12, 2026",
    href: "/news",
  },
];

export const cityPulseBullets = [
  {
    title: "Water: desal + lake recharge projects to watch this quarter",
    href: "/news",
  },
  {
    title: "Roads: GCC’s termini upgrades — who gets paved first?",
    href: "/news",
  },
  {
    title: "Transit: bus lane pilots and last-mile gaps at major hubs",
    href: "/news",
  },
];

export const trendingTags = [
  { label: "Metro", href: "/news" },
  { label: "GCC", href: "/news" },
  { label: "Monsoon ready", href: "/news" },
  { label: "Elections 2026", href: "/news" },
  { label: "Startups", href: "/jobs" },
  { label: "Heritage walks", href: "/events" },
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
  { label: "North Chennai", slug: "tiruvottiyur-manali-belt" },
  { label: "Central Chennai", slug: "teynampet-nungambakkam" },
  { label: "West Chennai", slug: "ambattur-annanagar" },
  { label: "OMR IT corridor", slug: "omr-perungudi-sholinganallur" },
  { label: "Adyar coast", slug: "adyar-thiruvanmiyur" },
  { label: "South & airport link", slug: "saidapet-guindy-alandur" },
];

export const sponsors = [
  {
    name: "Explore Chennai data",
    blurb: "Open datasets for wards, zones, and mobility — verify before maps go live.",
    href: "https://chennaicorporation.gov.in",
    external: true,
  },
  {
    name: "Community signal",
    blurb: "Tip lines + neighbourhood WhatsApp groups — coming soon on mychennaicity.in.",
    href: "/news",
    external: false,
  },
];

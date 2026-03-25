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
    location: "Chennai",
    href: "https://careers.chargebee.com/",
    external: true,
  },
  {
    title: "Software Development Engineer",
    company: "Comcast",
    location: "Chennai",
    href: "https://jobs.comcast.com/",
    external: true,
  },
  {
    title: "Senior Staff Software Engineer — Full Stack",
    company: "Freshworks",
    location: "Chennai",
    href: "https://www.freshworks.com/company/careers/",
    external: true,
  },
  {
    title: "Content editor — Tamil & English",
    company: "mychennaicity.in",
    location: "Remote · Chennai",
    href: "/jobs",
  },
];

/**
 * Upcoming picks around Greater Chennai (Mar–Apr 2026).
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
    href: "/chennai-local-events",
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
 * Curated from Chennai / TN press (web research, Mar 22–23 2026).
 * Headlines paraphrased; links go to publishers. Verify before treating as legal record.
 */
export const mockArticles: MockArticle[] = [
  {
    title:
      "BJP: Piyush Goyal to finalise Tamil Nadu NDA seat-sharing (state polls 2026)",
    category: "Politics",
    date: "Mar 23, 2026 · Today",
    href: "https://www.hindustantimes.com/india-news/union-minister-piyush-goyal-to-finalise-seat-sharing-for-tamil-nadu-elections-today-bjp-101774229351188.html",
    source: "Hindustan Times",
    external: true,
    excerpt:
      "Alliance arithmetic ahead of the April 23 Assembly poll — watch Chennai constituencies in the mix.",
  },
  {
    title:
      "Tamil Nadu polls: carrying large cash or valuables in Chennai? Officials may ask for proof",
    category: "Chennai",
    date: "Mar 23, 2026 · Today",
    href: "https://timesofindia.indiatimes.com/city/chennai/tamil-nadu-polls-carrying-cash-or-valuables-be-ready-to-show-proof/articleshow/129626287.cms",
    source: "The Times of India",
    external: true,
    excerpt:
      "Model code vigilance on city roads — know the thresholds squads cite during checks.",
  },
  {
    title:
      "Thousand Lights DMK MLA Ezhilan on field work, flood mitigation and the 2026 contest",
    category: "Elections",
    date: "Mar 23, 2026 · Today",
    href: "https://www.thehindu.com/elections/tamil-nadu-assembly/only-structured-party-machinery-with-popularity-can-ensure-success-says-thousand-lights-dmk-mla-n-ezhilan/article70771692.ece",
    source: "The Hindu",
    external: true,
    excerpt:
      "Central Chennai constituency lens: party machinery vs. local issues on the ground.",
  },
  {
    title:
      "Mappedu multi-modal logistics park near Chennai: Phase I nears opening next month",
    category: "Economy",
    date: "Mar 23, 2026 · Today",
    href: "https://www.thehindu.com/news/cities/chennai/first-phase-of-multi-modal-logistics-park-near-chennai-to-be-ready-next-month/article70770006.ece",
    source: "The Hindu",
    external: true,
    excerpt:
      "Tiruvallur belt freight hub (~₹1,424 crore scope) — warehouses, cold chain, rail link.",
  },
  {
    title: "Petrol and diesel prices in Chennai on March 22, 2026",
    category: "Consumer",
    date: "Mar 22, 2026 · Yesterday",
    href: "https://www.dtnext.in/news/chennai/check-out-petrol-and-diesel-prices-in-chennai-on-march-22-2026",
    source: "DT Next",
    external: true,
    excerpt:
      "City pump rates — check the bulletin before you fill across neighbourhoods.",
  },
  {
    title:
      "128 vehicles deployed for election monitoring across Chennai’s 16 constituencies",
    category: "Elections",
    date: "Mar 22, 2026 · Yesterday",
    href: "https://www.thehindu.com/elections/tamil-nadu-assembly/128-vehicles-deployed-for-election-monitoring-in-chennai-as-eci-announces-poll-dates/article70746956.ece",
    source: "The Hindu",
    external: true,
    excerpt:
      "Flying squads, static teams and video surveillance — plus a toll-free complaint line.",
  },
  {
    title:
      "₹60.63 lakh in cash, liquor and narcotics seized in Chennai district amid poll surveillance",
    category: "Chennai",
    date: "Mar 22, 2026 · Yesterday",
    href: "https://www.thehindu.com/news/cities/chennai/6063-lakh-in-cash-liquor-and-narcotics-seized-in-chennai-district/article70773164.ece",
    source: "The Hindu",
    external: true,
    excerpt:
      "Intensified checks as the model code stays in force across city constituencies.",
  },
  {
    title:
      "Narrow stretches of arterial roads across Chennai to be widened soon, GCC told",
    category: "Mobility",
    date: "Mar 22, 2026 · Yesterday",
    href: "https://www.thehindu.com/news/cities/chennai/narrow-stretches-of-arterials-roads-across-chennai-to-be-widened-soon/article70727353.ece",
    source: "The Hindu",
    external: true,
    excerpt:
      "Traffic relief on key corridors — corporation lists priority pinch points.",
  },
];

export const editorsPicks: MockArticle[] = [
  {
    title:
      "Tamil Nadu polls: carrying cash in Chennai — what officials can ask you to prove",
    category: "Explainer",
    date: "Mar 23, 2026",
    href: "https://timesofindia.indiatimes.com/city/chennai/tamil-nadu-polls-carrying-cash-or-valuables-be-ready-to-show-proof/articleshow/129626287.cms",
    source: "The Times of India",
    external: true,
  },
  {
    title:
      "How Chennai is staffing election squads: 128 vehicles across 16 constituencies",
    category: "Civic",
    date: "Mar 22, 2026",
    href: "https://www.thehindu.com/elections/tamil-nadu-assembly/128-vehicles-deployed-for-election-monitoring-in-chennai-as-eci-announces-poll-dates/article70746956.ece",
    source: "The Hindu",
    external: true,
  },
  {
    title:
      "Mappedu logistics hub: what the first phase means for Chennai–Tiruvallur freight",
    category: "Economy",
    date: "Mar 23, 2026",
    href: "https://www.thehindu.com/news/cities/chennai/first-phase-of-multi-modal-logistics-park-near-chennai-to-be-ready-next-month/article70770006.ece",
    source: "The Hindu",
    external: true,
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
  { label: "Heritage walks", href: "/chennai-local-events" },
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

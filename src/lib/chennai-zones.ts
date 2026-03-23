/**
 * Greater Chennai — macro regions for v1 navigation (GCC-aligned naming where possible).
 * Slugs are stable; gccZoneNumber is optional until official mapping is locked.
 * geoVersion: bump when boundaries or grouping changes.
 */
export const CHENNAI_GEO_VERSION = "gcc-macro-v1";

export type ChennaiZone = {
  slug: string;
  label: string;
  blurb: string;
  gccZoneNumber?: number;
  /** Bento-map grid placement (1-based), mobile uses single column order */
  gridClass: string;
};

export const chennaiZones: ChennaiZone[] = [
  {
    slug: "tiruvottiyur-manali-belt",
    label: "Tiruvottiyur & Manali",
    blurb: "North coastal wards, fishing harbour links, and industrial belt stories.",
    gridClass: "md:col-span-2",
  },
  {
    slug: "madhavaram-madhavaram",
    label: "Madhavaram cluster",
    blurb: "Wholesale hubs, Mofussil bus links, and fast-growing northern corridors.",
    gccZoneNumber: 1,
    gridClass: "",
  },
  {
    slug: "royapuram-tondiarpet",
    label: "Royapuram & Tondiarpet",
    blurb: "Harbour-side neighbourhoods, markets, and heritage pockets.",
    gridClass: "",
  },
  {
    slug: "ambattur-annanagar",
    label: "Ambattur · Anna Nagar",
    blurb: "Western residential density, MSME corridors, and metro feeders.",
    gridClass: "md:row-span-2",
  },
  {
    slug: "teynampet-nungambakkam",
    label: "Teynampet & Nungambakkam",
    blurb: "CBD adjacency, hospitals, consulates, and cultural venues.",
    gridClass: "md:col-span-2",
  },
  {
    slug: "kodambakkam-t-nagar",
    label: "Kodambakkam · T. Nagar",
    blurb: "Retail cores, film industry adjacency, and buzzing evening economy.",
    gridClass: "",
  },
  {
    slug: "saidapet-guindy-alandur",
    label: "Saidapet · Guindy · Alandur",
    blurb: "Transit interchanges, IT adjacency, and airport access corridors.",
    gridClass: "",
  },
  {
    slug: "adyar-thiruvanmiyur",
    label: "Adyar to Thiruvanmiyur",
    blurb: "Coastal breeze, campuses, estuary ecology, and classic Chennai avenues.",
    gridClass: "md:col-span-2",
  },
  {
    slug: "omr-perungudi-sholinganallur",
    label: "OMR — Perungudi to Sholinganallur",
    blurb: "IT corridor pulse, startups, and apartment-town energy.",
    gridClass: "md:col-span-2",
  },
  {
    slug: "valasaravakkam-porur",
    label: "Valasaravakkam · Porur",
    blurb: "Lake views, suburban spread, and Porur–Poonamallee connectors.",
    gridClass: "",
  },
];

export function getChennaiZoneBySlug(slug: string): ChennaiZone | undefined {
  return chennaiZones.find((z) => z.slug === slug);
}

/**
 * Nanganallur and adjacent neighbourhoods for v1 navigation.
 * Slugs are stable. geoVersion: bump when boundaries or grouping changes.
 */
export const NANGANALLUR_GEO_VERSION = "nanganallur-v1";

export type NanganallurArea = {
  slug: string;
  label: string;
  blurb: string;
  /** Bento-map grid placement (1-based), mobile uses single column order */
  gridClass: string;
};

export const nanganallurAreas: NanganallurArea[] = [
  {
    slug: "nanganallur-core",
    label: "Nanganallur core",
    blurb: "Temple streets, bazaar lanes, and the heart of the locality.",
    gridClass: "md:col-span-2",
  },
  {
    slug: "pazhavanthangal-thillai-ganga",
    label: "Pazhavanthangal · Thillai Ganga Nagar",
    blurb: "Residential clusters, metro feeder roads, and daily-needs retail.",
    gridClass: "",
  },
  {
    slug: "adambakkam-lake-view",
    label: "Adambakkam · Lake View",
    blurb: "Schools, clinics, and connectors toward the airport corridor.",
    gridClass: "",
  },
  {
    slug: "madipakkam-keelkattalai",
    label: "Madipakkam · Keelkattalai",
    blurb: "Dense apartment belts and Velachery–Tambaram link roads.",
    gridClass: "md:row-span-2",
  },
  {
    slug: "pallavaram-thoraipakkam-belt",
    label: "Pallavaram · Thoraipakkam belt",
    blurb: "GST Road and radial links for commuters and small industry.",
    gridClass: "",
  },
  {
    slug: "alandur-st-thomas-mount",
    label: "Alandur · St Thomas Mount",
    blurb: "Metro interchange, MTC hubs, and airport access.",
    gridClass: "md:col-span-2",
  },
  {
    slug: "velachery-taramani-edge",
    label: "Velachery · Taramani edge",
    blurb: "Retail cores and IT-adjacent pockets within a short ride.",
    gridClass: "",
  },
  {
    slug: "omr-perungudi-near",
    label: "OMR — Perungudi (near)",
    blurb: "Work corridor within reach for many Nanganallur residents.",
    gridClass: "md:col-span-2",
  },
];

export function getNanganallurAreaBySlug(
  slug: string,
): NanganallurArea | undefined {
  return nanganallurAreas.find((a) => a.slug === slug);
}

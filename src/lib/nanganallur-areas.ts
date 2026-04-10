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
  /** Longer unique copy (markdown-lite) for hub pages — see ArticleProse. */
  extendedMd: string;
  /** AEO-style H2 (natural question). */
  geoQuestion: string;
  /** Direct answer under geoQuestion (plain text, extractable). */
  geoDirectAnswer: string;
};

export const nanganallurAreas: NanganallurArea[] = [
  {
    slug: "nanganallur-core",
    label: "Nanganallur core",
    blurb: "Temple streets, bazaar lanes, and the heart of the locality.",
    gridClass: "md:col-span-2",
    geoQuestion: "What defines Nanganallur core for residents and visitors?",
    geoDirectAnswer:
      "Nanganallur core is the dense temple-and-bazaar cluster most people mean when they say “Nanganallur”: narrow lanes, flower vendors, kalyana mandapams, and walkable daily needs within a few minutes of each other.",
    extendedMd: `## Daily rhythm

Morning arathi traffic, afternoon errands, and evening lights around the temple corridors set the pace. Many families have lived here for generations; newcomers often choose core pockets for the combination of **metro reach** (via nearby stations) and on-foot convenience.

## Connections

From core you can branch toward Pazhavanthangal for suburban rail, or toward Adambakkam and Madipakkam for wider retail strips. The core stays the emotional anchor even when work or school pulls people outward during the day.

## On this site

Use **local news** for civic and lane-level updates, **events** for utsavam and cultural dates, and the **directory** as listings mature for temples, clinics, and services you actually walk to.`,
  },
  {
    slug: "pazhavanthangal-thillai-ganga",
    label: "Pazhavanthangal · Thillai Ganga Nagar",
    blurb: "Residential clusters, metro feeder roads, and daily-needs retail.",
    gridClass: "",
    geoQuestion: "Why do commuters care about Pazhavanthangal and Thillai Ganga Nagar?",
    geoDirectAnswer:
      "These pockets blend **quiet residential blocks** with feeder roads to the metro and MTC corridors, so many Nanganallur residents treat them as the first hop toward the city centre or the airport side without living on the busiest arterials.",
    extendedMd: `## Neighbourhood texture

Apartment clusters and independent houses sit close to small parks and corner shops. Peak hours show predictable flows: school drops, office-bound buses, and shoppers hitting the nearest vegetable and pharmacy strips.

## Links to Nanganallur core

Temple and festival life still pulls many families back to **Nanganallur core** for weekends and auspicious days, even when weekday routines stay local to Pazhavanthangal.

## Staying informed

Follow **local news** for road and metro-adjacent updates, and **events** when sabhas or community halls post programmes that draw from across the zone.`,
  },
  {
    slug: "adambakkam-lake-view",
    label: "Adambakkam · Lake View",
    blurb: "Schools, clinics, and connectors toward the airport corridor.",
    gridClass: "",
    geoQuestion: "How does Adambakkam–Lake View fit the Nanganallur story?",
    geoDirectAnswer:
      "It is a **schools-and-clinics heavy** residential belt that many Nanganallur-linked families choose for slightly wider roads and airport-side connectivity while still treating Nanganallur as their cultural and shopping reference point.",
    extendedMd: `## Families and commutes

School runs and clinic visits structure the week. Airport-bound traffic is a steady background; residents learn which cut-throughs to avoid at rush hour.

## Shared services

Retail and healthcare choices often overlap with **Nanganallur core** and **Madipakkam** depending on specialty and word-of-mouth referrals.

## What we cover

Editorial **local news** notes when civic projects or water and storm drains touch these connectors; **directory** entries will grow for trusted paediatric, dental, and diagnostic options as data is verified.`,
  },
  {
    slug: "madipakkam-keelkattalai",
    label: "Madipakkam · Keelkattalai",
    blurb: "Dense apartment belts and Velachery–Tambaram link roads.",
    gridClass: "md:row-span-2",
    geoQuestion: "What stands out about Madipakkam and Keelkattalai from a Nanganallur lens?",
    geoDirectAnswer:
      "**High-density apartment corridors** and busy link roads toward Velachery and Tambaram mean this belt functions as a housing and retail pressure valve for people who still identify socially with Nanganallur’s temple-town identity.",
    extendedMd: `## Density and convenience

High-rise supply brought supermarkets, cloud kitchens, and tuition clusters. Evening markets and weekend mall trips split between local strips and short rides toward Velachery.

## Traffic reality

Keelkattalai link segments need patience at peak; **mobility** stories in our news archive matter here when bus routes or flyovers shift.

## Cross-links

Browse **local news** topics such as **Mobility** and **Local** for corridor updates. **Jobs** highlights employers many residents commute toward.`,
  },
  {
    slug: "pallavaram-thoraipakkam-belt",
    label: "Pallavaram · Thoraipakkam belt",
    blurb: "GST Road and radial links for commuters and small industry.",
    gridClass: "",
    geoQuestion: "Who lives along the Pallavaram–Thoraipakkam belt but roots in Nanganallur?",
    geoDirectAnswer:
      "**GST Road commuters** and small-industry workers often keep family ties and festival calendars anchored in Nanganallur while using this belt for housing value and radial access toward the south and the IT side.",
    extendedMd: `## Work and housing

Industrial pockets and highway-front retail sit beside residential layouts. Noise and logistics are part of the trade-off for shorter hops to certain job clusters.

## Editorial angle

We cover this belt when **civic**, **economy**, or **mobility** stories affect people who still shop and worship in Nanganallur proper.

## Next steps on site

Filter **local news** by topic; use **events** when sabhas list GST-side venues. **Directory** will add verified service listings over time.`,
  },
  {
    slug: "alandur-st-thomas-mount",
    label: "Alandur · St Thomas Mount",
    blurb: "Metro interchange, MTC hubs, and airport access.",
    gridClass: "md:col-span-2",
    geoQuestion: "Why is Alandur–St Thomas Mount in a Nanganallur neighbourhood map?",
    geoDirectAnswer:
      "The **metro interchange and MTC concentration** make this one of the fastest escape hatches to the airport and the city centre for Nanganallur residents who do not want to drive the full ring of inner roads every trip.",
    extendedMd: `## Interchange life

Crowds peak at shift changes; station-adjacent commerce stays active late. Many Nanganallur families time airport drops through this node.

## News you will see here

**Mobility** and **Local** pieces often mention interchange capacity, last-mile autos, and pedestrian safety — all relevant if your route touches Mount before you head home to Nanganallur.

## Explore

Read **local news**, check **events** for citywide programmes that list Mount-area venues, and watch **jobs** for employers along the corridor.`,
  },
  {
    slug: "velachery-taramani-edge",
    label: "Velachery · Taramani edge",
    blurb: "Retail cores and IT-adjacent pockets within a short ride.",
    gridClass: "",
    geoQuestion: "How do Velachery and the Taramani edge relate to Nanganallur commuters?",
    geoDirectAnswer:
      "They are the **nearest major retail and office gravity wells** for many Nanganallur commuters — short rides for malls, hospitals, and IT parks, with daily return to a quieter residential base.",
    extendedMd: `## Weekday pulls

Office shuttles and personal vehicles stack toward Taramani-linked IT pockets; evenings reverse toward Velachery dining and groceries.

## Consumer and economy

Our **Consumer** and **Economy** topic pages often intersect with what this edge means for household spending and small business.

## Keep current

Use **local news** for crossover stories (flooding, metro phases, road work) and **jobs** for roles that justify the commute.`,
  },
  {
    slug: "omr-perungudi-near",
    label: "OMR — Perungudi (near)",
    blurb: "Work corridor within reach for many Nanganallur residents.",
    gridClass: "md:col-span-2",
    geoQuestion: "Why list OMR–Perungudi on a Nanganallur-focused site?",
    geoDirectAnswer:
      "A large share of Nanganallur households still **works on or near OMR**; Perungudi is one of the common first stops, so traffic patterns, rain flooding, and employer news there directly shape their week.",
    extendedMd: `## Corridor reality

Peak OMR is its own ecosystem: tech parks, hospitals, and food courts. Residents trade longer commutes for career options, then filter local life through Nanganallur’s temples and schools.

## Coverage overlap

When **Mobility** or **Economy** stories touch OMR phases, we frame them for readers who live in Nanganallur and neighbouring pockets.

## Actions

Scan **jobs** for OMR employers, **local news** for corridor infrastructure, and **events** when institutes list Perungudi venues.`,
  },
];

export function getNanganallurAreaBySlug(
  slug: string,
): NanganallurArea | undefined {
  return nanganallurAreas.find((a) => a.slug === slug);
}

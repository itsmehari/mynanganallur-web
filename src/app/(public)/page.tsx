import type { Metadata } from "next";
import { Section } from "@/components/home/section";
import { HomeAreaMap } from "@/components/home/home-area-map";
import { HomeDbNewsSections } from "@/components/home/db-news-sections";
import {
  HomeCategoryMosaic,
  HomeCityPulse,
  HomeEventsFeatured,
  HomeHero,
  HomeJobsSpotlight,
  HomeMarketplaceTeaser,
  HomeSeasonalHub,
  HomeSponsoredRow,
  HomeStatsRibbon,
  HomeTrendingTags,
  HomeTrustStrip,
  HomeZoneShortcuts,
} from "@/components/home/home-content";
import { HomeCommunityBand } from "@/components/home/home-community-band";
import { HomeJsonLd } from "@/components/seo/home-json-ld";
import {
  featuredArticlesForHome,
  latestArticlesForHome,
} from "@/domains/news";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Chennai-wide local news, jobs, events, listings, and interactive Greater Chennai area hubs.",
  alternates: { canonical: getSiteUrl() },
  openGraph: {
    title: "mychennaicity.in — Chennai news, jobs, events & listings",
    description:
      "Discover Greater Chennai by area: news, directory, jobs, and events.",
    url: getSiteUrl(),
    siteName: "mychennaicity.in",
    locale: "en_IN",
    type: "website",
  },
};

export default async function Home() {
  let featured: Awaited<ReturnType<typeof featuredArticlesForHome>> = [];
  let latest: Awaited<ReturnType<typeof latestArticlesForHome>> = [];
  try {
    featured = await featuredArticlesForHome(3);
    latest = await latestArticlesForHome(8);
  } catch {
    /* DATABASE_URL unset or DB unreachable — home still renders */
  }

  const editorPicks =
    featured.length > 0 ? featured : latest.slice(0, 3);

  return (
    <>
      <HomeJsonLd />
      <div className="mx-auto max-w-[1280px] space-y-16 px-4 py-10 sm:py-14">
        <HomeHero />
        <HomeTrustStrip />

        <HomeCategoryMosaic />

        <HomeZoneShortcuts />

        <Section
          id="areas"
          eyebrow="Neighbourhoods"
          title="Greater Chennai area map"
          subtitle="Click a tile to open its hub — listings and filters wire in as the database goes live."
          action={{ href: "/directory", label: "Browse all listings" }}
        >
          <HomeAreaMap />
        </Section>

        <HomeStatsRibbon />

        <HomeJobsSpotlight />
        <HomeEventsFeatured />
        <HomeMarketplaceTeaser />

        <HomeTrendingTags />
        <HomeDbNewsSections latest={latest} featured={editorPicks} />
        <HomeCityPulse />

        <HomeSeasonalHub />
        <HomeSponsoredRow />
        <HomeCommunityBand />
      </div>
    </>
  );
}

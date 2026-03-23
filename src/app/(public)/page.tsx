import type { Metadata } from "next";
import { Section } from "@/components/home/section";
import { HomeAreaMap } from "@/components/home/home-area-map";
import {
  HomeCategoryMosaic,
  HomeCityPulse,
  HomeEditorsPicks,
  HomeEventsFeatured,
  HomeHero,
  HomeJobsSpotlight,
  HomeMarketplaceTeaser,
  HomeNewsBulletin,
  HomeSeasonalHub,
  HomeSponsoredRow,
  HomeStatsRibbon,
  HomeTrendingTags,
  HomeTrustStrip,
  HomeZoneShortcuts,
} from "@/components/home/home-content";
import { HomeCommunityBand } from "@/components/home/home-community-band";
import { HomeJsonLd } from "@/components/seo/home-json-ld";
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

export default function Home() {
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
        <HomeNewsBulletin />
        <HomeEditorsPicks />
        <HomeCityPulse />

        <HomeSeasonalHub />
        <HomeSponsoredRow />
        <HomeCommunityBand />
      </div>
    </>
  );
}

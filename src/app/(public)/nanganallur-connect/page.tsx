import type { Metadata } from "next";
import { ConnectActionGrid } from "@/components/nanganallur-connect/connect-action-grid";
import { ConnectLiveSnapshots } from "@/components/nanganallur-connect/connect-live-snapshots";
import { ConnectSubmitGrid } from "@/components/nanganallur-connect/connect-submit-grid";
import { FaqBlock } from "@/components/faq/faq-block";
import { HomeAreaMap } from "@/components/home/home-area-map";
import { ListingBreadcrumb } from "@/components/listings/listing-breadcrumb";
import { ListingGeoBlock } from "@/components/listings/listing-geo-block";
import { ArticleProse } from "@/components/news/article-prose";
import {
  CONNECT_FAQ,
  NANGANALLUR_CONNECT,
  NANGANALLUR_CONNECT_PATH,
} from "@/lib/nanganallur-connect-content";
import { getSiteUrl } from "@/lib/env";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumb-jsonld";
import { buildHubMetadata } from "@/lib/seo/hub-page-metadata";
import { buildNanganallurConnectJsonLd } from "@/lib/seo/nanganallur-connect-jsonld";

export const revalidate = 120;

const HUB = NANGANALLUR_CONNECT;

export const metadata: Metadata = buildHubMetadata({
  path: NANGANALLUR_CONNECT_PATH,
  title: HUB.metaTitle,
  description: HUB.metaDescription,
  keywords: [...HUB.keywords],
  ogKind: "area",
  ogTitle: HUB.ogTitle,
});

export default function NanganallurConnectPage() {
  const pageUrl = `${getSiteUrl()}${NANGANALLUR_CONNECT_PATH}`;
  const crumbLd = buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Nanganallur Connect", href: NANGANALLUR_CONNECT_PATH },
  ]);
  const pageLd = buildNanganallurConnectJsonLd(HUB.geoDirectAnswer);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }}
      />

      <ListingBreadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Nanganallur Connect", href: NANGANALLUR_CONNECT_PATH },
        ]}
      />

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        {HUB.eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {HUB.h1}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
        {HUB.intro}
      </p>

      <ListingGeoBlock
        question={HUB.geoQuestion}
        directAnswer={HUB.geoDirectAnswer}
        localityLine={HUB.localityLine}
        className="mt-8"
      />

      <ConnectActionGrid />
      <ConnectLiveSnapshots />

      <section aria-labelledby="connect-areas-heading" className="mt-14">
        <h2
          id="connect-areas-heading"
          className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
        >
          Neighbourhood area hubs
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Tap a tile for hyperlocal context — Nanganallur core, Madipakkam belt,
          Pazhavanthangal, and more.
        </p>
        <div className="mt-6">
          <HomeAreaMap />
        </div>
      </section>

      <section aria-labelledby="connect-living-heading" className="mt-14 max-w-3xl">
        <h2
          id="connect-living-heading"
          className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
        >
          Living in Nanganallur
        </h2>
        <div className="mt-6">
          <ArticleProse content={HUB.livingMd} />
        </div>
      </section>

      <FaqBlock
        items={CONNECT_FAQ}
        pageUrl={pageUrl}
        heading="Nanganallur — frequently asked"
      />

      <ConnectSubmitGrid />
    </div>
  );
}

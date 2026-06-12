import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { RelatedBlock } from "@/components/internal-linking/related-block";
import { ListingBreadcrumb } from "@/components/listings/listing-breadcrumb";
import { ListingContactActions } from "@/components/listings/listing-contact-actions";
import { ListingFactsGrid } from "@/components/listings/listing-facts-grid";
import { ListingGeoBlock } from "@/components/listings/listing-geo-block";
import { ResponsiveAdSlot } from "@/components/listings/responsive-ad-slot";
import { StickyListingActions } from "@/components/listings/sticky-listing-actions";
import { ArticleProse } from "@/components/news/article-prose";
import { PropertyListWhatsAppCta } from "@/components/properties/property-list-whatsapp-cta";
import { ShareRow } from "@/components/share/share-row";
import { HelpfulButtons } from "@/components/reactions/helpful";
import {
  getPublishedPropertyBySlug,
  getPublishedPropertySlugsForSite,
} from "@/domains/properties";
import {
  buildPropertyAutoFaq,
  resolveFaqItems,
} from "@/lib/listings/faq-generators";
import { propertyFactPills } from "@/lib/listings/format";
import { getSiteUrl } from "@/lib/env";
import { buildOgImageUrl } from "@/lib/seo/og";
import {
  buildPropertyBreadcrumbJsonLd,
  buildPropertyListingJsonLd,
} from "@/lib/seo/property-listing-jsonld";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 120;

function clipMetaDescription(raw: string, max = 155): string {
  const t = raw.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function stripMarkdownLite(s: string): string {
  return s
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedPropertySlugsForSite();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let row: Awaited<ReturnType<typeof getPublishedPropertyBySlug>> = null;
  try {
    row = await getPublishedPropertyBySlug(slug);
  } catch {
    return { title: "Property" };
  }
  if (!row) {
    return { title: "Property" };
  }
  const base = getSiteUrl();
  const url = `${base}/properties/${row.slug}`;
  const desc = clipMetaDescription(
    row.summary ||
      stripMarkdownLite(row.body).slice(0, 400) ||
      row.title,
  );
  const ogImage = row.heroImageUrl
    ? row.heroImageUrl
    : buildOgImageUrl({
        title: row.title,
        kind: "property",
        locality: row.localityLabel ?? null,
      });
  return {
    title: `${row.title} · Properties`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${row.title} · Properties · mynanganallur.in`,
      description: desc,
      url,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: row.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${row.title} · Properties · mynanganallur.in`,
      images: [ogImage],
      description: desc,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const row = await getPublishedPropertyBySlug(slug);
  if (!row) {
    notFound();
  }

  const propLd = buildPropertyListingJsonLd(row);
  const crumbLd = buildPropertyBreadcrumbJsonLd(row.slug, row.title);
  const facts = propertyFactPills(row);
  const pageUrl = `${getSiteUrl()}/properties/${row.slug}`;
  const faqItems = resolveFaqItems(row.faqJson, buildPropertyAutoFaq(row));
  const waMessage = `Hi, I'm interested in your listing on mynanganallur.in: ${row.title}`;

  const geoAnswer = `${row.title}. ${[row.localityLabel, row.landmarkNote].filter(Boolean).join(" — ")}. ${row.summary ?? "Open the listing for rent or sale terms and contact the advertiser."}`;

  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 pb-24 sm:px-6 sm:py-12 lg:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <ListingBreadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Properties", href: "/properties" },
          { name: row.title, href: `/properties/${row.slug}` },
        ]}
      />

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
        Property listing
        {row.featured ? (
          <span className="ml-2 rounded-full bg-[var(--accent)]/15 px-2 py-0.5 font-bold normal-case tracking-normal text-[var(--accent)]">
            Featured
          </span>
        ) : null}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
        {row.title}
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {[row.localityLabel, row.landmarkNote].filter(Boolean).join(" · ")}
      </p>

      <ListingFactsGrid facts={facts} />

      <ListingGeoBlock
        question={`What is available at ${row.localityLabel ?? "this Nanganallur listing"}?`}
        directAnswer={geoAnswer}
        className="mt-6"
      />

      <ListingContactActions
        phone={row.contactPhone}
        waMessage={waMessage}
        className="mt-6"
      />

      {row.contactEmail ? (
        <p className="mt-3 text-sm text-[var(--muted)]">
          Email:{" "}
          <a
            href={`mailto:${row.contactEmail}`}
            className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            {row.contactEmail}
          </a>
        </p>
      ) : null}

      {row.parkingSummary ? (
        <p className="mt-4 text-sm text-[var(--muted)]">
          <span className="font-medium text-[var(--foreground)]">Parking:</span>{" "}
          {row.parkingSummary}
        </p>
      ) : null}

      <ResponsiveAdSlot
        slotId="properties-detail-top"
        pagePath={`/properties/${slug}`}
        className="mt-8"
      />

      <section className="mt-10" aria-labelledby="prop-body-heading">
        <h2
          id="prop-body-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Details
        </h2>
        <div className="mt-4">
          <ArticleProse content={row.body} />
        </div>
      </section>

      <ShareRow url={pageUrl} title={row.title} channelLabel="property" />

      <HelpfulButtons entityType="property" entityId={row.id} />

      <FaqBlock items={faqItems} pageUrl={pageUrl} />

      <RelatedBlock
        kind="property"
        excludeId={row.id}
        locality={row.localityLabel}
      />

      <PropertyListWhatsAppCta className="mt-10" />

      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-properties"
        className="mt-10"
      />

      <p className="mt-10">
        <Link
          href="/properties"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          ← All properties
        </Link>
      </p>

      <StickyListingActions
        actions={[
          { type: "call", phone: row.contactPhone },
          {
            type: "whatsapp",
            phone: row.contactPhone,
            message: waMessage,
          },
          {
            type: "share",
            url: pageUrl,
            title: row.title,
            channelLabel: "property",
          },
        ]}
      />
    </div>
  );
}

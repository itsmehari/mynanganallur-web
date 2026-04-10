import { propertyListings } from "@/db/schema/tables";
import { getSiteUrl } from "@/lib/env";

function stripMarkdownLite(s: string): string {
  return s
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

type PropertyRow = typeof propertyListings.$inferSelect;

export function buildPropertyListingJsonLd(row: PropertyRow) {
  const base = getSiteUrl();
  const url = `${base}/properties/${row.slug}`;
  const description = stripMarkdownLite(row.body).slice(0, 50000);
  const datePosted = (row.publishedAt ?? row.createdAt).toISOString();

  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: row.title,
    description,
    datePosted,
    url,
  };

  if (row.localityLabel) {
    payload.address = {
      "@type": "PostalAddress",
      addressLocality: row.localityLabel,
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    };
  }

  if (row.kind === "rent" && row.rentPerMonth != null) {
    payload.offers = {
      "@type": "Offer",
      price: row.rentPerMonth,
      priceCurrency: "INR",
      unitText: "MONTH",
      availability: "https://schema.org/InStock",
    };
  } else if (row.kind === "sale" && row.salePrice != null) {
    payload.offers = {
      "@type": "Offer",
      price: row.salePrice,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    };
  }

  return payload;
}

export function buildPropertyBreadcrumbJsonLd(slug: string, title: string) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: base,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properties",
        item: `${base}/properties`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${base}/properties/${slug}`,
      },
    ],
  };
}

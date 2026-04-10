import type { PublicDirectoryRow } from "@/domains/directory";
import { getSiteUrl } from "@/lib/env";

function typeLabel(type: string): string {
  return type.replace(/_/g, " ");
}

export function buildDirectoryEntryJsonLd(
  entry: PublicDirectoryRow,
  typeSlug: string,
) {
  const base = getSiteUrl();
  const url = `${base}/directory/${typeSlug}/${entry.slug}`;

  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: entry.name,
    url,
    description: `${typeLabel(entry.type)} in the Nanganallur area directory on mynanganallur.in.`,
  };

  if (entry.address || entry.localityLabel) {
    const addr: Record<string, unknown> = {
      "@type": "PostalAddress",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    };
    if (entry.address) addr.streetAddress = entry.address;
    if (entry.localityLabel) addr.addressLocality = entry.localityLabel;
    payload.address = addr;
  }
  if (entry.phone) {
    payload.telephone = entry.phone;
  }
  if (entry.websiteUrl) {
    payload.sameAs = entry.websiteUrl;
  }

  return payload;
}

export function buildDirectoryBreadcrumbJsonLd(
  typeSlug: string,
  typeLabelText: string,
  entryName: string,
  entrySlug: string,
) {
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
        name: "Directory",
        item: `${base}/directory`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: typeLabelText,
        item: `${base}/directory#${typeSlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: entryName,
        item: `${base}/directory/${typeSlug}/${entrySlug}`,
      },
    ],
  };
}

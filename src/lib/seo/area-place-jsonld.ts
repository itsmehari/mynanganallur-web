import { getSiteUrl } from "@/lib/env";

/**
 * Lightweight Place schema for area hubs (no street address — neighbourhood-level).
 */
export function buildAreaPlaceJsonLd(input: {
  label: string;
  slug: string;
  description: string;
}) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: input.label,
    description: input.description.slice(0, 5000),
    url: `${base}/areas/${input.slug}`,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Chennai",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Tamil Nadu",
        addressCountry: "IN",
      },
    },
  };
}

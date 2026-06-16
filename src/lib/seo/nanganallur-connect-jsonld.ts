import { getSiteUrl } from "@/lib/env";
import { NANGANALLUR_CONNECT_PATH } from "@/lib/nanganallur-connect-content";

/**
 * WebPage + Place schema for the Nanganallur Connect locality pillar.
 */
export function buildNanganallurConnectJsonLd(description: string) {
  const base = getSiteUrl();
  const url = `${base}${NANGANALLUR_CONNECT_PATH}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: "Nanganallur Connect",
        description: description.slice(0, 5000),
        isPartOf: {
          "@type": "WebSite",
          name: "mynanganallur.in",
          url: base,
        },
        about: { "@id": `${url}#place` },
        inLanguage: "en-IN",
      },
      {
        "@type": "Place",
        "@id": `${url}#place`,
        name: "Nanganallur",
        description: description.slice(0, 5000),
        url,
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Chennai",
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: "Tamil Nadu",
            addressCountry: "IN",
          },
        },
      },
    ],
  };
}

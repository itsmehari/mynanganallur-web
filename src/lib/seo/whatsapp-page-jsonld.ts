import { WHATSAPP_USE_CASES } from "@/lib/community/whatsapp-page-content";
import { WHATSAPP_COMMUNITY_INVITE_URL, WHATSAPP_PAGE_PATH } from "@/lib/community/whatsapp";
import { getSiteUrl } from "@/lib/env";

export function buildWhatsappCommunityPageJsonLd(input: {
  pageTitle: string;
  description: string;
  geoDirectAnswer: string;
}) {
  const base = getSiteUrl();
  const pageUrl = `${base}${WHATSAPP_PAGE_PATH}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: input.pageTitle,
        description: input.description,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${base}/#website` },
        about: {
          "@type": "Organization",
          "@id": `${base}/#org`,
          name: "mynanganallur.in",
          url: base,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${base}/og?title=${encodeURIComponent("Join our WhatsApp community")}&kind=community&locality=${encodeURIComponent("Nanganallur, Chennai")}`,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".whatsapp-geo-direct-answer", ".whatsapp-geo-question"],
        },
        significantLink: WHATSAPP_COMMUNITY_INVITE_URL,
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#use-cases`,
        name: "What you can use the My Nanganallur WhatsApp group for",
        itemListElement: WHATSAPP_USE_CASES.map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: item.title,
          description: item.body,
        })),
      },
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#community-channel`,
        name: "My Nanganallur WhatsApp community group",
        applicationCategory: "SocialNetworkingApplication",
        operatingSystem: "WhatsApp",
        url: WHATSAPP_COMMUNITY_INVITE_URL,
        description: input.geoDirectAnswer,
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Nanganallur, Chennai",
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: "Tamil Nadu",
            addressCountry: "IN",
          },
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          description: "Free neighbourhood WhatsApp community",
        },
      },
    ],
  };
}

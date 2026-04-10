export type FaqItem = { q: string; a: string };

export function buildFaqPageJsonLd(items: FaqItem[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
    url: pageUrl,
  };
}

export function normalizeArticleFaq(
  raw: { items: { q: string; a: string }[] } | null | undefined,
): FaqItem[] {
  if (!raw?.items?.length) return [];
  return raw.items.filter((x) => x.q?.trim() && x.a?.trim());
}

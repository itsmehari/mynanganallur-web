import { getSiteUrl } from "@/lib/env";

type Item = { name: string; href: string };

/**
 * Build an ItemList JSON-LD payload to mark up listing pages
 * (jobs, events, properties, directory, news index).
 */
export function buildItemListJsonLd(opts: {
  name: string;
  items: Item[];
  pageUrl: string;
}) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    url: opts.pageUrl,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.slice(0, 50).map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      url: it.href.startsWith("http") ? it.href : `${base}${it.href}`,
    })),
  };
}

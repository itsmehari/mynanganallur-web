import { getSiteUrl } from "@/lib/env";
import { buildItemListJsonLd } from "@/lib/seo/itemlist-jsonld";

type Item = { name: string; href: string };

export function buildCollectionPageJsonLd(opts: {
  name: string;
  description: string;
  pageUrl: string;
  items: Item[];
}) {
  const base = getSiteUrl();
  const pageUrl = opts.pageUrl.startsWith("http")
    ? opts.pageUrl
    : `${base}${opts.pageUrl}`;
  const itemListId = `${pageUrl}#itemlist`;

  const itemList = buildItemListJsonLd({
    name: opts.name,
    pageUrl,
    items: opts.items,
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: opts.name,
        description: opts.description,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${base}/#website` },
        mainEntity: { "@id": itemListId },
      },
      {
        ...itemList,
        "@id": itemListId,
      },
    ],
  };
}

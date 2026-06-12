import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumb-jsonld";
import { buildCollectionPageJsonLd } from "@/lib/seo/collection-page-jsonld";
import { getSiteUrl } from "@/lib/env";

type Props = {
  hubPath: string;
  hubName: string;
  description: string;
  breadcrumbLabel: string;
  items: { name: string; href: string }[];
};

export function ListingHubSeoScripts({
  hubPath,
  hubName,
  description,
  breadcrumbLabel,
  items,
}: Props) {
  const pageUrl = `${getSiteUrl()}${hubPath}`;
  const collectionLd = buildCollectionPageJsonLd({
    name: hubName,
    description,
    pageUrl,
    items,
  });
  const crumbLd = buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: breadcrumbLabel, href: hubPath },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />
    </>
  );
}

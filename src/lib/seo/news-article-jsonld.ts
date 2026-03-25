import type { PublicArticleRow } from "@/domains/news";
import { getSiteUrl } from "@/lib/env";

function stripMarkdownLite(s: string): string {
  return s
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, 160);
}

export function buildNewsArticleJsonLd(article: PublicArticleRow) {
  const base = getSiteUrl();
  const url = `${base}/local-news/${article.slug}`;
  const desc =
    article.summary ??
    article.dek ??
    stripMarkdownLite(article.reportBody ?? article.body ?? "");
  const image = article.heroImageUrl ?? `${base}/favicon.ico`;
  const published = article.publishedAt?.toISOString() ?? article.createdAt.toISOString();
  const modified = article.updatedAt.toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: desc,
    image,
    datePublished: published,
    dateModified: modified,
    author: {
      "@type": "Organization",
      name: "mynanganallur.in editorial",
      url: base,
    },
    publisher: {
      "@type": "Organization",
      name: "mynanganallur.in",
      url: base,
      logo: {
        "@type": "ImageObject",
        url: `${base}/favicon.ico`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isAccessibleForFree: true,
    url,
  };
}

export function buildBreadcrumbJsonLd(slug: string, title: string) {
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
        name: "Local news",
        item: `${base}/local-news`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${base}/local-news/${slug}`,
      },
    ],
  };
}

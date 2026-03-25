import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialArticle } from "@/components/news/editorial-article";
import {
  getPublishedArticleBySlug,
  getPublishedSlugsForSite,
} from "@/domains/news";
import { getSiteUrl } from "@/lib/env";
import {
  buildBreadcrumbJsonLd,
  buildNewsArticleJsonLd,
} from "@/lib/seo/news-article-jsonld";

type Props = { params: Promise<{ slug: string }> };

function clipMetaDescription(raw: string, max = 155): string {
  const t = raw.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export const revalidate = 120;

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedSlugsForSite();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let article: Awaited<ReturnType<typeof getPublishedArticleBySlug>> = null;
  try {
    article = await getPublishedArticleBySlug(slug);
  } catch {
    return { title: "Story" };
  }
  if (!article) {
    return { title: "Story" };
  }
  const base = getSiteUrl();
  const url = `${base}/local-news/${article.slug}`;
  const desc = clipMetaDescription(
    article.summary ??
      article.dek ??
      article.title,
  );
  const titleSegment = `${article.title} · Local news`;
  return {
    title: titleSegment,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${article.title} · Local news · mynanganallur.in`,
      description: desc,
      url,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      images: article.heroImageUrl ? [{ url: article.heroImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} · Local news · mynanganallur.in`,
      description: desc,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) {
    notFound();
  }
  const newsLd = buildNewsArticleJsonLd(article);
  const crumbLd = buildBreadcrumbJsonLd(article.slug, article.title);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:py-14">
        <EditorialArticle article={article} />
      </div>
    </>
  );
}

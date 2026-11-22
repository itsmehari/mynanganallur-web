import Link from "next/link";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import type { PublicArticleRow } from "@/domains/news";
import { relatedArticlesForSite } from "@/domains/news";
import { categoryToTopicSlug } from "@/lib/news-topics";
import { normalizeArticleFaq } from "@/lib/seo/faq-jsonld";
import { ArticleProse } from "./article-prose";
import { InteractiveBlock } from "./interactive-block";

/** Drop briefing-template H2s so older seeds read as continuous news copy. */
function stripScaffoldHeadings(content: string): string {
  return content
    .replace(/^##\s+What we know\s*\n+/i, "")
    .replace(/^##\s+Why this matters locally\s*\n+/i, "")
    .trim();
}

function hasInteractive(data: Record<string, unknown> | null | undefined) {
  return Boolean(data && typeof data === "object" && "type" in data);
}

export async function EditorialArticle({
  article,
  adSeedPath,
}: {
  article: PublicArticleRow;
  /** Canonical path for deterministic ad rotation, e.g. `/local-news/my-slug` */
  adSeedPath: string;
}) {
  let related: Awaited<ReturnType<typeof relatedArticlesForSite>> = [];
  try {
    related = await relatedArticlesForSite(
      article.slug,
      article.category,
      4,
    );
  } catch {
    related = [];
  }
  const report = stripScaffoldHeadings(article.reportBody ?? article.body);
  const analysis = stripScaffoldHeadings(article.analysisBody ?? "");
  const faqItems = normalizeArticleFaq(article.faqJson);
  const showInteractive = hasInteractive(
    article.interactiveJson as Record<string, unknown> | null | undefined,
  );

  return (
    <article className="mx-auto min-w-0 max-w-[720px]">
      <header className="border-b border-[var(--border)] pb-8">
        {article.category ? (
          <Link
            href={`/local-news/topic/${categoryToTopicSlug(article.category)}`}
            className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)] hover:underline"
          >
            {article.category}
          </Link>
        ) : null}
        <h1 className="mt-2 min-w-0 break-words text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {article.title}
        </h1>
        {article.dek ? (
          <p className="mt-4 min-w-0 break-words text-lg text-[var(--muted)]">
            {article.dek}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
          {article.publishedAt ? (
            <time dateTime={article.publishedAt.toISOString()}>
              {article.publishedAt.toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Asia/Kolkata",
              })}
            </time>
          ) : null}
          {article.sourceName ? (
            <span>
              {article.sourceUrl ? (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  {article.sourceName}
                </a>
              ) : (
                article.sourceName
              )}
            </span>
          ) : null}
        </div>
      </header>

      {article.heroImageUrl ? (
        <figure className="mt-8 overflow-hidden rounded-xl bg-[var(--surface)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- seeded local/public paths */}
          <img
            src={article.heroImageUrl}
            alt=""
            className="h-auto w-full object-cover"
          />
        </figure>
      ) : null}

      <AdSlot
        slotId="article-top"
        size="728x90"
        seed={buildRotationSeed(adSeedPath, "article-top")}
        className="mt-8"
      />

      <div className="mt-10">
        <ArticleProse content={report} />
      </div>

      {analysis ? (
        <div className="mt-6">
          <ArticleProse content={analysis} />
        </div>
      ) : null}

      <AdSlot
        slotId="article-mid"
        size="336x280"
        seed={buildRotationSeed(adSeedPath, "article-mid")}
        className="mt-10"
      />

      {faqItems.length > 0 ? (
        <section
          className="mt-12 border-t border-[var(--border)] pt-10"
          aria-labelledby="faq-heading"
        >
          <h2
            id="faq-heading"
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            FAQs
          </h2>
          <dl className="mt-6 space-y-6">
            {faqItems.map((item, i) => (
              <div key={i}>
                <dt className="min-w-0 break-words text-sm font-semibold text-[var(--foreground)]">
                  {item.q}
                </dt>
                <dd className="mt-2 min-w-0 break-words text-sm leading-relaxed text-[var(--muted)]">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {showInteractive ? (
        <div className="mt-12 border-t border-[var(--border)] pt-10">
          <InteractiveBlock data={article.interactiveJson ?? undefined} />
        </div>
      ) : null}

      {(article.sourceUrl && article.sourceName) || article.sourceName ? (
        <footer className="mt-12 border-t border-[var(--border)] pt-8">
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {article.sourceUrl && article.sourceName ? (
              <>
                Based on reporting from{" "}
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
                >
                  {article.sourceName}
                </a>
                . This page is a local rewrite, not a full copy of the original.
              </>
            ) : (
              <>
                Details and photographs for this report were shared by{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {article.sourceName}
                </span>
                .
              </>
            )}
          </p>
        </footer>
      ) : null}

      <AmazonAffiliateBlock
        variant="compact"
        placement="article-endcap"
        className="mt-10"
      />

      {related.length > 0 ? (
        <nav
          className="mt-12 rounded-2xl bg-[var(--surface)] p-6 ring-1 ring-[var(--border)]"
          aria-label="Related"
        >
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Related nearby
          </h2>
          <ul className="mt-3 space-y-2">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/local-news/${r.slug}`}
                  className="min-w-0 break-words text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <p className="mt-8">
        <Link
          href="/local-news"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          Back to local news
        </Link>
      </p>
    </article>
  );
}

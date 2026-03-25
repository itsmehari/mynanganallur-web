import Link from "next/link";
import type { PublicArticleRow } from "@/domains/news";
import { relatedArticlesForSite } from "@/domains/news";
import { categoryToTopicSlug } from "@/lib/news-topics";
import { ArticleProse } from "./article-prose";
import { InteractiveBlock } from "./interactive-block";

export async function EditorialArticle({
  article,
}: {
  article: PublicArticleRow;
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
  const report = article.reportBody ?? article.body;
  const analysis = article.analysisBody ?? "";

  return (
    <article className="mx-auto max-w-[720px]">
      <header className="border-b border-[var(--border)] pb-8">
        {article.category ? (
          <Link
            href={`/local-news/topic/${categoryToTopicSlug(article.category)}`}
            className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)] hover:underline"
          >
            {article.category}
          </Link>
        ) : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {article.title}
        </h1>
        {article.dek ? (
          <p className="mt-4 text-lg text-[var(--muted)]">{article.dek}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
          {article.publishedAt ? (
            <time dateTime={article.publishedAt.toISOString()}>
              Published{" "}
              {article.publishedAt.toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Asia/Kolkata",
              })}
            </time>
          ) : null}
          <span>
            Updated{" "}
            {article.updatedAt.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Kolkata",
            })}
          </span>
        </div>
      </header>

      <section className="mt-10" aria-labelledby="report-heading">
        <h2
          id="report-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          The news
        </h2>
        <div className="mt-4">
          <ArticleProse content={report} />
        </div>
      </section>

      {analysis ? (
        <section
          className="mt-12 border-t border-[var(--border)] pt-10"
          aria-labelledby="analysis-heading"
        >
          <h2
            id="analysis-heading"
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            Analysis: what this means locally
          </h2>
          <div className="mt-4">
            <ArticleProse content={analysis} />
          </div>
        </section>
      ) : null}

      <section
        className="mt-12 border-t border-[var(--border)] pt-10"
        aria-labelledby="interactive-heading"
      >
        <h2
          id="interactive-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Your move
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          A lightweight interactive tied to this story.
        </p>
        <div className="mt-6">
          <InteractiveBlock data={article.interactiveJson ?? undefined} />
        </div>
      </section>

      <footer className="mt-12 border-t border-[var(--border)] pt-8">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">
          Source and attribution
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          This page is an editorial rephrase and analysis based on publicly
          reported information. It is not a verbatim reproduction of any
          publisher. Read the original for full context.
        </p>
        {article.sourceUrl && article.sourceName ? (
          <p className="mt-3 text-sm">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
            >
              Original reporting: {article.sourceName}
            </a>
          </p>
        ) : null}
      </footer>

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
                  className="text-sm font-medium text-[var(--accent)] hover:underline"
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

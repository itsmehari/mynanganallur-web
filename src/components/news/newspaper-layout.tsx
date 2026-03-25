import Link from "next/link";
import type { ReactNode } from "react";
import type { PublicArticleRow } from "@/domains/news";
import { categoryToTopicSlug } from "@/lib/news-topics";

export function NewspaperMasthead({
  title = "Local news",
  tagline = "Nanganallur & neighbourhood — report, analysis, and what to do next",
}: {
  title?: string;
  tagline?: string;
}) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
  return (
    <header className="border-b-2 border-[var(--foreground)] pb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
            mynanganallur.in
          </p>
          <h1 className="mt-1 font-serif text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">{tagline}</p>
        </div>
        <p className="font-mono text-sm text-[var(--muted)]">{today}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Topics
        </span>
        {["Local", "Mobility", "Consumer"].map(
          (cat) => (
            <Link
              key={cat}
              href={`/local-news/topic/${categoryToTopicSlug(cat)}`}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--foreground)] hover:border-[var(--accent)]"
            >
              {cat}
            </Link>
          ),
        )}
        <Link
          href="/local-news/feed.xml"
          className="ml-auto text-xs font-medium text-[var(--accent)] hover:underline"
        >
          RSS
        </Link>
      </div>
    </header>
  );
}

export function LeadStory({
  article,
}: {
  article: PublicArticleRow;
}) {
  return (
    <article className="group lg:col-span-2">
      <Link href={`/local-news/${article.slug}`} className="block">
        {article.category ? (
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-warm)]">
            {article.category}
          </span>
        ) : null}
        <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-[var(--foreground)] group-hover:underline sm:text-3xl">
          {article.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          {article.dek ?? article.summary ?? ""}
        </p>
        {article.publishedAt ? (
          <time
            className="mt-3 block font-mono text-xs text-[var(--muted)]"
            dateTime={article.publishedAt.toISOString()}
          >
            {article.publishedAt.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeZone: "Asia/Kolkata",
            })}
          </time>
        ) : null}
      </Link>
    </article>
  );
}

export function StoryCardCompact({ article }: { article: PublicArticleRow }) {
  return (
    <article className="group border-b border-[var(--border)] py-4 last:border-0">
      <Link href={`/local-news/${article.slug}`} className="block">
        {article.category ? (
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
            {article.category}
          </span>
        ) : null}
        <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-[var(--foreground)] group-hover:underline">
          {article.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
          {article.dek ?? article.summary ?? ""}
        </p>
      </Link>
    </article>
  );
}

export function NewspaperGrid({
  lead,
  rest,
  sidebar,
}: {
  lead: PublicArticleRow;
  rest: PublicArticleRow[];
  sidebar?: ReactNode;
}) {
  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <LeadStory article={lead} />
        <div className="columns-1 gap-8 sm:columns-2">
          {rest.map((a) => (
            <StoryCardCompact key={a.id} article={a} />
          ))}
        </div>
      </div>
      <aside className="space-y-6 lg:border-l lg:border-[var(--border)] lg:pl-8">
        {sidebar}
      </aside>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryCardCompact } from "@/components/news/newspaper-layout";
import { listArticlesByCategoryForSite } from "@/domains/news";
import { getSiteUrl } from "@/lib/env";
import { topicSlugToCategory } from "@/lib/news-topics";

type Props = { params: Promise<{ topic: string }> };

export const revalidate = 120;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const category = topicSlugToCategory(topic);
  if (!category) {
    return { title: "Topic" };
  }
  const base = getSiteUrl();
  const url = `${base}/local-news/topic/${topic}`;
  return {
    title: `${category} — Local news`,
    description: `Latest ${category} coverage and analysis for Nanganallur from mynanganallur.in.`,
    alternates: { canonical: url },
  };
}

export default async function TopicPage({ params }: Props) {
  const { topic } = await params;
  const category = topicSlugToCategory(topic);
  if (!category) {
    notFound();
  }
  let items: Awaited<ReturnType<typeof listArticlesByCategoryForSite>> = [];
  try {
    items = await listArticlesByCategoryForSite(category, 40);
  } catch {
    items = [];
  }
  if (!items.length) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-14">
        <h1 className="font-serif text-3xl font-bold text-[var(--foreground)]">
          {category}
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          No published stories in this desk yet.
        </p>
        <Link href="/local-news" className="mt-6 text-[var(--accent)]">
          Back to front page
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:py-14">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
        Topic
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold text-[var(--foreground)]">
        {category}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
        Reverse-chronological feed for this desk. Each story includes a factual
        summary, local analysis, and a small interactive.
      </p>
      <div className="mt-10 max-w-2xl">
        {items.map((a) => (
          <StoryCardCompact key={a.id} article={a} />
        ))}
      </div>
      <Link
        href="/local-news"
        className="mt-10 inline-block text-sm font-semibold text-[var(--accent)]"
      >
        Back to front page
      </Link>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { ArticleProse } from "@/components/news/article-prose";
import {
  getOpenJobBySlug,
  getOpenJobSlugsForSite,
} from "@/domains/jobs";
import { getSiteUrl } from "@/lib/env";
import {
  buildJobBreadcrumbJsonLd,
  buildJobPostingJsonLd,
} from "@/lib/seo/job-posting-jsonld";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 120;

function clipMetaDescription(raw: string, max = 155): string {
  const t = raw.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function stripMarkdownLite(s: string): string {
  return s
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

export async function generateStaticParams() {
  try {
    const slugs = await getOpenJobSlugsForSite();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let row: Awaited<ReturnType<typeof getOpenJobBySlug>> = null;
  try {
    row = await getOpenJobBySlug(slug);
  } catch {
    return { title: "Job" };
  }
  if (!row) {
    return { title: "Job" };
  }
  const base = getSiteUrl();
  const url = `${base}/jobs/${row.job.slug}`;
  const desc = clipMetaDescription(
    stripMarkdownLite(row.job.body).slice(0, 400) ||
      `${row.job.title} at ${row.employer.name}`,
  );
  return {
    title: `${row.job.title} · Jobs`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${row.job.title} · Jobs · mynanganallur.in`,
      description: desc,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${row.job.title} · Jobs · mynanganallur.in`,
      description: desc,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const row = await getOpenJobBySlug(slug);
  if (!row) {
    notFound();
  }
  const { job, employer } = row;

  const jobLd = buildJobPostingJsonLd(row);
  const crumbLd = buildJobBreadcrumbJsonLd(job.slug, job.title);

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
        Job listing
        {job.featured ? (
          <span className="ml-2 rounded-full bg-[var(--accent)]/15 px-2 py-0.5 font-bold normal-case tracking-normal text-[var(--accent)]">
            Featured
          </span>
        ) : null}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {job.title}
      </h1>
      <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
        {employer.name}
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {job.locationLabel ?? "Location on request"}
        {job.remotePolicy !== "onsite" ? ` · ${job.remotePolicy}` : ""}
      </p>
      {employer.websiteUrl ? (
        <p className="mt-3 text-sm">
          <a
            href={employer.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Employer website ↗
          </a>
        </p>
      ) : null}

      <AdSlot
        slotId="jobs-detail-top"
        size="728x90"
        seed={buildRotationSeed(`/jobs/${slug}`, "jobs-detail-top")}
        className="mt-8 max-w-full"
      />

      <section className="mt-10" aria-labelledby="jd-heading">
        <h2
          id="jd-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Role description
        </h2>
        <div className="mt-4">
          <ArticleProse content={job.body} />
        </div>
      </section>

      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-jobs"
        className="mt-10"
      />

      <p className="mt-10">
        <Link
          href="/jobs"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          ← All jobs
        </Link>
      </p>
    </div>
  );
}

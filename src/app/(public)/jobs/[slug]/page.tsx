import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { RelatedBlock } from "@/components/internal-linking/related-block";
import { ArticleProse } from "@/components/news/article-prose";
import { ShareRow } from "@/components/share/share-row";
import { HelpfulButtons } from "@/components/reactions/helpful";
import {
  getOpenJobBySlug,
  getOpenJobSlugsForSite,
} from "@/domains/jobs";
import { getSiteUrl } from "@/lib/env";
import { buildOgImageUrl } from "@/lib/seo/og";
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

function formatPublishedDate(d: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function salaryLine(job: {
  salaryDisclosed: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
}): string | null {
  if (!job.salaryDisclosed) return "Salary not disclosed";
  if (job.salaryMin != null && job.salaryMax != null) {
    return `₹${job.salaryMin.toLocaleString("en-IN")} - ₹${job.salaryMax.toLocaleString("en-IN")}`;
  }
  if (job.salaryMin != null) {
    return `From ₹${job.salaryMin.toLocaleString("en-IN")}`;
  }
  return "Salary on request";
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
  const ogImage = buildOgImageUrl({
    title: row.job.title,
    kind: "job",
    locality: row.job.locationLabel ?? null,
  });
  return {
    title: `${row.job.title} · Jobs`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${row.job.title} · Jobs · mynanganallur.in`,
      description: desc,
      url,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: row.job.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${row.job.title} · Jobs · mynanganallur.in`,
      description: desc,
      images: [ogImage],
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
  const salary = salaryLine(job);
  const waLink = job.contactPhone?.trim()
    ? `/jobs/${job.slug}/apply-whatsapp`
    : null;

  const jobLd = buildJobPostingJsonLd(row);
  const crumbLd = buildJobBreadcrumbJsonLd(job.slug, job.title);

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
              Job listing
              {job.featured ? (
                <span className="ml-2 rounded-full bg-[var(--accent)]/15 px-2 py-0.5 font-bold normal-case tracking-normal text-[var(--accent)]">
                  Featured
                </span>
              ) : null}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              {job.title}
            </h1>
            <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
              {employer.name}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {job.locationLabel ?? "Location on request"}
              {job.remotePolicy !== "onsite" ? ` · ${job.remotePolicy}` : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {salary ? (
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 font-semibold text-[var(--accent)]">
                  {salary}
                </span>
              ) : null}
              <span className="rounded-full border border-[var(--border)] px-3 py-1 font-medium text-[var(--muted)]">
                Posted {formatPublishedDate(job.createdAt)}
              </span>
            </div>
            {employer.websiteUrl ? (
              <p className="mt-4 text-sm">
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
          </div>

          <AdSlot
            slotId="jobs-posting-468"
            size="468x60"
            seed={buildRotationSeed(`/jobs/${slug}`, "jobs-posting-468")}
            className="mt-6 flex w-full justify-center max-w-full"
          />

          <AdSlot
            slotId="jobs-detail-top"
            size="728x90"
            seed={buildRotationSeed(`/jobs/${slug}`, "jobs-detail-top")}
            className="mt-6 max-w-full"
          />

          <section
            className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-7"
            aria-labelledby="jd-heading"
          >
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

          <ShareRow
            url={`${getSiteUrl()}/jobs/${job.slug}`}
            title={`${job.title} — ${row.employer.name}`}
            channelLabel="job"
          />

          <HelpfulButtons entityType="job" entityId={job.id} />

          <FaqBlock
            items={job.faqJson?.items ?? null}
            pageUrl={`${getSiteUrl()}/jobs/${job.slug}`}
          />

          <RelatedBlock
            kind="job"
            excludeId={job.id}
            locality={job.locationLabel}
            employerId={row.employer.id}
          />

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
        </main>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Quick job facts
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
                  Salary
                </dt>
                <dd className="mt-0.5 font-medium text-[var(--foreground)]">
                  {salary ?? "Salary on request"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
                  Location
                </dt>
                <dd className="mt-0.5 text-[var(--foreground)]">
                  {job.locationLabel ?? "Location on request"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
                  Work mode
                </dt>
                <dd className="mt-0.5 text-[var(--foreground)]">
                  {job.remotePolicy}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
                  Posted
                </dt>
                <dd className="mt-0.5 text-[var(--foreground)]">
                  {formatPublishedDate(job.createdAt)}
                </dd>
              </div>
            </dl>

            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Apply via WhatsApp
              </a>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

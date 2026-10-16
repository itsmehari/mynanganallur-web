import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { RelatedBlock } from "@/components/internal-linking/related-block";
import { JobAtAGlance } from "@/components/listings/job-at-a-glance";
import { JobLanguageSwitch } from "@/components/listings/job-language-switch";
import { ListingBreadcrumb } from "@/components/listings/listing-breadcrumb";
import { ListingGeoBlock } from "@/components/listings/listing-geo-block";
import { ResponsiveAdSlot } from "@/components/listings/responsive-ad-slot";
import { StickyListingActions } from "@/components/listings/sticky-listing-actions";
import { UniquePageViews } from "@/components/listings/unique-page-views";
import { ArticleProse } from "@/components/news/article-prose";
import { ShareRow } from "@/components/share/share-row";
import { HelpfulButtons } from "@/components/reactions/helpful";
import {
  getOpenJobBySlug,
  getOpenJobSlugsForSite,
} from "@/domains/jobs";
import {
  buildJobAutoFaq,
  resolveFaqItems,
} from "@/lib/listings/faq-generators";
import { formatPublishedDate, jobSalaryLine } from "@/lib/listings/format";
import { getSiteUrl } from "@/lib/env";
import { scrubPublicJobBody } from "@/lib/jobs/scrub-public-job-body";
import { jobSlugPathSegment } from "@/lib/jobs/slug-normalize";
import { buildOgImageUrl } from "@/lib/seo/og";
import {
  buildJobBreadcrumbJsonLd,
  buildJobPostingJsonLd,
} from "@/lib/seo/job-posting-jsonld";

type Props = { params: Promise<{ slug: string }> };

/** Avoid sticky 404 shells for newly seeded / Unicode slugs (ISR). */
export const dynamic = "force-dynamic";

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

function jobPublicPath(slug: string): string {
  return `/jobs/${jobSlugPathSegment(slug)}`;
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
  const url = `${base}${jobPublicPath(row.job.slug)}`;
  const desc = clipMetaDescription(
    stripMarkdownLite(scrubPublicJobBody(row.job.body)).slice(0, 400) ||
      `${row.job.title} at ${row.employer.name}`,
  );
  const ogImage = buildOgImageUrl({
    title: row.job.title,
    kind: "job",
    locality: row.job.locationLabel ?? null,
  });

  const languages: Record<string, string> = {};
  if (row.job.alternateSlug) {
    const isTa = (row.job.locale || "en-IN").toLowerCase().startsWith("ta");
    const enUrl = isTa
      ? `${base}${jobPublicPath(row.job.alternateSlug)}`
      : url;
    const taUrl = isTa
      ? url
      : `${base}${jobPublicPath(row.job.alternateSlug)}`;
    languages.en = enUrl;
    languages.ta = taUrl;
    languages["x-default"] = enUrl;
  }

  return {
    title: `${row.job.title} · Jobs`,
    description: desc,
    alternates: {
      canonical: url,
      ...(Object.keys(languages).length > 0 ? { languages } : {}),
    },
    openGraph: {
      title: `${row.job.title} · Jobs · mynanganallur.in`,
      description: desc,
      url,
      type: "website",
      locale: (row.job.locale || "en-IN").replace("-", "_"),
      images: [{ url: ogImage, width: 1200, height: 630, alt: row.job.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${row.job.title} · Jobs · mynanganallur.in`,
      images: [ogImage],
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
  const salary = jobSalaryLine(job);
  const path = jobPublicPath(job.slug);
  const waLink = job.contactPhone?.trim()
    ? `/jobs/${jobSlugPathSegment(job.slug)}/apply-whatsapp`
    : null;
  const isTa = (job.locale || "en-IN").toLowerCase().startsWith("ta");

  const jobLd = buildJobPostingJsonLd(row);
  const crumbLd = buildJobBreadcrumbJsonLd(job.slug, job.title);
  const pageUrl = `${getSiteUrl()}${path}`;
  const faqItems = resolveFaqItems(job.faqJson, buildJobAutoFaq(row));

  const glanceFacts = [
    { label: isTa ? "சம்பளம்" : "Salary", value: salary ?? (isTa ? "கேட்டுத் தெரிந்துகொள்ளுங்கள்" : "Salary on request") },
    {
      label: isTa ? "இடம்" : "Location",
      value: job.locationLabel ?? (isTa ? "கேட்டுத் தெரிந்துகொள்ளுங்கள்" : "Location on request"),
    },
    { label: isTa ? "பணி முறை" : "Work mode", value: job.remotePolicy },
    {
      label: isTa ? "வெளியிடப்பட்டது" : "Posted",
      value: formatPublishedDate(job.publishedAt ?? job.createdAt),
    },
    ...(job.openingsCount > 1
      ? [
          {
            label: isTa ? "காலியிடங்கள்" : "Vacancies",
            value: String(job.openingsCount),
          },
        ]
      : []),
    ...(job.jobBenefits
      ? [
          {
            label: isTa ? "வசதிகள்" : "Benefits",
            value: job.jobBenefits,
          },
        ]
      : []),
  ];

  const stickyActions = waLink
    ? [
        {
          type: "link" as const,
          href: waLink,
          label: isTa ? "WhatsApp மூலம் விண்ணப்பிக்க" : "Apply via WhatsApp",
          external: true,
          variant: "primary" as const,
        },
        {
          type: "share" as const,
          url: pageUrl,
          title: `${job.title} — ${employer.name}`,
          channelLabel: "job",
        },
      ]
    : [
        {
          type: "share" as const,
          url: pageUrl,
          title: `${job.title} — ${employer.name}`,
          channelLabel: "job",
        },
      ];

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10 pb-24 sm:px-6 lg:py-14 lg:pb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <ListingBreadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Jobs", href: "/jobs" },
          { name: job.title, href: path },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
              {isTa ? "வேலை அறிவிப்பு" : "Job listing"}
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
            <JobLanguageSwitch
              locale={job.locale || "en-IN"}
              currentSlug={job.slug}
              alternateSlug={job.alternateSlug}
              className="mt-4"
            />
            <UniquePageViews
              entityType="job"
              entityId={job.id}
              locale={job.locale || "en-IN"}
              className="mt-3"
            />
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {salary ? (
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 font-semibold text-[var(--accent)]">
                  {salary}
                </span>
              ) : null}
              <span className="rounded-full border border-[var(--border)] px-3 py-1 font-medium text-[var(--muted)]">
                {isTa ? "வெளியிடப்பட்டது" : "Posted"}{" "}
                {formatPublishedDate(job.publishedAt ?? job.createdAt)}
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

          <ListingGeoBlock
            question={
              isTa
                ? `${job.title} — எப்படி விண்ணப்பிப்பது?`
                : `How do I apply for ${job.title} in Madipakkam?`
            }
            directAnswer={
              isTa
                ? `${job.title} — ${employer.name}, ${job.locationLabel ?? "மடிப்பாக்கம்"}. ${waLink ? "இந்தப் பக்கத்தில் WhatsApp மூலம் விண்ணப்பிக்க அழுத்தவும்." : "விளக்கத்தில் உள்ள வழிமுறையைப் பின்பற்றவும்."} ஆவணங்களை அனுப்பும் முன் ஊதியம் மற்றும் நிபந்தனைகளை உறுதிப்படுத்திக் கொள்ளுங்கள்.`
                : `${job.title} at ${employer.name}, ${job.locationLabel ?? "Madipakkam area"}. ${waLink ? "Tap Apply via WhatsApp on this page to open a pre-filled message." : "Follow the application instructions in the role description."} Verify salary and requirements with the employer before you share documents.`
            }
            className="mt-6"
          />

          <JobAtAGlance facts={glanceFacts} />

          <ResponsiveAdSlot
            slotId="jobs-detail-top"
            pagePath={path}
            desktopSize="728x90"
            mobileSize="320x50"
            className="mt-6"
          />

          <section
            className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7"
            aria-labelledby="jd-heading"
          >
            <h2
              id="jd-heading"
              className="text-lg font-semibold text-[var(--foreground)]"
            >
              {isTa ? "பணி விவரம்" : "Role description"}
            </h2>
            <div className="mt-4">
              <ArticleProse content={scrubPublicJobBody(job.body)} />
            </div>
          </section>

          <ShareRow
            url={pageUrl}
            title={`${job.title} — ${employer.name}`}
            channelLabel="job"
          />

          <HelpfulButtons entityType="job" entityId={job.id} />

          <FaqBlock
            items={faqItems}
            pageUrl={pageUrl}
            heading={isTa ? "அடிக்கடி கேட்கப்படும் கேள்விகள்" : "Frequently asked"}
          />

          <RelatedBlock
            kind="job"
            excludeId={job.id}
            locality={job.locationLabel}
            employerId={employer.id}
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
              {isTa ? "← அனைத்து வேலைகளும்" : "← All jobs"}
            </Link>
          </p>
        </main>

        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              {isTa ? "சுருக்கமான விவரங்கள்" : "Quick job facts"}
            </h2>
            <dl className="job-at-a-glance mt-4 space-y-3 text-sm">
              {glanceFacts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
                    {f.label}
                  </dt>
                  <dd className="mt-0.5 font-medium text-[var(--foreground)]">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {isTa ? "WhatsApp மூலம் விண்ணப்பிக்க" : "Apply via WhatsApp"}
              </a>
            ) : null}
          </div>
        </aside>
      </div>

      <StickyListingActions actions={stickyActions} />
    </div>
  );
}

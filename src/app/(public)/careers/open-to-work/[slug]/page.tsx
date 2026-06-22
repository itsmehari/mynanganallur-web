import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { ListingBreadcrumb } from "@/components/listings/listing-breadcrumb";
import { ListingGeoBlock } from "@/components/listings/listing-geo-block";
import { JobAtAGlance } from "@/components/listings/job-at-a-glance";
import { ShareRow } from "@/components/share/share-row";
import { ArticleProse } from "@/components/news/article-prose";
import {
  getOpenProfileBySlug,
  getOpenProfileSlugsForSite,
  type OpenToWorkProfile,
} from "@/domains/open-to-work";
import { formatPublishedDate } from "@/lib/listings/format";
import { getSiteUrl } from "@/lib/env";
import { buildOgImageUrl } from "@/lib/seo/og";

type Props = { params: Promise<{ slug: string }> };

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

function workModeLabel(raw: string): string {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => {
      if (p === "onsite") return "On-site";
      if (p === "hybrid") return "Hybrid";
      if (p === "remote") return "Remote";
      return p;
    })
    .join(", ");
}

function profileFacts(profile: OpenToWorkProfile) {
  return [
    {
      label: "Domains",
      value: profile.domainsLabel ?? "Not specified",
    },
    {
      label: "Preferred locations",
      value: profile.preferredLocations ?? "Flexible",
    },
    {
      label: "Work mode",
      value: workModeLabel(profile.workModePreferences),
    },
    {
      label: "Experience",
      value:
        profile.yearsExperience != null
          ? `${profile.yearsExperience}+ years`
          : "See profile",
    },
    {
      label: "Listed",
      value: formatPublishedDate(profile.publishedAt ?? profile.createdAt),
    },
  ];
}

export async function generateStaticParams() {
  try {
    const slugs = await getOpenProfileSlugsForSite();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let profile: OpenToWorkProfile | null = null;
  try {
    profile = await getOpenProfileBySlug(slug);
  } catch {
    return { title: "Open to Work" };
  }
  if (!profile) {
    return { title: "Open to Work" };
  }
  const base = getSiteUrl();
  const url = `${base}/careers/open-to-work/${profile.slug}`;
  const desc = clipMetaDescription(
    stripMarkdownLite(profile.body).slice(0, 400) || profile.headline,
  );
  const ogImage = buildOgImageUrl({
    title: `${profile.displayName} — Open to Work`,
    kind: "job",
    locality: profile.preferredLocations ?? null,
  });
  return {
    title: `${profile.displayName} · ${profile.headline}`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${profile.displayName} · Open to Work · mynanganallur.in`,
      description: desc,
      url,
      type: "profile",
      images: [{ url: ogImage, width: 1200, height: 630, alt: profile.displayName }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.displayName} · Open to Work`,
      images: [ogImage],
      description: desc,
    },
  };
}

function ContactBlock({ profile }: { profile: OpenToWorkProfile }) {
  const hasContact =
    profile.contactEmail ||
    profile.contactPhone ||
    profile.linkedInUrl ||
    profile.facebookUrl ||
    profile.sourcePostUrl ||
    profile.resumeUrl;

  if (!hasContact) {
    return (
      <p className="text-sm text-[var(--muted)]">
        Contact details are not public on this profile. Share this page with your
        network — referrers can reach out through mutual connections.
      </p>
    );
  }

  return (
    <ul className="space-y-2 text-sm">
      {profile.contactEmail ? (
        <li>
          <a
            href={`mailto:${profile.contactEmail}`}
            className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Email {profile.displayName}
          </a>
        </li>
      ) : null}
      {profile.contactPhone ? (
        <li>
          <a
            href={`tel:${profile.contactPhone.replace(/\s/g, "")}`}
            className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Call / WhatsApp
          </a>
        </li>
      ) : null}
      {profile.linkedInUrl ? (
        <li>
          <a
            href={profile.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            LinkedIn profile ↗
          </a>
        </li>
      ) : null}
      {profile.facebookUrl ? (
        <li>
          <a
            href={profile.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Contact on Facebook ↗
          </a>
        </li>
      ) : null}
      {profile.sourcePostUrl ? (
        <li>
          <a
            href={profile.sourcePostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Original Facebook post ↗
          </a>
        </li>
      ) : null}
      {profile.resumeUrl ? (
        <li>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            View resume ↗
          </a>
        </li>
      ) : null}
    </ul>
  );
}

export default async function OpenToWorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const profile = await getOpenProfileBySlug(slug);
  if (!profile) {
    notFound();
  }

  const pageUrl = `${getSiteUrl()}/careers/open-to-work/${profile.slug}`;
  const facts = profileFacts(profile);
  const faqItems = [
    {
      q: `Is ${profile.displayName} looking for employer vacancies on mynanganallur.in?`,
      a: `${profile.displayName} listed an Open to Work profile seeking referrals and suitable roles${profile.preferredLocations ? ` in ${profile.preferredLocations}` : ""}. This is not an employer job posting — browse /jobs for open vacancies.`,
    },
    {
      q: "How can I refer someone for this profile?",
      a: "Share this page with hiring managers or HR contacts in your network. Use the contact options on this profile when available, or connect through LinkedIn.",
    },
  ];

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10 pb-24 sm:px-6 lg:py-14 lg:pb-14">
      <ListingBreadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Open to Work", href: "/careers/open-to-work" },
          {
            name: profile.displayName,
            href: `/careers/open-to-work/${profile.slug}`,
          },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Open to Work
              {profile.featured ? (
                <span className="ml-2 rounded-full bg-[var(--accent)]/15 px-2 py-0.5 font-bold normal-case tracking-normal text-[var(--accent)]">
                  Featured
                </span>
              ) : null}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              {profile.displayName}
            </h1>
            <p className="mt-2 text-base font-medium text-[var(--foreground)]">
              {profile.headline}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {[profile.domainsLabel, profile.preferredLocations]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          <ListingGeoBlock
            question={`Who is ${profile.displayName} and what roles are they seeking?`}
            directAnswer={`${profile.displayName} — ${profile.headline}. Preferred locations: ${profile.preferredLocations ?? "flexible"}. Work mode: ${workModeLabel(profile.workModePreferences)}. Referrals welcome.`}
            className="mt-6"
          />

          <JobAtAGlance facts={facts} />

          <section
            className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7"
            aria-labelledby="profile-heading"
          >
            <h2
              id="profile-heading"
              className="text-lg font-semibold text-[var(--foreground)]"
            >
              Profile
            </h2>
            <div className="mt-4">
              <ArticleProse content={profile.body} />
            </div>
          </section>

          <section
            className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7"
            aria-labelledby="contact-heading"
          >
            <h2
              id="contact-heading"
              className="text-lg font-semibold text-[var(--foreground)]"
            >
              Connect
            </h2>
            <div className="mt-3">
              <ContactBlock profile={profile} />
            </div>
          </section>

          <ShareRow
            url={pageUrl}
            title={`${profile.displayName} — ${profile.headline}`}
            channelLabel="profile"
          />

          <FaqBlock items={faqItems} pageUrl={pageUrl} />

          <AmazonAffiliateBlock
            variant="compact"
            placement="hub-jobs"
            className="mt-10"
          />

          <p className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/careers/open-to-work"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              ← All Open to Work profiles
            </Link>
            <Link
              href="/jobs"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Browse open roles
            </Link>
          </p>
        </main>

        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              At a glance
            </h2>
            <dl className="job-at-a-glance mt-4 space-y-3 text-sm">
              {facts.map((f) => (
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
            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <ContactBlock profile={profile} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

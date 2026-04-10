import type { JobWithEmployer } from "@/domains/jobs";
import { getSiteUrl } from "@/lib/env";

function stripMarkdownLite(s: string): string {
  return s
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

/**
 * JobPosting JSON-LD when required Google fields exist.
 */
export function buildJobPostingJsonLd(row: JobWithEmployer) {
  const base = getSiteUrl();
  const { job, employer } = row;
  const url = `${base}/jobs/${job.slug}`;
  const description = stripMarkdownLite(job.body).slice(0, 50000);
  const datePosted = job.createdAt.toISOString();

  const hiringOrganization: Record<string, unknown> = {
    "@type": "Organization",
    name: employer.name,
  };
  if (employer.websiteUrl) {
    hiringOrganization.sameAs = employer.websiteUrl;
    hiringOrganization.url = employer.websiteUrl;
  }

  const remotePolicy = job.remotePolicy.toLowerCase();
  const isRemote =
    remotePolicy === "remote" || remotePolicy.includes("remote");

  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted,
    hiringOrganization,
    employmentType: "FULL_TIME",
    url,
    identifier: {
      "@type": "PropertyValue",
      name: "mynanganallur.in job slug",
      value: job.slug,
    },
  };

  if (isRemote) {
    payload.jobLocationType = "TELECOMMUTE";
    payload.applicantLocationRequirements = {
      "@type": "Country",
      name: "India",
    };
  } else {
    const locality = job.locationLabel ?? "Chennai area, Tamil Nadu";
    payload.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: locality,
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    };
  }

  return payload;
}

export function buildJobBreadcrumbJsonLd(slug: string, title: string) {
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
        name: "Jobs",
        item: `${base}/jobs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${base}/jobs/${slug}`,
      },
    ],
  };
}

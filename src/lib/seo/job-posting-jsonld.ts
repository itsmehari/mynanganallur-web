import type { JobWithEmployer } from "@/domains/jobs";
import { getSiteUrl } from "@/lib/env";
import { scrubPublicJobBody } from "@/lib/jobs/scrub-public-job-body";
import { jobSlugPathSegment } from "@/lib/jobs/slug-normalize";

function stripMarkdownLite(s: string): string {
  return s
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

function extractAddressLocality(locationLabel: string | null): string {
  const raw = (locationLabel ?? "").trim();
  if (!raw) return "Chennai";
  const first = raw.split(",")[0]?.trim();
  return first || "Chennai";
}

/**
 * JobPosting JSON-LD when required Google fields exist.
 */
export function buildJobPostingJsonLd(row: JobWithEmployer) {
  const base = getSiteUrl();
  const { job, employer } = row;
  const url = `${base}/jobs/${jobSlugPathSegment(job.slug)}`;
  const description = stripMarkdownLite(scrubPublicJobBody(job.body)).slice(
    0,
    50000,
  );
  const datePosted = (job.publishedAt ?? job.createdAt).toISOString();
  const locale = job.locale || "en-IN";

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
    remotePolicy === "remote" ||
    remotePolicy.includes("remote") ||
    remotePolicy.includes("online");

  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted,
    hiringOrganization,
    employmentType: "FULL_TIME",
    url,
    inLanguage: locale,
    directApply: false,
    identifier: {
      "@type": "PropertyValue",
      name: "mynanganallur.in job slug",
      value: job.slug,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".listing-geo-direct-answer", ".job-at-a-glance"],
    },
  };

  if (job.applyBy) {
    payload.validThrough = job.applyBy.toISOString();
  }

  if (job.openingsCount && job.openingsCount > 0) {
    payload.totalJobOpenings = job.openingsCount;
  }

  if (job.jobBenefits?.trim()) {
    payload.jobBenefits = job.jobBenefits.trim();
  }

  if (
    job.salaryDisclosed &&
    typeof job.salaryMin === "number" &&
    typeof job.salaryMax === "number"
  ) {
    payload.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: "MONTH",
      },
    };
  }

  const phoneDigits = job.contactPhone?.replace(/\D/g, "") ?? "";
  if (phoneDigits.length >= 10) {
    const e164 = phoneDigits.startsWith("91")
      ? phoneDigits
      : `91${phoneDigits.slice(-10)}`;
    payload.applicationContact = {
      "@type": "ContactPoint",
      contactType: "hiring",
      telephone: `+${e164}`,
      url: `https://wa.me/${e164}`,
    };
  }

  if (isRemote) {
    payload.jobLocationType = "TELECOMMUTE";
    payload.applicantLocationRequirements = {
      "@type": "Country",
      name: "India",
    };
  } else {
    payload.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: extractAddressLocality(job.locationLabel),
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    };
  }

  return payload;
}

export function buildJobBreadcrumbJsonLd(slug: string, title: string) {
  const base = getSiteUrl();
  const pathSlug = jobSlugPathSegment(slug);
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
        item: `${base}/jobs/${pathSlug}`,
      },
    ],
  };
}

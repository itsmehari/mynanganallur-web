import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { ArticleProse } from "@/components/news/article-prose";
import {
  getPublishedPropertyBySlug,
  getPublishedPropertySlugsForSite,
} from "@/domains/properties";
import { getSiteUrl } from "@/lib/env";
import {
  buildPropertyBreadcrumbJsonLd,
  buildPropertyListingJsonLd,
} from "@/lib/seo/property-listing-jsonld";

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

function contactTelHref(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `tel:+91${d}`;
  return `tel:+${d}`;
}

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedPropertySlugsForSite();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let row: Awaited<ReturnType<typeof getPublishedPropertyBySlug>> = null;
  try {
    row = await getPublishedPropertyBySlug(slug);
  } catch {
    return { title: "Property" };
  }
  if (!row) {
    return { title: "Property" };
  }
  const base = getSiteUrl();
  const url = `${base}/properties/${row.slug}`;
  const desc = clipMetaDescription(
    row.summary ||
      stripMarkdownLite(row.body).slice(0, 400) ||
      row.title,
  );
  return {
    title: `${row.title} · Properties`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${row.title} · Properties · mynanganallur.in`,
      description: desc,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${row.title} · Properties · mynanganallur.in`,
      description: desc,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const row = await getPublishedPropertyBySlug(slug);
  if (!row) {
    notFound();
  }

  const propLd = buildPropertyListingJsonLd(row);
  const crumbLd = buildPropertyBreadcrumbJsonLd(row.slug, row.title);

  const facts: string[] = [];
  if (row.kind === "rent" && row.rentPerMonth != null) {
    facts.push(`Rent: Rs. ${row.rentPerMonth.toLocaleString("en-IN")}/month`);
  }
  if (row.kind === "sale" && row.salePrice != null) {
    facts.push(`Ask: Rs. ${row.salePrice.toLocaleString("en-IN")}`);
  }
  if (row.advanceMonths != null) {
    facts.push(`Advance: ${row.advanceMonths} month(s)`);
  }
  if (row.bedrooms != null) {
    facts.push(`${row.bedrooms} BHK`);
  }
  if (row.areaSqft != null) {
    facts.push(`~${row.areaSqft} sq ft`);
  }
  if (row.floorLabel) {
    facts.push(row.floorLabel);
  }
  if (row.facing) {
    facts.push(`${row.facing} facing`);
  }
  if (row.furnishing !== "unspecified") {
    facts.push(
      row.furnishing === "fully_furnished"
        ? "Fully furnished"
        : row.furnishing === "semi_furnished"
          ? "Semi-furnished"
          : "Unfurnished",
    );
  }
  if (row.vegetarianHouseholdOnly) {
    facts.push("Vegetarian household preference");
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
        Property listing
        {row.featured ? (
          <span className="ml-2 rounded-full bg-[var(--accent)]/15 px-2 py-0.5 font-bold normal-case tracking-normal text-[var(--accent)]">
            Featured
          </span>
        ) : null}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {row.title}
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {[row.localityLabel, row.landmarkNote].filter(Boolean).join(" · ")}
      </p>

      {facts.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {facts.map((f) => (
            <li
              key={f}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--foreground)]"
            >
              {f}
            </li>
          ))}
        </ul>
      ) : null}

      {row.parkingSummary ? (
        <p className="mt-4 text-sm text-[var(--muted)]">
          <span className="font-medium text-[var(--foreground)]">Parking:</span>{" "}
          {row.parkingSummary}
        </p>
      ) : null}

      <p className="mt-6 text-sm font-medium text-[var(--foreground)]">Contact</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        <a
          href={contactTelHref(row.contactPhone)}
          className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
        >
          {row.contactPhone}
        </a>
        {row.contactEmail ? (
          <>
            {" · "}
            <a
              href={`mailto:${row.contactEmail}`}
              className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
            >
              {row.contactEmail}
            </a>
          </>
        ) : null}
      </p>

      <AdSlot
        slotId="properties-detail-top"
        size="728x90"
        seed={buildRotationSeed(`/properties/${slug}`, "properties-detail-top")}
        className="mt-8 max-w-full"
      />

      <section className="mt-10" aria-labelledby="prop-body-heading">
        <h2
          id="prop-body-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Details
        </h2>
        <div className="mt-4">
          <ArticleProse content={row.body} />
        </div>
      </section>

      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-properties"
        className="mt-10"
      />

      <p className="mt-10">
        <Link
          href="/properties"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          ← All properties
        </Link>
      </p>
    </div>
  );
}

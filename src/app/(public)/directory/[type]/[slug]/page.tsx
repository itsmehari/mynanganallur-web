import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { ListingBreadcrumb } from "@/components/listings/listing-breadcrumb";
import { ListingContactActions } from "@/components/listings/listing-contact-actions";
import { ListingGeoBlock } from "@/components/listings/listing-geo-block";
import { ListingHubSubmitCta } from "@/components/listings/listing-hub-submit-cta";
import { ResponsiveAdSlot } from "@/components/listings/responsive-ad-slot";
import { StickyListingActions } from "@/components/listings/sticky-listing-actions";
import { ShareRow } from "@/components/share/share-row";
import { HelpfulButtons } from "@/components/reactions/helpful";
import {
  getDirectoryEntryByTypeSlug,
  resolveDirectoryTypeSlug,
  listDirectoryParamsForStatic,
} from "@/domains/directory";
import { ArticleProse } from "@/components/news/article-prose";
import { parseDirectoryMetadata } from "@/lib/directory/metadata";
import {
  buildDirectoryAutoFaq,
  resolveFaqItems,
} from "@/lib/listings/faq-generators";
import { directoryTypeTitle } from "@/lib/listings/format";
import { getSiteUrl } from "@/lib/env";
import { buildOgImageUrl } from "@/lib/seo/og";
import {
  buildDirectoryBreadcrumbJsonLd,
  buildDirectoryEntryJsonLd,
} from "@/lib/seo/directory-entry-jsonld";

type Props = { params: Promise<{ type: string; slug: string }> };

export const revalidate = 120;
export const dynamicParams = true;

function websiteLinkLabel(href: string): string {
  try {
    const host = new URL(href).hostname;
    if (host === "chat.whatsapp.com" || host === "wa.me" || host === "api.whatsapp.com") {
      return "WhatsApp group ↗";
    }
  } catch {
    /* ignore */
  }
  return "Official website ↗";
}

export async function generateStaticParams() {
  try {
    return await listDirectoryParamsForStatic();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, slug } = await params;
  const resolvedType = resolveDirectoryTypeSlug(type);
  if (!resolvedType) {
    return { title: "Directory" };
  }
  let entry: Awaited<ReturnType<typeof getDirectoryEntryByTypeSlug>> = null;
  try {
    entry = await getDirectoryEntryByTypeSlug(resolvedType, slug);
  } catch {
    return { title: "Directory" };
  }
  if (!entry) {
    return { title: "Directory" };
  }
  const base = getSiteUrl();
  const url = `${base}/directory/${resolvedType}/${slug}`;
  const desc = [
    entry.localityLabel,
    entry.address?.slice(0, 120),
    "Nanganallur area directory.",
  ]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 155);
  const ogImage = entry.heroImageUrl?.trim()
    ? entry.heroImageUrl.startsWith("http")
      ? entry.heroImageUrl
      : `${base}${entry.heroImageUrl.startsWith("/") ? "" : "/"}${entry.heroImageUrl}`
    : buildOgImageUrl({
        title: entry.name,
        kind: "business",
        locality: entry.localityLabel ?? "Nanganallur",
      });
  return {
    title: `${entry.name} · Directory`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${entry.name} · Directory · mynanganallur.in`,
      description: desc,
      url,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: entry.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.name} · Directory · mynanganallur.in`,
      description: desc,
      images: [ogImage],
    },
  };
}

export default async function DirectoryEntryPage({ params }: Props) {
  const { type, slug } = await params;
  const resolvedType = resolveDirectoryTypeSlug(type);
  if (!resolvedType) {
    notFound();
  }
  if (type.trim().toLowerCase() !== resolvedType) {
    permanentRedirect(`/directory/${resolvedType}/${slug}`);
  }
  let entry: Awaited<ReturnType<typeof getDirectoryEntryByTypeSlug>> = null;
  try {
    entry = await getDirectoryEntryByTypeSlug(resolvedType, slug);
  } catch (err) {
    console.error("[directory]", resolvedType, slug, err);
    notFound();
  }
  if (!entry) {
    notFound();
  }

  const entryLd = buildDirectoryEntryJsonLd(entry, resolvedType);
  const crumbLd = buildDirectoryBreadcrumbJsonLd(
    resolvedType,
    directoryTypeTitle(resolvedType),
    entry.name,
    entry.slug,
  );

  const directoryMeta = parseDirectoryMetadata(entry.metadata);
  const metadataNote = directoryMeta.note ?? null;
  const description = directoryMeta.description ?? null;

  const pageUrl = `${getSiteUrl()}/directory/${resolvedType}/${entry.slug}`;
  const faqItems = resolveFaqItems(entry.faqJson, buildDirectoryAutoFaq(entry));
  const phoneDigits = entry.phone?.replace(/\D/g, "") ?? "";
  const waMessage = `Hi, I found ${entry.name} on mynanganallur.in directory.`;

  const mapsUrl = entry.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(entry.address)}`
    : null;

  const stickyActions = [
    ...(entry.phone
      ? [
          { type: "call" as const, phone: entry.phone },
          {
            type: "whatsapp" as const,
            phone: entry.phone,
            message: waMessage,
          },
        ]
      : []),
    ...(entry.websiteUrl
      ? [
          {
            type: "link" as const,
            href: entry.websiteUrl,
            label: "Website",
            external: true,
            variant: "secondary" as const,
          },
        ]
      : []),
    {
      type: "share" as const,
      url: pageUrl,
      title: entry.name,
      channelLabel: "directory",
    },
  ];

  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 pb-24 sm:px-6 sm:py-12 lg:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entryLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <ListingBreadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Directory", href: "/directory" },
          {
            name: entry.name,
            href: `/directory/${resolvedType}/${entry.slug}`,
          },
        ]}
      />

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        Directory · {directoryTypeTitle(resolvedType)}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
        {entry.name}
      </h1>
      {entry.localityLabel ? (
        <p className="mt-2 text-sm text-[var(--muted)]">{entry.localityLabel}</p>
      ) : null}

      {entry.heroImageUrl ? (
        <div className="relative mt-6 aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:aspect-[3/4]">
          <Image
            src={entry.heroImageUrl}
            alt={`${entry.name} — promotional flyer`}
            fill
            className="object-contain object-center"
            sizes="(max-width: 720px) 100vw, 448px"
            priority
          />
        </div>
      ) : null}

      <ListingGeoBlock
        question={`Where is ${entry.name} in Nanganallur?`}
        directAnswer={`${entry.name} is listed in the ${directoryTypeTitle(resolvedType)} section of the Nanganallur directory${entry.localityLabel ? ` at ${entry.localityLabel}` : ""}${entry.address ? ` — ${entry.address}` : ""}. Call ahead to confirm hours and services.`}
        className="mt-6"
      />

      <ListingHubSubmitCta
        title="List your business in the directory"
        body="Not listed yet, or details out of date? Submit an update — free for residents."
        ctaHref="/submit/business"
        ctaLabel="Add to directory"
        secondaryHref="/my/login"
        secondaryLabel="Manage my listings"
        className="mt-6"
      />

      {description ? (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            About
          </h2>
          <ArticleProse content={description} />
        </div>
      ) : null}

      {entry.address ? (
        <p className="mt-4 text-sm leading-relaxed text-[var(--foreground)]">
          {entry.address}
          {mapsUrl ? (
            <>
              {" "}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                Open in Maps ↗
              </a>
            </>
          ) : null}
        </p>
      ) : null}

      {entry.phone && phoneDigits.length >= 10 ? (
        <ListingContactActions
          phone={entry.phone}
          waMessage={waMessage}
          className="mt-4"
        />
      ) : entry.phone ? (
        <p className="mt-4 text-sm">
          <span className="text-[var(--muted)]">Phone: </span>
          <a
            href={`tel:${entry.phone.replace(/\s/g, "")}`}
            className="font-medium text-[var(--accent)]"
          >
            {entry.phone}
          </a>
        </p>
      ) : null}

      {entry.hoursSummary ? (
        <p className="mt-3 text-sm text-[var(--foreground)]">
          <span className="text-[var(--muted)]">Hours / timings: </span>
          {entry.hoursSummary}
        </p>
      ) : null}
      {entry.websiteUrl ? (
        <p className="mt-2 text-sm">
          <a
            href={entry.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            {websiteLinkLabel(entry.websiteUrl)}
          </a>
        </p>
      ) : null}

      {metadataNote ? (
        <p className="mt-6 text-xs text-[var(--muted)]">{metadataNote}</p>
      ) : null}

      {!entry.verified ? (
        <p className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--muted)]">
          This listing is not marked verified on our side. Confirm timings and
          contact details before visiting.
        </p>
      ) : null}

      <ResponsiveAdSlot
        slotId="directory-detail-mid"
        pagePath={`/directory/${resolvedType}/${slug}`}
        className="mt-8"
      />

      <ShareRow url={pageUrl} title={entry.name} channelLabel="directory" />

      <HelpfulButtons entityType="directory" entityId={entry.id} />

      <FaqBlock items={faqItems} pageUrl={pageUrl} />

      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-directory"
        className="mt-10"
      />

      <p className="mt-10">
        <Link
          href="/directory"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          ← Full directory
        </Link>
      </p>

      {stickyActions.length > 0 ? (
        <StickyListingActions actions={stickyActions} />
      ) : null}
    </div>
  );
}

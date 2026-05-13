import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { ShareRow } from "@/components/share/share-row";
import { HelpfulButtons } from "@/components/reactions/helpful";
import {
  getDirectoryEntryByTypeSlug,
  isDirectoryTypeSlug,
  listDirectoryParamsForStatic,
} from "@/domains/directory";
import { getSiteUrl } from "@/lib/env";
import { buildOgImageUrl } from "@/lib/seo/og";
import {
  buildDirectoryBreadcrumbJsonLd,
  buildDirectoryEntryJsonLd,
} from "@/lib/seo/directory-entry-jsonld";

type Props = { params: Promise<{ type: string; slug: string }> };

export const revalidate = 120;

function typeTitle(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

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
  if (!isDirectoryTypeSlug(type)) {
    return { title: "Directory" };
  }
  let entry: Awaited<ReturnType<typeof getDirectoryEntryByTypeSlug>> = null;
  try {
    entry = await getDirectoryEntryByTypeSlug(type, slug);
  } catch {
    return { title: "Directory" };
  }
  if (!entry) {
    return { title: "Directory" };
  }
  const base = getSiteUrl();
  const url = `${base}/directory/${type}/${slug}`;
  const desc = [
    entry.localityLabel,
    entry.address?.slice(0, 120),
    "Nanganallur area directory.",
  ]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 155);
  const ogImage = buildOgImageUrl({
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
  if (!isDirectoryTypeSlug(type)) {
    notFound();
  }
  const entry = await getDirectoryEntryByTypeSlug(type, slug);
  if (!entry) {
    notFound();
  }

  const entryLd = buildDirectoryEntryJsonLd(entry, type);
  const crumbLd = buildDirectoryBreadcrumbJsonLd(
    type,
    typeTitle(type),
    entry.name,
    entry.slug,
  );

  let metadataNote: string | null = null;
  if (entry.metadata) {
    try {
      const m = JSON.parse(entry.metadata) as { note?: string };
      metadataNote = m.note ?? null;
    } catch {
      metadataNote = null;
    }
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entryLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        Directory · {typeTitle(type)}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {entry.name}
      </h1>
      {entry.localityLabel ? (
        <p className="mt-2 text-sm text-[var(--muted)]">{entry.localityLabel}</p>
      ) : null}
      {entry.address ? (
        <p className="mt-4 text-sm leading-relaxed text-[var(--foreground)]">
          {entry.address}
        </p>
      ) : null}
      {entry.phone ? (
        <p className="mt-3 text-sm">
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
        <p className="mt-2 text-sm text-[var(--foreground)]">
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

      <AdSlot
        slotId="directory-detail-mid"
        size="728x90"
        seed={buildRotationSeed(
          `/directory/${type}/${slug}`,
          "directory-detail-mid",
        )}
        className="mt-8 max-w-full"
      />
      <ShareRow
        url={`${getSiteUrl()}/directory/${type}/${entry.slug}`}
        title={entry.name}
        channelLabel="directory"
      />

      <HelpfulButtons entityType="directory" entityId={entry.id} />

      <FaqBlock
        items={entry.faqJson?.items ?? null}
        pageUrl={`${getSiteUrl()}/directory/${type}/${entry.slug}`}
      />

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
    </div>
  );
}

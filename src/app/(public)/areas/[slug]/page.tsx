import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import {
  NANGANALLUR_GEO_VERSION,
  nanganallurAreas,
} from "@/lib/nanganallur-areas";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return nanganallurAreas.map((z) => ({ slug: z.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = nanganallurAreas.find((z) => z.slug === slug);
  if (!area) {
    return { title: "Area" };
  }
  return {
    title: `${area.label} — Nanganallur area hub`,
    description: area.blurb,
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = nanganallurAreas.find((z) => z.slug === slug);
  if (!area) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        Area hub · {NANGANALLUR_GEO_VERSION}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {area.label}
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">{area.blurb}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/local-news"
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:border-[var(--accent)]"
        >
          Local news
        </Link>
        <Link
          href="/local-events"
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:border-[var(--accent)]"
        >
          Local events
        </Link>
        <Link
          href="/directory"
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:border-[var(--accent)]"
        >
          Directory
        </Link>
      </div>
      <p className="mt-12 text-sm text-[var(--muted)]">
        Listings and filters for this pocket are coming next — this page is a
        stable URL for search and sharing.
      </p>
      <AdSlot
        slotId="listings-detail-mid"
        size="728x90"
        seed={buildRotationSeed(`/areas/${slug}`, "listings-detail-mid")}
        className="mt-10 max-w-full"
      />
      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-area"
        className="mt-10 max-w-xl"
      />
    </div>
  );
}

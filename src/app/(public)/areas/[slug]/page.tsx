import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { ArticleProse } from "@/components/news/article-prose";
import {
  NANGANALLUR_GEO_VERSION,
  nanganallurAreas,
} from "@/lib/nanganallur-areas";
import { buildAreaPlaceJsonLd } from "@/lib/seo/area-place-jsonld";

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
  const raw = `${area.blurb} ${area.geoDirectAnswer}`;
  const description =
    raw.length <= 155 ? raw : `${raw.slice(0, 152).trimEnd()}…`;
  return {
    title: `${area.label} — Nanganallur area hub`,
    description,
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = nanganallurAreas.find((z) => z.slug === slug);
  if (!area) {
    notFound();
  }

  const placeDesc = `${area.geoDirectAnswer} ${area.blurb}`;
  const placeLd = buildAreaPlaceJsonLd({
    label: area.label,
    slug: area.slug,
    description: placeDesc,
  });

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeLd) }}
      />

      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        Area hub · {NANGANALLUR_GEO_VERSION}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {area.label}
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">{area.blurb}</p>

      <section
        className="mt-10 max-w-3xl"
        aria-labelledby="area-geo-heading"
      >
        <h2
          id="area-geo-heading"
          className="text-xl font-semibold tracking-tight text-[var(--foreground)]"
        >
          {area.geoQuestion}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--foreground)]">
          {area.geoDirectAnswer}
        </p>
      </section>

      <div className="mt-10 max-w-3xl">
        <ArticleProse content={area.extendedMd} />
      </div>

      <nav
        className="mt-10 flex flex-wrap gap-3"
        aria-label="Area hub shortcuts"
      >
        <Link
          href="/local-news"
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:border-[var(--accent)]"
        >
          Local news
        </Link>
        <Link
          href="/local-news/topic/local"
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:border-[var(--accent)]"
        >
          Topic: Local
        </Link>
        <Link
          href="/local-news/topic/mobility"
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:border-[var(--accent)]"
        >
          Topic: Mobility
        </Link>
        <Link
          href="/local-events"
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:border-[var(--accent)]"
        >
          Local events
        </Link>
        <Link
          href="/jobs"
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:border-[var(--accent)]"
        >
          Jobs
        </Link>
        <Link
          href="/directory"
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:border-[var(--accent)]"
        >
          Directory
        </Link>
      </nav>

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

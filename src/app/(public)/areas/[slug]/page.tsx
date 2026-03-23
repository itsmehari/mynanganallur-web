import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CHENNAI_GEO_VERSION, chennaiZones } from "@/lib/chennai-zones";
import { getSiteUrl } from "@/lib/env";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return chennaiZones.map((z) => ({ slug: z.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const zone = chennaiZones.find((z) => z.slug === slug);
  if (!zone) return { title: "Area" };
  const base = getSiteUrl();
  return {
    title: `${zone.label} — Chennai area hub`,
    description: zone.blurb,
    alternates: { canonical: `${base}/areas/${zone.slug}` },
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const zone = chennaiZones.find((z) => z.slug === slug);
  if (!zone) notFound();

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
      <p className="text-sm font-medium text-[var(--accent)]">Area hub</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        {zone.label}
      </h1>
      {zone.gccZoneNumber ? (
        <p className="mt-2 text-sm text-[var(--muted)]">
          Reference GCC zone index {zone.gccZoneNumber} (verify against official
          notifications before hard-coding services copy).
        </p>
      ) : null}
      <p className="mt-4 max-w-2xl text-[var(--muted)]">{zone.blurb}</p>
      <p className="mt-6 text-xs text-[var(--muted)]">
        Geo version:{" "}
        <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 ring-1 ring-[var(--border)]">
          {CHENNAI_GEO_VERSION}
        </code>
      </p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/news", label: "News tagged to this area" },
          { href: "/events", label: "Upcoming events" },
          { href: "/jobs", label: "Jobs nearby" },
          { href: "/directory", label: "Directory near you" },
        ].map((c) => (
          <Link
            key={c.href + c.label}
            href={c.href}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {c.label}
            <span className="mt-2 block text-xs font-normal text-[var(--muted)]">
              Filters wire when content APIs land.
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="/#areas"
        className="mt-10 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← All areas
      </Link>
    </div>
  );
}

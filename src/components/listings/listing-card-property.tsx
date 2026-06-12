import Link from "next/link";
import { propertyKindLabel, propertyPriceLine } from "@/lib/listings/format";

type Props = {
  slug: string;
  title: string;
  kind: string;
  localityLabel: string | null;
  bedrooms: number | null;
  areaSqft: number | null;
  rentPerMonth: number | null;
  salePrice: number | null;
  featured: boolean;
};

export function ListingCardProperty({
  slug,
  title,
  kind,
  localityLabel,
  bedrooms,
  areaSqft,
  rentPerMonth,
  salePrice,
  featured,
}: Props) {
  const price = propertyPriceLine({ kind, rentPerMonth, salePrice });
  const meta = [
    localityLabel,
    bedrooms != null ? `${bedrooms} BHK` : null,
    areaSqft != null ? `~${areaSqft.toLocaleString("en-IN")} sq ft` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li>
      <Link
        href={`/properties/${slug}`}
        className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-sm transition hover:border-[var(--accent)] active:bg-[color-mix(in_srgb,var(--surface)_92%,var(--accent)_8%)]"
      >
        <span
          className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
            kind === "sale"
              ? "bg-violet-100 text-violet-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {propertyKindLabel(kind)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold leading-snug text-[var(--foreground)]">
              {title}
            </span>
            {featured ? (
              <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                Featured
              </span>
            ) : null}
          </span>
          {meta ? (
            <span className="mt-1 block text-xs text-[var(--muted)]">{meta}</span>
          ) : null}
          {price ? (
            <span className="mt-1 block text-xs font-semibold text-[var(--accent)]">
              {price}
            </span>
          ) : null}
        </span>
        <span aria-hidden className="shrink-0 text-[var(--muted)]">
          →
        </span>
      </Link>
    </li>
  );
}

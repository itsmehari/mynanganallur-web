import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { PropertyListWhatsAppCta } from "@/components/properties/property-list-whatsapp-cta";
import { ListingFilterBar } from "@/components/search/listing-filter-bar";
import { listPublishedPropertiesForSite } from "@/domains/properties";
import { searchAcross } from "@/domains/search";
import { getSiteUrl } from "@/lib/env";
import { buildItemListJsonLd } from "@/lib/seo/itemlist-jsonld";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Houses and flats for rent or sale around Nanganallur — verified-style listings with detail pages. Confirm terms in person before paying advance.",
};

function kindLabel(kind: string): string {
  if (kind === "rent") return "Rent";
  if (kind === "sale") return "Sale";
  return "Listing";
}

function priceLine(p: {
  kind: string;
  rentPerMonth: number | null;
  salePrice: number | null;
}): string | null {
  if (p.kind === "rent" && p.rentPerMonth != null) {
    return `Rs. ${p.rentPerMonth.toLocaleString("en-IN")}/month`;
  }
  if (p.kind === "sale" && p.salePrice != null) {
    return `Rs. ${p.salePrice.toLocaleString("en-IN")}`;
  }
  return null;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locality?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || null;
  const locality = sp.locality?.trim() || null;
  let rows: Awaited<ReturnType<typeof listPublishedPropertiesForSite>> = [];
  try {
    if (q || locality) {
      const search = await searchAcross({
        q,
        locality,
        type: "property",
        limit: 25,
      });
      const all = await listPublishedPropertiesForSite(200);
      const ids = new Set(search.hits.property.map((h) => h.id));
      rows = all.filter((p) => ids.has(p.id));
    } else {
      rows = await listPublishedPropertiesForSite(80);
    }
  } catch {
    /* DATABASE_URL unset */
  }

  const itemListLd = buildItemListJsonLd({
    name: "Properties for rent & sale near Nanganallur",
    pageUrl: `${getSiteUrl()}/properties`,
    items: rows.map((p) => ({
      name: p.title,
      href: `/properties/${p.slug}`,
    })),
  });

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <p className="text-sm font-medium text-[var(--accent)]">Properties</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Rent &amp; sale near Nanganallur
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Local listings with full pages for search. Treat every post as
        advertiser-submitted: visit the property and verify paperwork before you
        transfer money.
      </p>

      <ListingFilterBar
        action="/properties"
        q={q ?? undefined}
        locality={locality ?? undefined}
        qPlaceholder="Search properties…"
      />

      {rows.length === 0 ? (
        <p className="mt-10 max-w-xl text-sm text-[var(--muted)]">
          No published listings yet. Add rows via seed scripts or your admin
          pipeline once the database is connected.
        </p>
      ) : (
        <ul className="mt-10 space-y-4">
          {rows.map((p) => {
            const price = priceLine(p);
            return (
              <li
                key={p.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-sm"
              >
                <Link
                  href={`/properties/${p.slug}`}
                  className="block text-[var(--foreground)] transition hover:text-[var(--accent)]"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{p.title}</span>
                    {p.featured ? (
                      <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                        Featured
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    {kindLabel(p.kind)}
                    {p.localityLabel ? ` · ${p.localityLabel}` : ""}
                    {p.bedrooms != null ? ` · ${p.bedrooms} BHK` : ""}
                    {p.areaSqft != null ? ` · ~${p.areaSqft} sq ft` : ""}
                  </span>
                  {price ? (
                    <span className="mt-1 block text-xs font-medium text-[var(--accent)]">
                      {price}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <PropertyListWhatsAppCta className="mt-10 max-w-xl" />

      <AdSlot
        slotId="properties-index-mid"
        size="728x90"
        seed={buildRotationSeed("/properties", "properties-index-mid")}
        className="mt-10 max-w-full"
      />
      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-properties"
        className="mt-10 max-w-xl"
      />
      <Link
        href="/"
        className="mt-8 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}

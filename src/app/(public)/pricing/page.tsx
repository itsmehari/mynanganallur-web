import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { listingPricing } from "@/db/schema";
import { buildPageMetadata } from "@/lib/seo/hub-page-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/pricing",
  title: "Pricing · mynanganallur.in",
  description:
    "Free standard listings + optional featured upgrades for jobs, events, businesses and properties on mynanganallur.in.",
});

export const revalidate = 600;

const ENTITY_LABEL: Record<string, string> = {
  job: "Jobs",
  event: "Events",
  directory: "Directory",
  property: "Properties",
};

function inrFormat(n: number): string {
  if (n === 0) return "Free";
  return `₹${n.toLocaleString("en-IN")}`;
}

export default async function PricingPage() {
  let rows: Array<{
    entityType: string;
    tier: string;
    priceInr: number;
    durationDays: number;
    features: string | null;
  }> = [];
  try {
    const db = getDb();
    rows = await db
      .select({
        entityType: listingPricing.entityType,
        tier: listingPricing.tier,
        priceInr: listingPricing.priceInr,
        durationDays: listingPricing.durationDays,
        features: listingPricing.features,
      })
      .from(listingPricing)
      .where(eq(listingPricing.active, true))
      .orderBy(asc(listingPricing.entityType), asc(listingPricing.priceInr));
  } catch {
    rows = [];
  }

  const grouped: Record<string, typeof rows> = {};
  for (const r of rows) {
    grouped[r.entityType] ??= [];
    grouped[r.entityType].push(r);
  }

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-12 sm:px-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Pricing — simple and local
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          Standard listings are free, forever. Optional featured upgrades push
          your job, event, business or property to the top of search and
          our weekly digest. Pay once via Razorpay; no subscriptions.
        </p>
      </header>

      <div className="mt-10 grid gap-10">
        {Object.entries(grouped).map(([type, tiers]) => (
          <section key={type}>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
              {ENTITY_LABEL[type] ?? type}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tiers.map((t) => (
                <div
                  key={`${type}-${t.tier}`}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                    {t.tier}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {inrFormat(t.priceInr)}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {t.durationDays} days
                  </p>
                  {t.features ? (
                    <p className="mt-3 text-sm text-[var(--foreground)]">
                      {t.features}
                    </p>
                  ) : null}
                  <Link
                    href={`/submit/${type === "directory" ? "business" : type}`}
                    className="mt-4 inline-block rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    {t.priceInr === 0 ? "Submit free" : "Submit & upgrade"}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            Pricing is being finalised. Until then, all submissions are free —
            <Link href="/submit" className="font-semibold text-[var(--accent)]">
              {" "}
              start here
            </Link>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}

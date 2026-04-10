import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import {
  listDirectoryEntriesForSite,
  type DirectoryTypeSlug,
} from "@/domains/directory";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Directory",
  description:
    "Schools, temples, hospitals, parks, and more around Nanganallur — verified listings in progress.",
};

function typeTitle(type: DirectoryTypeSlug): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function DirectoryPage() {
  let entries: Awaited<ReturnType<typeof listDirectoryEntriesForSite>> = [];
  try {
    entries = await listDirectoryEntriesForSite();
  } catch {
    /* DATABASE_URL unset */
  }

  const byType = new Map<DirectoryTypeSlug, typeof entries>();
  for (const e of entries) {
    const t = e.type as DirectoryTypeSlug;
    const list = byType.get(t) ?? [];
    list.push(e);
    byType.set(t, list);
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
      <p className="text-sm font-medium text-[var(--accent)]">Directory</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Explore places and businesses
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Entries are seeded from public sources; phones and hours change — always
        confirm before you visit. Each listing has its own page for search and
        sharing.
      </p>

      {entries.length === 0 ? (
        <p className="mt-10 max-w-xl text-sm text-[var(--muted)]">
          No directory rows yet. Run{" "}
          <code className="rounded bg-[var(--surface)] px-1 text-xs">
            npm run db:seed:directory
          </code>{" "}
          after `db:seed`.
        </p>
      ) : (
        <div className="mt-12 space-y-12">
          {Array.from(byType.entries()).map(([type, list]) => (
            <section key={type} id={type} className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                {typeTitle(type)}
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={`/directory/${type}/${entry.slug}`}
                      className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {entry.name}
                      {entry.localityLabel ? (
                        <span className="mt-1 block text-xs font-normal text-[var(--muted)]">
                          {entry.localityLabel}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <AdSlot
        slotId="listings-index-top"
        size="728x90"
        seed={buildRotationSeed("/directory", "listings-index-top")}
        className="mt-10 max-w-full"
      />
      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-directory"
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

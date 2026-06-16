import type { Metadata } from "next";
import Link from "next/link";
import { listDirectoryEntriesForOwner } from "@/domains/directory/owner-queries";
import { requireListingOwner } from "@/lib/listing-owner/auth";
import { directoryTypeTitle } from "@/lib/listings/format";
import { formatPhoneDisplay } from "@/lib/listing-owner/phone";

export const metadata: Metadata = {
  title: "My business listings",
  robots: { index: false, follow: false },
};

export default async function MyListingsPage() {
  const owner = await requireListingOwner("/my/listings");
  const entries = await listDirectoryEntriesForOwner(owner.id);

  return (
    <div className="mx-auto max-w-[800px] px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
            Your account
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            My business listings
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Signed in as {owner.email} · {formatPhoneDisplay(owner.phone)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/submit/business"
            className="rounded-full border border-[var(--border)] px-4 py-2 font-semibold text-[var(--foreground)] hover:border-[var(--accent)]"
          >
            Add listing
          </Link>
          <Link
            href="/my/logout"
            className="rounded-full px-4 py-2 font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Sign out
          </Link>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--muted)]">
            No listings linked to this account yet. Submit a business using the
            same email and phone, or contact us if you listed before accounts
            were enabled.
          </p>
          <Link
            href="/submit/business"
            className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            List your business →
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/my/listings/${entry.id}`}
                className="flex min-h-[72px] flex-col justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm transition hover:border-[var(--accent)]"
              >
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                  {directoryTypeTitle(entry.type)}
                  {entry.verified ? " · Verified" : " · Pending review"}
                </span>
                <span className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {entry.name}
                </span>
                {entry.localityLabel ? (
                  <span className="mt-1 text-xs text-[var(--muted)]">
                    {entry.localityLabel}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

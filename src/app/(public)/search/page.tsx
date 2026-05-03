import type { Metadata } from "next";
import Link from "next/link";
import { ListingFilterBar } from "@/components/search/listing-filter-bar";
import { searchAcross, type SearchEntity } from "@/domains/search";
import { track } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search news, events, jobs, properties, and the directory across mynanganallur.in.",
  robots: { index: false },
};

const ENTITY_LABEL: Record<SearchEntity, string> = {
  article: "Local news",
  event: "Events",
  job: "Jobs",
  property: "Properties",
  directory: "Directory",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locality?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || null;
  const locality = sp.locality?.trim() || null;
  const typeRaw = sp.type?.trim() || null;
  const type = (
    ["article", "event", "job", "property", "directory"] as const
  ).find((t) => t === typeRaw)
    ? (typeRaw as SearchEntity)
    : null;

  let results: Awaited<ReturnType<typeof searchAcross>> | null = null;
  if (q || locality) {
    try {
      results = await searchAcross({ q, locality, type, limit: 12 });
      // Server-side track is best-effort and only logs in dev (see helper).
      track("search_query", {
        q: q ?? "",
        locality: locality ?? "",
        type: type ?? "all",
        total: results?.total ?? 0,
      });
    } catch {
      results = null;
    }
  }

  return (
    <div className="mx-auto max-w-[1024px] px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
        Search
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Search mynanganallur.in
      </h1>
      <p className="mt-3 max-w-prose text-sm text-[var(--muted)]">
        News, events, jobs, properties, and the local directory — all in one
        box. Add a locality (e.g. <em>Madipakkam</em>) to narrow.
      </p>

      <ListingFilterBar
        action="/search"
        q={q ?? undefined}
        locality={locality ?? undefined}
        qPlaceholder="Search the whole site…"
        type={type ?? undefined}
        typeOptions={[
          { value: "article", label: "News" },
          { value: "event", label: "Events" },
          { value: "job", label: "Jobs" },
          { value: "property", label: "Properties" },
          { value: "directory", label: "Directory" },
        ]}
      />

      {!results ? (
        <p className="mt-12 text-sm text-[var(--muted)]">
          Type a search term above and press Enter.
        </p>
      ) : results.total === 0 ? (
        <p className="mt-12 text-sm text-[var(--muted)]">
          Nothing matched <strong>{q ?? "your filters"}</strong>. Try fewer
          words or a broader locality.
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {(["article", "event", "job", "property", "directory"] as const).map(
            (entity) => {
              const hits = results!.hits[entity];
              if (hits.length === 0) return null;
              return (
                <section key={entity}>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    {ENTITY_LABEL[entity]} ({hits.length})
                  </h2>
                  <ul className="mt-3 space-y-3">
                    {hits.map((hit) => (
                      <li
                        key={hit.id}
                        className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                      >
                        <Link
                          href={hit.href}
                          className="block text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)]"
                        >
                          {hit.title}
                        </Link>
                        {hit.snippet ? (
                          <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
                            {hit.snippet}
                          </p>
                        ) : null}
                        {hit.locality ? (
                          <p className="mt-1 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                            {hit.locality}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}

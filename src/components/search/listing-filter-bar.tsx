type Props = {
  /** GET action — usually the same path as the page that renders this. */
  action: string;
  q?: string;
  locality?: string;
  qPlaceholder?: string;
  /** When provided, renders an additional `type` select. */
  typeOptions?: { value: string; label: string }[];
  type?: string;
};

/**
 * URL-driven listing filter bar. Posts via GET so search-engine crawlers can
 * follow shared filter URLs (`?q=…&locality=…`). Server pages read
 * `searchParams` and re-query.
 */
export function ListingFilterBar({
  action,
  q,
  locality,
  qPlaceholder,
  typeOptions,
  type,
}: Props) {
  return (
    <form
      action={action}
      method="get"
      className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
      role="search"
    >
      <div className="min-w-0 flex-1">
        <label
          htmlFor="filter-q"
          className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]"
        >
          Search
        </label>
        <input
          id="filter-q"
          name="q"
          type="search"
          defaultValue={q ?? ""}
          placeholder={qPlaceholder ?? "Search this list…"}
          className="mt-1 block w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
        />
      </div>
      <div className="w-full sm:w-44">
        <label
          htmlFor="filter-locality"
          className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]"
        >
          Locality
        </label>
        <input
          id="filter-locality"
          name="locality"
          type="text"
          defaultValue={locality ?? ""}
          placeholder="e.g. Madipakkam"
          className="mt-1 block w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
        />
      </div>
      {typeOptions ? (
        <div className="w-full sm:w-44">
          <label
            htmlFor="filter-type"
            className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]"
          >
            Type
          </label>
          <select
            id="filter-type"
            name="type"
            defaultValue={type ?? ""}
            className="mt-1 block w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
          >
            <option value="">All</option>
            {typeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <button
        type="submit"
        className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
      >
        Apply
      </button>
    </form>
  );
}

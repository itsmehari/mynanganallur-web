import Link from "next/link";
import { directoryTypeTitle } from "@/lib/listings/format";
import { buildListingQuery } from "@/lib/listings/filter-params";

export type FilterChip = {
  label: string;
  param: string;
  value: string | null;
};

type Props = {
  types: string[];
  currentType: string | null;
  currentParams: Record<string, string | undefined | null>;
};

function chipHref(
  type: string | null,
  currentParams: Record<string, string | undefined | null>,
): string {
  const qs = buildListingQuery(
    { q: currentParams.q, locality: currentParams.locality },
    {},
  );
  if (type === null) return `/directory${qs}`;
  return `/directory/${type}${qs}`;
}

export function ListingHubTabs({ types, currentType, currentParams }: Props) {
  const chips: FilterChip[] = [
    { label: "All", param: "type", value: null },
    ...types.map((t) => ({
      label: directoryTypeTitle(t),
      param: "type",
      value: t,
    })),
  ];

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Quick filters">
        {chips.map((chip) => {
          const isActive =
            chip.value === null
              ? !currentType
              : currentType === chip.value;
          const href = chipHref(chip.value, currentParams);
          return (
            <Link
              key={`${chip.param}-${chip.value ?? "all"}`}
              href={href}
              aria-current={isActive ? "true" : undefined}
              className={`inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]"
              }`}
            >
              {chip.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

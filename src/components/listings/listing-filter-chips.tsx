import Link from "next/link";
import { buildListingQuery } from "@/lib/listings/filter-params";

export type FilterChip = {
  label: string;
  param: string;
  value: string | null;
};

type Props = {
  basePath: string;
  chips: FilterChip[];
  currentParams: Record<string, string | undefined | null>;
};

export function ListingFilterChips({ basePath, chips, currentParams }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Quick filters">
      {chips.map((chip) => {
        const isActive =
          chip.value === null
            ? !currentParams[chip.param]?.trim()
            : currentParams[chip.param] === chip.value;
        const href = `${basePath}${buildListingQuery(currentParams, {
          [chip.param]: chip.value,
        })}`;
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
  );
}

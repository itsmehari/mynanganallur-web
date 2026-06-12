import Link from "next/link";
import { directoryTypeTitle } from "@/lib/listings/format";

type Props = {
  type: string;
  slug: string;
  name: string;
  localityLabel: string | null;
};

export function ListingCardDirectory({
  type,
  slug,
  name,
  localityLabel,
}: Props) {
  return (
    <li>
      <Link
        href={`/directory/${type}/${slug}`}
        className="flex min-h-[72px] flex-col justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm transition hover:border-[var(--accent)] active:bg-[color-mix(in_srgb,var(--surface)_92%,var(--accent)_8%)]"
      >
        <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
          {directoryTypeTitle(type)}
        </span>
        <span className="mt-1 text-sm font-semibold text-[var(--foreground)]">
          {name}
        </span>
        {localityLabel ? (
          <span className="mt-1 text-xs text-[var(--muted)]">{localityLabel}</span>
        ) : null}
      </Link>
    </li>
  );
}

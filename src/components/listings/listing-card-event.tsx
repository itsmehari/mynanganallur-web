import Link from "next/link";
import { formatEventDateBadge, formatEventWhen } from "@/lib/listings/format";

type Props = {
  slug: string;
  title: string;
  startsAt: Date;
  allDay: boolean;
  venueName: string | null;
  localityLabel: string | null;
};

export function ListingCardEvent({
  slug,
  title,
  startsAt,
  allDay,
  venueName,
  localityLabel,
}: Props) {
  const badge = formatEventDateBadge(startsAt);
  const where = venueName ?? localityLabel ?? "Details inside";

  return (
    <li>
      <Link
        href={`/local-events/${slug}`}
        className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-sm transition hover:border-[var(--accent-warm)] active:bg-[color-mix(in_srgb,var(--surface)_92%,var(--accent-warm)_8%)]"
      >
        <span
          className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,var(--accent-warm)_10%)] text-center"
          aria-hidden
        >
          <span className="text-lg font-bold leading-none text-[var(--foreground)]">
            {badge.day}
          </span>
          <span className="mt-0.5 text-[10px] font-bold tracking-wide text-[var(--accent-warm)]">
            {badge.month}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-sm font-semibold leading-snug text-[var(--foreground)]">
            {title}
          </span>
          <span className="mt-1 block text-xs text-[var(--muted)]">
            {formatEventWhen(startsAt, allDay)} · {where}
          </span>
        </span>
        <span aria-hidden className="shrink-0 text-[var(--muted)]">
          →
        </span>
      </Link>
    </li>
  );
}

import { contactTelHref, contactWaHref } from "@/lib/listings/format";

type Props = {
  phone: string;
  waMessage?: string;
  className?: string;
};

export function ListingContactActions({
  phone,
  waMessage,
  className = "mt-6",
}: Props) {
  return (
    <div className={`flex flex-col gap-2 sm:flex-row ${className}`}>
      <a
        href={contactTelHref(phone)}
        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
      >
        Call {phone}
      </a>
      <a
        href={contactWaHref(phone, waMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        WhatsApp
      </a>
    </div>
  );
}

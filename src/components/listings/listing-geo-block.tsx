type Props = {
  question: string;
  directAnswer: string;
  localityLine?: string;
  className?: string;
};

export function ListingGeoBlock({
  question,
  directAnswer,
  localityLine,
  className = "mt-8",
}: Props) {
  return (
    <section
      className={`rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,var(--accent)_4%)] p-5 sm:p-6 ${className}`}
      aria-labelledby="listing-geo-heading"
    >
      <h2
        id="listing-geo-heading"
        className="listing-geo-question text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl"
      >
        {question}
      </h2>
      <p className="listing-geo-direct-answer mt-3 max-w-3xl text-sm leading-relaxed text-[var(--foreground)] sm:text-base">
        {directAnswer}
      </p>
      {localityLine ? (
        <p className="mt-3 text-xs text-[var(--muted)] sm:text-sm">{localityLine}</p>
      ) : null}
    </section>
  );
}

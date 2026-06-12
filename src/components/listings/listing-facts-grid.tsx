type Props = {
  facts: string[];
  className?: string;
};

export function ListingFactsGrid({ facts, className = "mt-6" }: Props) {
  if (facts.length === 0) return null;

  return (
    <ul className={`listing-facts-grid grid grid-cols-2 gap-2 sm:flex sm:flex-wrap ${className}`}>
      {facts.map((f) => (
        <li
          key={f}
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center text-xs font-medium text-[var(--foreground)] sm:py-1"
        >
          {f}
        </li>
      ))}
    </ul>
  );
}

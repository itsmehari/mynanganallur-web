type Fact = { label: string; value: string };

type Props = {
  facts: Fact[];
  className?: string;
};

/** Mobile-only collapsible summary; desktop uses sidebar. */
export function JobAtAGlance({ facts, className = "mt-4 lg:hidden" }: Props) {
  if (facts.length === 0) return null;

  return (
    <details className={`job-at-a-glance rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 ${className}`}>
      <summary className="cursor-pointer text-sm font-semibold text-[var(--foreground)]">
        At a glance
      </summary>
      <dl className="mt-3 space-y-3 text-sm">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
              {f.label}
            </dt>
            <dd className="mt-0.5 font-medium text-[var(--foreground)]">{f.value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

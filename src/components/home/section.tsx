import type { ReactNode } from "react";
import Link from "next/link";

type SectionProps = {
  id?: string;
  /** Small caps label above the title (template-style section marker). */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  action,
  children,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 ${className}`}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow ? (
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={id ? `${id}-heading` : undefined}
            className="font-serif text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="shrink-0 text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

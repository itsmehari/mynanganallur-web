import type { ReactNode } from "react";
import Link from "next/link";

type SectionProps = {
  id?: string;
  /** Small caps label above the title (template-style section marker). */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  action,
  secondaryAction,
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
        {action || secondaryAction ? (
          <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1">
            {action ? (
              <Link
                href={action.href}
                className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {action.label}
              </Link>
            ) : null}
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className="text-sm font-medium text-[var(--muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

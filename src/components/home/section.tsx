import type { ReactNode } from "react";
import Link from "next/link";

type SectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
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
          <h2
            id={id ? `${id}-heading` : undefined}
            className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
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

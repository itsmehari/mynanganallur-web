"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MEGA_NAV_SECTIONS } from "./nav-config";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MegaNavMobile({ open, onClose }: Props) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(MEGA_NAV_SECTIONS[0]?.id ?? null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    onCloseRef.current();
  }, [pathname]);

  if (!open) return null;

  return (
    <div
      className="mega-nav-mobile-enter fixed inset-0 z-[70] flex flex-col bg-[var(--background)] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4">
        <p className="font-serif text-lg font-bold text-[var(--foreground)]">Menu</p>
        <button
          type="button"
          className="focus-ring flex min-h-11 min-w-11 items-center justify-center rounded-xl text-[var(--foreground)]"
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        aria-label="Mobile primary"
      >
        <ul className="space-y-2">
          {MEGA_NAV_SECTIONS.map((section) => {
            const isExpanded = expanded === section.id;
            return (
              <li
                key={section.id}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm"
              >
                <button
                  type="button"
                  className="focus-ring flex w-full min-h-12 items-center justify-between gap-3 px-4 py-3 text-left"
                  aria-expanded={isExpanded}
                  aria-controls={`m-accordion-${section.id}`}
                  id={`m-trigger-${section.id}`}
                  onClick={() =>
                    setExpanded((v) => (v === section.id ? null : section.id))
                  }
                >
                  <span className="font-serif text-base font-bold text-[var(--foreground)]">
                    {section.label}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`shrink-0 text-[var(--muted)] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {isExpanded ? (
                  <div
                    id={`m-accordion-${section.id}`}
                    role="region"
                    aria-labelledby={`m-trigger-${section.id}`}
                    className="border-t border-[var(--border)] px-2 py-3"
                  >
                  {section.featured ? (
                    <Link
                      href={section.featured.href}
                      className="focus-ring mb-4 block rounded-xl bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))] p-4"
                      onClick={onClose}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                        Featured
                      </p>
                      <p className="mt-1 font-serif text-base font-bold text-[var(--foreground)]">
                        {section.featured.title}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {section.featured.description}
                      </p>
                      <span className="mt-3 inline-flex text-sm font-semibold text-[var(--accent)]">
                        {section.featured.cta} →
                      </span>
                    </Link>
                  ) : null}
                  {section.columns.map((col) => (
                    <div key={col.heading} className="mb-4 last:mb-0">
                      <p className="px-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                        {col.heading}
                      </p>
                      <ul className="mt-2 space-y-0.5">
                        {col.links.map((link) => (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              className="focus-ring block min-h-11 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background)]"
                              onClick={onClose}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] p-4 text-center">
          <p className="text-sm text-[var(--muted)]">
            Tip: on desktop, hover sections for the full megamenu.
          </p>
        </div>
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  NANGANALLUR_GEO_VERSION,
  nanganallurAreas,
  type NanganallurArea,
} from "@/lib/nanganallur-areas";

function AreaCard({
  area,
  active,
  onHover,
  onLeave,
}: {
  area: NanganallurArea;
  active: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <Link
      href={`/areas/${area.slug}`}
      onMouseEnter={onHover}
      onFocus={onHover}
      onMouseLeave={onLeave}
      onBlur={onLeave}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${active ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))] shadow-md" : "border-[var(--border)] bg-[var(--surface)] hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] hover:shadow-md"} ${area.gridClass}`}
    >
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {area.label}
        </p>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        {area.blurb}
      </p>
      <span className="mt-4 inline-flex items-center text-xs font-semibold text-[var(--accent)]">
        Open area hub
        <span
          className="ml-1 transition group-hover:translate-x-0.5"
          aria-hidden
        >
          →
        </span>
      </span>
    </Link>
  );
}

export function HomeAreaMap() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,280px)] lg:items-start">
      <div>
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-[auto_auto_auto]"
          role="list"
          aria-label="Nanganallur and nearby neighbourhoods"
        >
          {nanganallurAreas.map((area) => (
            <div key={area.slug} role="listitem" className="min-h-[120px]">
              <AreaCard
                area={area}
                active={activeSlug === area.slug}
                onHover={() => setActiveSlug(area.slug)}
                onLeave={() => setActiveSlug(null)}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]">
          Map data version{" "}
          <code className="rounded bg-[var(--background)] px-1 py-0.5">
            {NANGANALLUR_GEO_VERSION}
          </code>
          . Boundaries are editorial groupings for navigation, not survey maps.
        </p>
      </div>

      <aside
        className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--wave)_35%,var(--surface))] p-6"
        aria-hidden={false}
      >
        <div className="animate-gentle-float pointer-events-none absolute -right-6 -top-10 h-40 w-40 rounded-full bg-[var(--accent)] opacity-15 blur-3xl" />
        <p className="text-sm font-semibold text-[var(--foreground)]">
          South Chennai anchor
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
          This bento grid is a navigational map: tap a tile for hyperlocal hubs
          as we wire news, events, and listings.
        </p>
        <svg
          viewBox="0 0 200 220"
          className="mt-6 w-full text-[var(--accent)] opacity-80"
          aria-hidden
        >
          <path
            fill="currentColor"
            fillOpacity="0.12"
            d="M20 180 Q60 140 100 150 T180 130 L185 200 L15 205 Z"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            d="M30 175 C70 120 120 100 175 95"
          />
          <text
            x="100"
            y="195"
            textAnchor="middle"
            fill="currentColor"
            fillOpacity="0.5"
            fontSize="10"
          >
            GST · OMR →
          </text>
        </svg>
      </aside>
    </div>
  );
}

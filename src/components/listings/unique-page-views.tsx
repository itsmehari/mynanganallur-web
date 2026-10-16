"use client";

import { useEffect, useState } from "react";

type Props = {
  entityType: string;
  entityId: string;
  /** Tamil UI label when locale is ta-IN */
  locale?: string;
  className?: string;
};

/**
 * One count per visitor (hashed IP). Records on mount via POST /api/page-views.
 * Renders nothing only while the first request is in flight; then always shows a count.
 */
export function UniquePageViews({
  entityType,
  entityId,
  locale = "en-IN",
  className = "",
}: Props) {
  const [count, setCount] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const isTa = locale.toLowerCase().startsWith("ta");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/page-views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType, entityId }),
        });
        if (r.ok) {
          const data = (await r.json()) as { uniqueViews?: number };
          if (!cancelled && typeof data.uniqueViews === "number") {
            setCount(data.uniqueViews);
          }
        }
      } catch {
        /* leave count null → show 0 after ready */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [entityType, entityId]);

  if (!ready) {
    return (
      <p
        className={`text-xs text-[var(--muted)] ${className}`}
        aria-busy="true"
      >
        {isTa ? "பார்வைகள்…" : "Views…"}
      </p>
    );
  }

  const n = count ?? 0;
  const label = isTa
    ? `தனிப்பட்ட பார்வைகள்: ${n}`
    : `Unique page views: ${n}`;

  return (
    <p
      className={`text-xs text-[var(--muted)] ${className}`}
      data-unique-views={n}
    >
      {label}
    </p>
  );
}

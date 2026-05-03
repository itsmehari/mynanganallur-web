/**
 * Site-wide analytics event helper.
 *
 * One typed entry-point for every custom event so we have a single grep target
 * and a stable taxonomy across GA4 and Vercel Analytics. Events fired on the
 * server are best-effort logged; client events go through `window.gtag` and
 * `va.track` when present.
 *
 * Naming convention: snake_case verb phrases (`submission_success`,
 * `share_click`). Keep payloads small and PII-free.
 */
export type SiteEvent =
  | "submission_start"
  | "submission_success"
  | "submission_error"
  | "search_query"
  | "share_click"
  | "lead_submit"
  | "featured_upgrade_click"
  | "newsletter_signup"
  | "reaction_click";

export type EventProps = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    va?: (event: "event", name: string, props?: EventProps) => void;
  }
}

export function track(event: SiteEvent, props: EventProps = {}): void {
  const cleaned = sanitizeProps(props);

  if (typeof window !== "undefined") {
    try {
      window.gtag?.("event", event, cleaned);
    } catch {
      /* swallow — analytics must never break the UI */
    }
    try {
      window.va?.("event", event, cleaned);
    } catch {
      /* idem */
    }
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[track] ${event}`, cleaned);
  }
}

function sanitizeProps(props: EventProps): EventProps {
  const out: EventProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.length > 200) {
      out[key] = value.slice(0, 200);
      continue;
    }
    out[key] = value;
  }
  return out;
}

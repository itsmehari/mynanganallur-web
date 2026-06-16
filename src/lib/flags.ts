/**
 * Tiny feature-flag helper.
 *
 * Reads a comma-separated `NEXT_PUBLIC_FEATURE_FLAGS` env (e.g.
 * `search,newsletter`). Each phase ships behind a flag so we can
 * enable per-environment without redeploying.
 *
 * Note: `/submit/*` routes are not flag-gated — directory/job/event/property
 * submission forms are always public once deployed.
 *
 * Usage:
 *   import { isFlagOn } from "@/lib/flags";
 *   if (!isFlagOn("search")) notFound();
 *
 * Server and client safe — value is inlined at build time by Next.js.
 */
export type FeatureFlag =
  | "admin_queue"
  | "og_images"
  | "search"
  | "newsletter"
  | "weekly_digest"
  | "pwa"
  | "push"
  | "reactions"
  | "razorpay"
  | "ads_admin"
  | "ai_drafts"
  | "civic"
  | "tamil";

const RAW = process.env.NEXT_PUBLIC_FEATURE_FLAGS ?? "";

const ENABLED: ReadonlySet<FeatureFlag> = new Set(
  RAW.split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean) as FeatureFlag[],
);

export function isFlagOn(flag: FeatureFlag): boolean {
  return ENABLED.has(flag);
}

export function listEnabledFlags(): FeatureFlag[] {
  return [...ENABLED];
}

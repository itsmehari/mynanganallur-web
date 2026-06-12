import { getSiteUrl } from "@/lib/env";

export type OgKind =
  | "job"
  | "event"
  | "property"
  | "business"
  | "article"
  | "area"
  | "topic"
  | "community"
  | "default";

export function buildOgImageUrl(opts: {
  title: string;
  kind: OgKind;
  locality?: string | null;
}): string {
  const base = getSiteUrl();
  const params = new URLSearchParams({
    title: opts.title.slice(0, 140),
    kind: opts.kind,
  });
  if (opts.locality) params.set("locality", opts.locality.slice(0, 60));
  return `${base}/og?${params.toString()}`;
}

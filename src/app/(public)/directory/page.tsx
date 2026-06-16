import { permanentRedirect } from "next/navigation";
import { DirectoryHubView } from "@/components/listings/directory-hub-view";
import { resolveDirectoryTypeSlug } from "@/domains/directory";
import { LISTING_HUB_CONTENT } from "@/lib/listings/hub-content";
import { buildHubMetadata } from "@/lib/seo/hub-page-metadata";

export const revalidate = 120;

const HUB = LISTING_HUB_CONTENT.directory;

export const metadata = buildHubMetadata({
  path: HUB.path,
  title: HUB.metaTitle,
  description: HUB.metaDescription,
  keywords: HUB.keywords,
  ogKind: HUB.ogKind,
  ogTitle: HUB.ogTitle,
});

function redirectQueryToPath(
  type: string,
  sp: { q?: string; locality?: string },
): string {
  const qs = new URLSearchParams();
  if (sp.q?.trim()) qs.set("q", sp.q.trim());
  if (sp.locality?.trim()) qs.set("locality", sp.locality.trim());
  const suffix = qs.toString() ? `?${qs}` : "";
  return `/directory/${type}${suffix}`;
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locality?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const typeFromQuery = resolveDirectoryTypeSlug(sp.type ?? "");
  if (typeFromQuery) {
    permanentRedirect(redirectQueryToPath(typeFromQuery, sp));
  }

  return <DirectoryHubView typeFilter={null} searchParams={sp} />;
}

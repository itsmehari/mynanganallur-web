import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectoryHubView } from "@/components/listings/directory-hub-view";
import {
  DIRECTORY_TYPE_SLUGS,
  resolveDirectoryTypeSlug,
} from "@/domains/directory";
import { directoryTypeTitle } from "@/lib/listings/format";
import { buildHubMetadata } from "@/lib/seo/hub-page-metadata";

export const revalidate = 120;

type Props = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ q?: string; locality?: string }>;
};

export function generateStaticParams() {
  return DIRECTORY_TYPE_SLUGS.map((type) => ({ type }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const resolved = resolveDirectoryTypeSlug(type);
  if (!resolved) {
    return { title: "Directory" };
  }
  const label = directoryTypeTitle(resolved);
  return buildHubMetadata({
    path: `/directory/${resolved}`,
    title: `${label} · Nanganallur directory`,
    description: `${label} listings in the Nanganallur area directory on mynanganallur.in.`,
    ogKind: "business",
    ogTitle: `${label} · Nanganallur`,
  });
}

/** Vertical hub — `/directory/school`, etc. Canonical path matches sitemap `loc`. */
export default async function DirectoryTypeHubPage({ params, searchParams }: Props) {
  const { type } = await params;
  const resolved = resolveDirectoryTypeSlug(type);
  if (!resolved) {
    notFound();
  }
  const sp = await searchParams;
  return <DirectoryHubView typeFilter={resolved} searchParams={sp} />;
}

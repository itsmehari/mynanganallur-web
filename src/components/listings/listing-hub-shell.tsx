import type { ReactNode } from "react";
import { ListingBreadcrumb } from "@/components/listings/listing-breadcrumb";
import { ListingHubCrossLinks } from "@/components/listings/listing-hub-cross-links";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb-jsonld";

type Props = {
  breadcrumb: BreadcrumbItem[];
  eyebrow: string;
  h1: string;
  intro: string;
  hubPath: string;
  eyebrowClassName?: string;
  children?: ReactNode;
};

export function ListingHubShell({
  breadcrumb,
  eyebrow,
  h1,
  intro,
  hubPath,
  eyebrowClassName = "text-[var(--accent)]",
  children,
}: Props) {
  return (
    <>
      <ListingBreadcrumb items={breadcrumb} />
      <p className={`mt-6 text-sm font-medium ${eyebrowClassName}`}>{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
        {h1}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
        {intro}
      </p>
      <ListingHubCrossLinks currentPath={hubPath} />
      {children}
    </>
  );
}

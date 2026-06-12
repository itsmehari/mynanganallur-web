import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb-jsonld";

type Props = {
  items: BreadcrumbItem[];
};

export function ListingBreadcrumb({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted)]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.href + item.name} className="flex items-center gap-1.5">
              {idx > 0 ? <span aria-hidden>/</span> : null}
              {isLast ? (
                <span className="font-medium text-[var(--foreground)]">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-[var(--foreground)]">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

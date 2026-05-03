import type { FaqItem } from "@/lib/seo/faq-jsonld";
import { buildFaqPageJsonLd } from "@/lib/seo/faq-jsonld";

type Props = {
  items: FaqItem[] | null | undefined;
  pageUrl: string;
  heading?: string;
};

/**
 * Renders a visible FAQ accordion + injects FAQPage JSON-LD. No-op when
 * `items` is empty/missing so it's safe to drop on every detail page.
 *
 * Uses native `<details>` so it works without JS and stays accessible.
 */
export function FaqBlock({ items, pageUrl, heading = "Frequently asked" }: Props) {
  const list = (items ?? []).filter((it) => it?.q?.trim() && it?.a?.trim());
  if (list.length === 0) return null;

  const ld = buildFaqPageJsonLd(list, pageUrl);

  return (
    <section className="mt-12" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <h2
        id="faq-heading"
        className="text-lg font-semibold text-[var(--foreground)]"
      >
        {heading}
      </h2>
      <ul className="mt-4 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        {list.map((it) => (
          <li key={it.q}>
            <details className="group p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--foreground)] marker:hidden">
                <span className="inline-block group-open:hidden">▸ </span>
                <span className="hidden group-open:inline-block">▾ </span>
                {it.q}
              </summary>
              <div className="mt-2 text-sm leading-relaxed text-[var(--foreground)]">
                {it.a}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

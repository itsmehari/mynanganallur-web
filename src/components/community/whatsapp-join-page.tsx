import Link from "next/link";
import { FaqBlock } from "@/components/faq/faq-block";
import { WhatsappJoinCta } from "@/components/community/whatsapp-join-cta";
import { WhatsappStickyCta } from "@/components/community/whatsapp-sticky-cta";
import { ShareRow } from "@/components/share/share-row";
import {
  WHATSAPP_DISCLAIMER,
  WHATSAPP_FAQ,
  WHATSAPP_GEO_DIRECT_ANSWER,
  WHATSAPP_GEO_QUESTION,
  WHATSAPP_GUIDELINES,
  WHATSAPP_NEARBY_LOCALITIES,
  WHATSAPP_USE_CASES,
  WHATSAPP_WEBSITE_BENEFITS,
} from "@/lib/community/whatsapp-page-content";
import { WHATSAPP_PAGE_PATH } from "@/lib/community/whatsapp";
import { getSiteUrl } from "@/lib/env";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumb-jsonld";
import { buildWhatsappCommunityPageJsonLd } from "@/lib/seo/whatsapp-page-jsonld";

const PAGE_TITLE =
  "Join the My Nanganallur WhatsApp group — local community for Nanganallur & nearby Chennai neighbourhoods";

const META_DESCRIPTION =
  "Free WhatsApp community for Nanganallur, Madipakkam, Adambakkam, Pazhavanthangal and nearby areas. Local news, jobs, events, rentals, business leads and neighbourhood support. Join with one tap.";

const WEBSITE_LINKS = [
  { href: "/local-news", label: "Local news" },
  { href: "/local-events", label: "Events" },
  { href: "/jobs", label: "Jobs" },
  { href: "/properties", label: "Properties" },
  { href: "/directory", label: "Directory" },
  { href: "/submit", label: "Submit a listing" },
] as const;

export function WhatsappJoinPage() {
  const base = getSiteUrl();
  const pageUrl = `${base}${WHATSAPP_PAGE_PATH}`;
  const pageLd = buildWhatsappCommunityPageJsonLd({
    pageTitle: PAGE_TITLE,
    description: META_DESCRIPTION,
    geoDirectAnswer: WHATSAPP_GEO_DIRECT_ANSWER,
  });
  const crumbLd = buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Nanganallur WhatsApp group", href: WHATSAPP_PAGE_PATH },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <div className="mx-auto max-w-[1080px] px-4 py-12 pb-24 sm:px-6 sm:pb-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted)]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-[var(--foreground)]">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-[var(--foreground)]">
              Nanganallur WhatsApp group
            </li>
          </ol>
        </nav>

        <header className="mt-6">
          <p className="text-sm font-medium text-[var(--accent)]">
            Community · Nanganallur &amp; nearby
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Welcome to the My Nanganallur WhatsApp group
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--muted)]">
            This group brings together residents, businesses, professionals,
            students and well-wishers from{" "}
            <strong className="font-semibold text-[var(--foreground)]">
              Nanganallur and nearby areas
            </strong>
            . Our purpose is simple: stay connected, share useful local
            information, support neighbourhood businesses and help one another
            whenever possible.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <WhatsappJoinCta
              source="hero"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            />
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
            >
              Explore mynanganallur.in
            </Link>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Opens WhatsApp to request access to the group.
          </p>
        </header>

        <section
          className="mt-12 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,var(--accent)_4%)] p-6 sm:p-8"
          aria-labelledby="whatsapp-geo-heading"
        >
          <h2
            id="whatsapp-geo-heading"
            className="whatsapp-geo-question text-xl font-semibold tracking-tight text-[var(--foreground)]"
          >
            {WHATSAPP_GEO_QUESTION}
          </h2>
          <p className="whatsapp-geo-direct-answer mt-3 max-w-3xl text-base leading-relaxed text-[var(--foreground)]">
            {WHATSAPP_GEO_DIRECT_ANSWER}
          </p>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Serving neighbours across{" "}
            {WHATSAPP_NEARBY_LOCALITIES.join(", ")} and surrounding Chennai
            localities.
          </p>
        </section>

        <section className="mt-14" aria-labelledby="whatsapp-uses-heading">
          <h2
            id="whatsapp-uses-heading"
            className="text-2xl font-semibold tracking-tight text-[var(--foreground)]"
          >
            What you can use this group for
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            Practical, local posts that help everyday life in Nanganallur and
            nearby neighbourhoods.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {WHATSAPP_USE_CASES.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"
          aria-labelledby="whatsapp-website-heading"
        >
          <h2
            id="whatsapp-website-heading"
            className="text-2xl font-semibold tracking-tight text-[var(--foreground)]"
          >
            Our community website — mynanganallur.in
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
            My Nanganallur is being developed as an organised digital platform
            dedicated to Nanganallur and its surrounding neighbourhoods.
            Residents, businesses, employers, event organisers and service
            providers can use the website to:
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {WHATSAPP_WEBSITE_BENEFITS.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-[var(--foreground)]">
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
            Useful posts shared in this group may also be considered for
            publication on{" "}
            <Link href="/" className="font-semibold text-[var(--accent)]">
              www.mynanganallur.in
            </Link>
            , with the permission of the person concerned, so that the
            information can reach a wider local audience.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {WEBSITE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section
          id="guidelines"
          className="mt-14 scroll-mt-24"
          aria-labelledby="whatsapp-guidelines-heading"
        >
          <h2
            id="whatsapp-guidelines-heading"
            className="text-2xl font-semibold tracking-tight text-[var(--foreground)]"
          >
            Group guidelines
          </h2>
          <ol className="mt-6 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            {WHATSAPP_GUIDELINES.map((rule, idx) => (
              <li
                key={rule}
                className="flex gap-3 text-sm leading-relaxed text-[var(--foreground)]"
              >
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-xs font-bold text-[var(--accent)]"
                >
                  {idx + 1}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </section>

        <aside
          className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900"
          aria-labelledby="whatsapp-disclaimer-heading"
        >
          <h2 id="whatsapp-disclaimer-heading" className="sr-only">
            Important note
          </h2>
          <p className="font-semibold">Important note</p>
          <p className="mt-2">{WHATSAPP_DISCLAIMER}</p>
        </aside>

        <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,#059669_8%)] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-[var(--foreground)]">
              Ready to join?
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              One tap opens the WhatsApp invite for the My Nanganallur community
              group.
            </p>
          </div>
          <WhatsappJoinCta
            source="mid"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          />
        </div>

        <FaqBlock
          items={WHATSAPP_FAQ}
          pageUrl={pageUrl}
          heading="Frequently asked questions"
        />

        <section className="mt-12" aria-labelledby="whatsapp-share-heading">
          <h2
            id="whatsapp-share-heading"
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            Invite neighbours to the group
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            Share this page so friends, tenants, shopkeepers and colleagues in
            Nanganallur can find the group easily.
          </p>
          <ShareRow
            url={pageUrl}
            title="Join the My Nanganallur WhatsApp group — local news, jobs, events and neighbourhood support in Nanganallur, Chennai"
            channelLabel="whatsapp-community-page"
          />
        </section>

        <p className="mt-12 text-center text-sm text-[var(--muted)]">
          Let us work together to make Nanganallur more connected, informed,
          helpful and supportive.
        </p>
      </div>

      <WhatsappStickyCta />
    </>
  );
}

export { META_DESCRIPTION, PAGE_TITLE };

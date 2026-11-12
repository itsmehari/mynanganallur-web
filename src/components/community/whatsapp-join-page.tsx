import Link from "next/link";
import { FaqBlock } from "@/components/faq/faq-block";
import { WhatsappJoinCta } from "@/components/community/whatsapp-join-cta";
import { WhatsappStickyCta } from "@/components/community/whatsapp-sticky-cta";
import { ShareRow } from "@/components/share/share-row";
import {
  WHATSAPP_ALLOWED,
  WHATSAPP_BUSINESS_POLICY,
  WHATSAPP_DISCLAIMER,
  WHATSAPP_FAQ,
  WHATSAPP_GEO_DIRECT_ANSWER,
  WHATSAPP_GEO_QUESTION,
  WHATSAPP_NEARBY_LOCALITIES,
  WHATSAPP_NOT_ALLOWED,
  WHATSAPP_OBJECTIVE,
  WHATSAPP_PRINCIPLE,
  WHATSAPP_PURPOSE,
  WHATSAPP_RULES,
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

const FACTS = [
  { value: "10", label: "Clear group rules" },
  { value: "1", label: "Business promo a day" },
  { value: "3", label: "Formats: text, photo, poster" },
] as const;

const joinPill =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold text-[#062826] shadow-sm transition hover:bg-[#f3fffd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto";

const joinPillSolid =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#128C7E] px-6 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#0e7468] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E] sm:w-auto";

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

      <div className="mx-auto w-full min-w-0 max-w-[1120px] px-4 pb-28 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
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

        <section className="relative mt-5 overflow-hidden rounded-[1.75rem] bg-[#071c1c] px-5 py-10 text-white shadow-[0_28px_70px_rgba(7,28,28,0.28)] sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 100% 0%, rgba(62,201,192,0.28), transparent 55%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(196,92,58,0.22), transparent 50%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 top-10 hidden h-72 w-72 rounded-full border border-white/10 sm:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 top-20 hidden h-48 w-48 rounded-full border border-white/10 sm:block"
          />

          <div className="relative max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9ee8e1]">
              Nanganallur Community
            </p>
            <h1 className="mt-4 text-[2.05rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Welcome to the Nanganallur{" "}
              <span className="text-[#9ee8e1]">WhatsApp group</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {WHATSAPP_OBJECTIVE}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {WHATSAPP_PURPOSE.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsappJoinCta source="hero" className={joinPill}>
                Join group on WhatsApp
              </WhatsappJoinCta>
              <a
                href="#guidelines"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/35 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                Read the group rules
              </a>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/60">
              One tap opens WhatsApp so you can request access from the admins.
            </p>
          </div>
        </section>

        <section
          className="mt-5 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-8 text-center sm:px-10 sm:py-10"
          aria-label="Community principle"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
            Our community principle
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {WHATSAPP_PRINCIPLE}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Let us keep this group informative, organised and beneficial for
            every Nanganallur resident.
          </p>
        </section>

        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FACTS.map((fact) => (
            <li
              key={fact.label}
              className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-5"
            >
              <p className="text-3xl font-semibold tracking-tight text-[var(--accent)] sm:text-4xl">
                {fact.value}
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {fact.label}
              </p>
            </li>
          ))}
        </ul>

        <section
          className="mt-12 rounded-[1.75rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,var(--accent)_6%)] p-5 sm:p-8"
          aria-labelledby="whatsapp-geo-heading"
        >
          <h2
            id="whatsapp-geo-heading"
            className="whatsapp-geo-question text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
          >
            {WHATSAPP_GEO_QUESTION}
          </h2>
          <p className="whatsapp-geo-direct-answer mt-3 max-w-3xl text-base leading-relaxed text-[var(--foreground)]">
            {WHATSAPP_GEO_DIRECT_ANSWER}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {WHATSAPP_NEARBY_LOCALITIES.map((place) => (
              <li
                key={place}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]"
              >
                {place}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="whatsapp-uses-heading">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
            What belongs here
          </p>
          <h2
            id="whatsapp-uses-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl"
          >
            Useful posts for everyday{" "}
            <span className="text-[var(--accent)]">neighbourhood life</span>
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WHATSAPP_USE_CASES.map((item, idx) => (
              <li
                key={item.title}
                className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <p className="text-xs font-bold tracking-wide text-[var(--accent)]">
                  {String(idx + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-base font-semibold text-[var(--foreground)]">
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
          id="guidelines"
          className="mt-16 scroll-mt-24"
          aria-labelledby="whatsapp-guidelines-heading"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
            Group rules
          </p>
          <h2
            id="whatsapp-guidelines-heading"
            className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl"
          >
            WhatsApp group rules &amp;{" "}
            <span className="text-[var(--accent)]">guidelines</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            These rules keep the group useful for residents, local businesses
            and neighbourhood activities.
          </p>
          <ol className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {WHATSAPP_RULES.map((rule, idx) => (
              <li
                key={rule.title}
                className="min-w-0 rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] text-sm font-bold text-[var(--accent)]"
                  >
                    {idx + 1}
                  </span>
                  <h3 className="pt-1 text-base font-semibold leading-snug text-[var(--foreground)] sm:text-lg">
                    {rule.title}
                  </h3>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {rule.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-sm leading-relaxed text-[var(--foreground)]"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                      />
                      <span className="min-w-0">{point}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16" aria-labelledby="whatsapp-business-heading">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
            For local businesses
          </p>
          <h2
            id="whatsapp-business-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl"
          >
            Business posting policy
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#128C7E]">
                Allowed
              </h3>
              <ul className="mt-4 space-y-2.5">
                {WHATSAPP_ALLOWED.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm leading-relaxed text-[var(--foreground)]"
                  >
                    <span aria-hidden className="font-bold text-[#128C7E]">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--accent-warm)]">
                Not allowed
              </h3>
              <ul className="mt-4 space-y-2.5">
                {WHATSAPP_NOT_ALLOWED.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm leading-relaxed text-[var(--foreground)]"
                  >
                    <span aria-hidden className="font-bold text-[var(--accent-warm)]">
                      ✕
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <dl className="mt-3 divide-y divide-[var(--border)] overflow-hidden rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface)]">
            {WHATSAPP_BUSINESS_POLICY.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-6"
              >
                <dt className="text-xs font-bold uppercase tracking-wide text-[var(--accent)]">
                  {row.label}
                </dt>
                <dd className="text-sm leading-relaxed text-[var(--foreground)]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          className="mt-16 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8"
          aria-labelledby="whatsapp-website-heading"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
            MyNanganallur.in
          </p>
          <h2
            id="whatsapp-website-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl"
          >
            Connecting our neighbourhood
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            The website keeps important local information available for longer
            than a chat forward. Residents, businesses, employers and event
            organisers can:
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {WHATSAPP_WEBSITE_BENEFITS.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 rounded-2xl bg-[color-mix(in_srgb,var(--accent)_7%,var(--background))] px-4 py-3 text-sm text-[var(--foreground)]"
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
            Useful posts from the group may be considered for{" "}
            <Link href="/" className="font-semibold text-[var(--accent)]">
              mynanganallur.in
            </Link>{" "}
            with the permission of the person who shared them.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {WEBSITE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-10 items-center rounded-full border border-[var(--border)] bg-[var(--background)] px-3.5 text-xs font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <aside
          className="mt-8 rounded-[1.35rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--accent-warm)_10%,var(--surface))] px-5 py-5 text-sm leading-relaxed text-[var(--foreground)]"
          aria-labelledby="whatsapp-disclaimer-heading"
        >
          <h2
            id="whatsapp-disclaimer-heading"
            className="text-sm font-semibold"
          >
            Important note
          </h2>
          <p className="mt-2 text-[var(--muted)]">{WHATSAPP_DISCLAIMER}</p>
        </aside>

        <section className="relative mt-8 overflow-hidden rounded-[1.75rem] bg-[#071c1c] px-5 py-8 text-white sm:px-10 sm:py-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 100% 0%, rgba(62,201,192,0.25), transparent 55%)",
            }}
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xl font-semibold tracking-tight sm:text-2xl">
                Ready to join the neighbourhood?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Inform. Connect. Support. Grow. MyNanganallur.in — connecting
                our neighbourhood.
              </p>
            </div>
            <WhatsappJoinCta source="mid" className={joinPillSolid} />
          </div>
        </section>

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
            Nanganallur can find the group and the rules in one place.
          </p>
          <ShareRow
            url={pageUrl}
            title="Join the My Nanganallur WhatsApp group — local news, jobs, events and neighbourhood support in Nanganallur, Chennai"
            channelLabel="whatsapp-community-page"
          />
        </section>
      </div>

      <WhatsappStickyCta />
    </>
  );
}

export { META_DESCRIPTION, PAGE_TITLE };

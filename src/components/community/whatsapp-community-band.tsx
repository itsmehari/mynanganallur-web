import Link from "next/link";
import { WhatsappJoinCta } from "@/components/community/whatsapp-join-cta";
import { WHATSAPP_PAGE_PATH } from "@/lib/community/whatsapp";

export { WHATSAPP_COMMUNITY_INVITE_URL } from "@/lib/community/whatsapp";

const HIGHLIGHTS = [
  "Neighbourhood updates, jobs, events, and property leads from residents.",
  "Civic alerts, Metro, and ward news when it affects daily life here.",
  "Local recommendations — schools, clinics, shops, and weekend plans.",
] as const;

export function WhatsappCommunityBand() {
  return (
    <section
      aria-labelledby="whatsapp-community-heading"
      className="border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--accent)_8%)]"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:p-8">
          <div>
            <p className="text-sm font-medium text-[var(--accent)]">Community</p>
            <h2
              id="whatsapp-community-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl"
            >
              Join our WhatsApp group
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              My Nanganallur is a local community space for residents, friends,
              and neighbours around Nanganallur and nearby belts. Get practical
              updates in one place instead of chasing scattered forwards.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-[var(--foreground)]">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[var(--muted)]">
              Be respectful, avoid spam, and verify important claims before you
              act on them.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:items-start lg:items-end">
            <WhatsappJoinCta
              source="band"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            />
            <Link
              href={WHATSAPP_PAGE_PATH}
              className="text-center text-sm font-semibold text-[var(--accent)] hover:underline lg:text-right"
            >
              Guidelines &amp; full details →
            </Link>
            <p className="text-xs text-[var(--muted)] lg:text-right">
              Opens WhatsApp to request access to the group.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

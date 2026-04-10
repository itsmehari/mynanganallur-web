import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { homeStats } from "@/lib/home-mock";

const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

function SocialIconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function SocialIconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function SocialIconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const forest = "#1a2a24";
const lime = "#76c043";
const gold = "#f5d442";

/** Nanganallur Anjaneyar Temple — local landmark (Cottage9 asset). */
const HERO_IMAGE_SRC =
  "https://c9admin.cottage9.com/uploads/5581/nanganallur-anjaneya.jpg";

export function HomeHero() {
  return (
    <section
      className={`${poppins.className} relative w-full overflow-hidden bg-[#0a1210]`}
      aria-labelledby="home-hero-heading"
    >
      <div className="relative mx-auto grid max-w-[1280px] lg:grid-cols-[1fr_1.08fr] lg:min-h-[min(85vh,620px)]">
        {/* Diagonal accent strips (desktop) — lime / deep green */}
        <div
          className="pointer-events-none absolute inset-y-0 right-[42%] z-20 hidden w-[120px] translate-x-1/2 lg:block"
          aria-hidden
        >
          <div
            className="absolute inset-y-0 left-0 w-full opacity-95"
            style={{
              background: "#2d4a38",
              clipPath: "polygon(35% 0, 100% 0, 65% 100%, 0% 100%)",
            }}
          />
          <div
            className="absolute inset-y-0 left-[18%] w-[55%]"
            style={{
              background: lime,
              clipPath: "polygon(40% 0, 100% 0, 60% 100%, 0% 100%)",
            }}
          />
        </div>

        {/* Left: copy + CTAs */}
        <div
          className="relative z-30 order-2 flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-14 lg:order-1 lg:px-10 lg:py-16 lg:pr-14"
          style={{
            background: `linear-gradient(168deg, #050a08 0%, ${forest} 42%, #152520 100%)`,
          }}
        >
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              <span className="text-white">mynanganallur</span>
              <span style={{ color: gold }}>.in</span>
            </p>

            <h1
              id="home-hero-heading"
              className="mt-5 max-w-[14ch] text-[clamp(2.1rem,4.8vw,3.5rem)] font-bold leading-[1.06] tracking-tight"
              style={{ color: lime }}
            >
              Nanganallur local life.
            </h1>
            <p
              className="mt-3 text-base font-light sm:text-lg"
              style={{ color: gold }}
            >
              Your neighbourhood, your way
            </p>

            <div className="mt-5 flex gap-2" aria-hidden>
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: lime }} />
              <span className="h-2 w-2 shrink-0 rounded-full opacity-80" style={{ background: lime }} />
              <span className="h-2 w-2 shrink-0 rounded-full opacity-55" style={{ background: lime }} />
            </div>

            <p className="mt-7 max-w-lg text-sm leading-relaxed text-white/88 sm:text-[15px]">
              Jobs, civic stories, events, and neighbourhood services in one place — built for
              residents and everyone who passes through Nanganallur every day.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/jobs"
                className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold text-[#0a1210] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: lime }}
              >
                Search jobs
              </Link>
              <Link
                href="/local-news"
                className="inline-flex items-center rounded-full border-2 border-white/35 bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Read local news
              </Link>
            </div>

            <div
              className="mt-10 inline-flex max-w-full flex-wrap items-center gap-3 rounded-full py-2 pl-5 pr-3"
              style={{ background: lime }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0a1210]">
                Follow us
              </span>
              <span className="hidden h-5 w-px bg-[#0a1210]/25 sm:block" aria-hidden />
              <div className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a1210]/15 text-[#0a1210] transition hover:bg-[#0a1210]/25 focus-visible:ring-2 focus-visible:ring-[#0a1210] focus-visible:ring-offset-2 focus-visible:ring-offset-[#76c043]"
                  aria-label="Facebook"
                >
                  <SocialIconFacebook className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a1210]/15 text-[#0a1210] transition hover:bg-[#0a1210]/25 focus-visible:ring-2 focus-visible:ring-[#0a1210] focus-visible:ring-offset-2 focus-visible:ring-offset-[#76c043]"
                  aria-label="Instagram"
                >
                  <SocialIconInstagram className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a1210]/15 text-[#0a1210] transition hover:bg-[#0a1210]/25 focus-visible:ring-2 focus-visible:ring-[#0a1210] focus-visible:ring-offset-2 focus-visible:ring-offset-[#76c043]"
                  aria-label="X (Twitter)"
                >
                  <SocialIconX className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <p className="mt-4 text-xs text-white/45">Mobile apps — coming soon</p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
              <div>
                <p className="text-xl font-bold tabular-nums text-white">{homeStats.jobsLive}K+</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  Openings
                </p>
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums text-white">4.9</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  Trust
                </p>
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums text-white">98%</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  Relevance
                </p>
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums text-white">{homeStats.eventsWeek}K+</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  Alerts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: hero image */}
        <div className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-[420px] order-1 lg:order-2">
          <Image
            src={HERO_IMAGE_SRC}
            alt="Lord Hanuman at Nanganallur Anjaneyar Temple, garlanded — a landmark of the neighbourhood"
            fill
            priority
            className="object-cover object-[center_25%]"
            sizes="(max-width: 1024px) 100vw, 52vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#0a1210]/80 via-[#1a2a24]/25 to-transparent lg:from-[#1a2a24]/65"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

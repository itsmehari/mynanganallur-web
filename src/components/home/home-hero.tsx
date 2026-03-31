import Link from "next/link";
import Image from "next/image";
import { homeStats } from "@/lib/home-mock";
function AppPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[11px] font-semibold text-[var(--muted)]">
      {label}
    </span>
  );
}

export function HomeHero() {
  const anjaneyaImg =
    "https://c9admin.cottage9.com/uploads/5581/nanganallur-anjaneya.jpg";
  const streetsImg =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Streets_in_Nanganallur%2CChennai.jpg/1280px-Streets_in_Nanganallur%2CChennai.jpg";

  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_28px_70px_-36px_color-mix(in_srgb,var(--foreground)_25%,transparent)] sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted)]">
            Local discovery
          </p>
          <h1 className="mt-4 max-w-[16ch] text-[clamp(2rem,4.5vw,3.35rem)] font-bold leading-[1.05] tracking-tight text-[var(--foreground)]">
            Uncover new opportunities across Nanganallur
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Jobs, civic stories, events, and local services in one place.
            Designed for residents and daily commuters.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/jobs"
              className="inline-flex items-center rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)]"
            >
              Search jobs
            </Link>
            <Link
              href="/local-news"
              className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)]"
            >
              Read local news
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <AppPill label="App Store (soon)" />
            <AppPill label="Google Play (soon)" />
          </div>
        </div>

        <div className="relative min-h-[300px] overflow-hidden rounded-[1.6rem] p-4 sm:min-h-[360px]">
          <div className="absolute inset-0">
            <Image
              src={streetsImg}
              alt=""
              fill
              priority={false}
              className="object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(11,15,26,0.15)_0%,rgba(11,15,26,0.55)_70%,rgba(11,15,26,0.8)_100%)]" />
          </div>

          <div className="absolute left-1/2 top-1/2 h-[250px] w-[170px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[999px] bg-[var(--surface)] ring-4 ring-[color-mix(in_srgb,var(--surface)_84%,transparent)] sm:h-[290px] sm:w-[200px]">
            <div className="absolute inset-0">
              <Image
                src={anjaneyaImg}
                alt="Anjaneya"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_55%)]" />
          </div>

          <div className="absolute right-4 top-5 h-20 w-20 overflow-hidden rounded-full bg-[var(--surface)] ring-4 ring-[color-mix(in_srgb,var(--surface)_86%,transparent)]">
            <div className="h-full w-full bg-[linear-gradient(160deg,#ffd9d9_0%,#ffe8c9_100%)]" />
          </div>
          <div className="absolute left-4 top-8 h-14 w-14 overflow-hidden rounded-full bg-[var(--surface)] ring-4 ring-[color-mix(in_srgb,var(--surface)_86%,transparent)]">
            <div className="h-full w-full bg-[linear-gradient(160deg,#d4f3ff_0%,#dfffd6_100%)]" />
          </div>

          <div className="absolute bottom-5 right-4 w-[190px] rounded-2xl bg-[color-mix(in_srgb,var(--foreground)_88%,#111)] p-4 text-white shadow-xl">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-lg font-bold">{homeStats.jobsLive}K+</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/65">
                  Openings
                </p>
              </div>
              <div>
                <p className="text-lg font-bold">4.9</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/65">
                  Trust
                </p>
              </div>
              <div>
                <p className="text-lg font-bold">98%</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/65">
                  Relevance
                </p>
              </div>
              <div>
                <p className="text-lg font-bold">{homeStats.eventsWeek}K+</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/65">
                  Alerts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

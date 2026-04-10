import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { listOpenJobsForSite } from "@/domains/jobs";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "Jobs for Nanganallur-area employers — listings on mynanganallur.in with detail pages. Confirm the JD on the employer site before you apply.",
};

function salaryLine(job: {
  salaryDisclosed: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
}): string | null {
  if (!job.salaryDisclosed) return null;
  if (job.salaryMin != null && job.salaryMax != null) {
    return `₹${job.salaryMin.toLocaleString("en-IN")}–₹${job.salaryMax.toLocaleString("en-IN")} (indicative)`;
  }
  if (job.salaryMin != null) {
    return `From ₹${job.salaryMin.toLocaleString("en-IN")} (indicative)`;
  }
  return null;
}

export default async function JobsPage() {
  let rows: Awaited<ReturnType<typeof listOpenJobsForSite>> = [];
  try {
    rows = await listOpenJobsForSite(80);
  } catch {
    /* DATABASE_URL unset */
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
      <p className="text-sm font-medium text-[var(--accent)]">Jobs</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Work near Nanganallur
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Open roles indexed for the city site. Each card links to a full page with
        structured data for search. Always verify compensation and requirements
        with the employer.
      </p>

      {rows.length === 0 ? (
        <p className="mt-10 max-w-xl text-sm text-[var(--muted)]">
          No open listings yet. Run{" "}
          <code className="rounded bg-[var(--surface)] px-1 text-xs">
            npm run db:seed:jobs
          </code>{" "}
          after seeding the city, or add rows via your data pipeline.
        </p>
      ) : (
        <ul className="mt-10 space-y-4">
          {rows.map(({ job, employer }) => {
            const sal = salaryLine(job);
            return (
              <li
                key={job.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-sm"
              >
                <Link
                  href={`/jobs/${job.slug}`}
                  className="block text-[var(--foreground)] transition hover:text-[var(--accent)]"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{job.title}</span>
                    {job.featured ? (
                      <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                        Featured
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    {employer.name}
                    {job.locationLabel ? ` · ${job.locationLabel}` : ""}
                    {job.remotePolicy !== "onsite"
                      ? ` · ${job.remotePolicy}`
                      : ""}
                  </span>
                  {sal ? (
                    <span className="mt-1 block text-xs font-medium text-[var(--accent)]">
                      {sal}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <AdSlot
        slotId="jobs-index-mid"
        size="728x90"
        seed={buildRotationSeed("/jobs", "jobs-index-mid")}
        className="mt-10 max-w-full"
      />
      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-jobs"
        className="mt-10 max-w-xl"
      />
      <Link
        href="/"
        className="mt-8 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}

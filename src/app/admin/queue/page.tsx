import { and, desc, eq, or } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb } from "@/db/client";
import {
  articles,
  directoryEntries,
  events,
  jobPostings,
  propertyListings,
} from "@/db/schema";
import { approveAction, rejectAction } from "./actions";

export const dynamic = "force-dynamic";

type QueueRow = {
  entity: "article" | "event" | "job" | "property" | "directory";
  id: string;
  title: string;
  submittedBy: string | null;
  submittedAt: Date | null;
  source: string;
  status: string;
};

async function loadQueue(): Promise<QueueRow[]> {
  const db = getDb();
  const out: QueueRow[] = [];

  const arts = await db
    .select({
      id: articles.id,
      title: articles.title,
      status: articles.status,
      source: articles.source,
      submittedByName: articles.submittedByName,
      submittedByEmail: articles.submittedByEmail,
      submittedAt: articles.submittedAt,
      createdAt: articles.createdAt,
    })
    .from(articles)
    .where(eq(articles.status, "draft"))
    .orderBy(desc(articles.createdAt))
    .limit(100);
  for (const a of arts) {
    out.push({
      entity: "article",
      id: a.id,
      title: a.title,
      submittedBy: a.submittedByEmail ?? a.submittedByName,
      submittedAt: a.submittedAt ?? a.createdAt,
      source: a.source,
      status: a.status,
    });
  }

  const evs = await db
    .select({
      id: events.id,
      title: events.title,
      status: events.status,
      source: events.source,
      submittedByName: events.submittedByName,
      submittedByEmail: events.submittedByEmail,
      submittedAt: events.submittedAt,
      createdAt: events.createdAt,
    })
    .from(events)
    .where(eq(events.status, "draft"))
    .orderBy(desc(events.createdAt))
    .limit(100);
  for (const e of evs) {
    out.push({
      entity: "event",
      id: e.id,
      title: e.title,
      submittedBy: e.submittedByEmail ?? e.submittedByName,
      submittedAt: e.submittedAt ?? e.createdAt,
      source: e.source,
      status: e.status,
    });
  }

  const js = await db
    .select({
      id: jobPostings.id,
      title: jobPostings.title,
      status: jobPostings.status,
      source: jobPostings.source,
      submittedByName: jobPostings.submittedByName,
      submittedByEmail: jobPostings.submittedByEmail,
      submittedAt: jobPostings.submittedAt,
      createdAt: jobPostings.createdAt,
    })
    .from(jobPostings)
    .where(eq(jobPostings.status, "draft"))
    .orderBy(desc(jobPostings.createdAt))
    .limit(100);
  for (const j of js) {
    out.push({
      entity: "job",
      id: j.id,
      title: j.title,
      submittedBy: j.submittedByEmail ?? j.submittedByName,
      submittedAt: j.submittedAt ?? j.createdAt,
      source: j.source,
      status: j.status,
    });
  }

  const ps = await db
    .select({
      id: propertyListings.id,
      title: propertyListings.title,
      status: propertyListings.status,
      source: propertyListings.source,
      submittedByName: propertyListings.submittedByName,
      submittedByEmail: propertyListings.submittedByEmail,
      submittedAt: propertyListings.submittedAt,
      createdAt: propertyListings.createdAt,
    })
    .from(propertyListings)
    .where(eq(propertyListings.status, "draft"))
    .orderBy(desc(propertyListings.createdAt))
    .limit(100);
  for (const p of ps) {
    out.push({
      entity: "property",
      id: p.id,
      title: p.title,
      submittedBy: p.submittedByEmail ?? p.submittedByName,
      submittedAt: p.submittedAt ?? p.createdAt,
      source: p.source,
      status: p.status,
    });
  }

  const ds = await db
    .select({
      id: directoryEntries.id,
      title: directoryEntries.name,
      verified: directoryEntries.verified,
      source: directoryEntries.source,
      submittedByName: directoryEntries.submittedByName,
      submittedByEmail: directoryEntries.submittedByEmail,
      submittedAt: directoryEntries.submittedAt,
      createdAt: directoryEntries.createdAt,
    })
    .from(directoryEntries)
    .where(
      and(
        eq(directoryEntries.verified, false),
        or(
          eq(directoryEntries.source, "web"),
          eq(directoryEntries.source, "admin"),
        ),
      ),
    )
    .orderBy(desc(directoryEntries.createdAt))
    .limit(100);
  for (const d of ds) {
    if (d.source !== "web") continue; // only show user-submitted dir entries
    out.push({
      entity: "directory",
      id: d.id,
      title: d.title,
      submittedBy: d.submittedByEmail ?? d.submittedByName,
      submittedAt: d.submittedAt ?? d.createdAt,
      source: d.source,
      status: d.verified ? "verified" : "pending",
    });
  }

  return out.sort(
    (a, b) =>
      (b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0),
  );
}

const ENTITY_LABEL: Record<QueueRow["entity"], string> = {
  article: "Article",
  event: "Event",
  job: "Job",
  property: "Property",
  directory: "Directory",
};

const ENTITY_EDIT: Record<QueueRow["entity"], (id: string) => string> = {
  article: (id) => `/admin/articles/${id}`,
  event: (id) => `/admin/events/${id}`,
  job: (id) => `/admin/jobs/${id}`,
  property: (id) => `/admin/properties/${id}`,
  directory: (id) => `/admin/directory/${id}`,
};

export default async function ModerationQueue({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "admin" && role !== "editor") {
    redirect("/admin");
  }

  const sp = await searchParams;
  const filter = sp.type;
  const all = await loadQueue();
  const rows = filter ? all.filter((r) => r.entity === filter) : all;

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Moderation queue
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {all.length} drafts waiting · approve to publish + revalidate
            relevant pages.
          </p>
        </div>
        <nav aria-label="Filter queue" className="flex flex-wrap gap-2 text-xs">
          <FilterChip current={filter} value={undefined} label={`All (${all.length})`} />
          {(["article", "event", "job", "property", "directory"] as const).map((t) => (
            <FilterChip
              key={t}
              current={filter}
              value={t}
              label={`${ENTITY_LABEL[t]} (${all.filter((r) => r.entity === t).length})`}
            />
          ))}
        </nav>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          Nothing to review. Lovely.
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li
              key={`${r.entity}-${r.id}`}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    {ENTITY_LABEL[r.entity]} · {r.source}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {r.title}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {r.submittedBy ?? "(no submitter info)"} ·{" "}
                    {r.submittedAt
                      ? r.submittedAt.toLocaleString("en-IN")
                      : "—"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={ENTITY_EDIT[r.entity](r.id)}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-800 hover:border-zinc-500 dark:border-zinc-600 dark:text-zinc-200"
                  >
                    Edit
                  </Link>
                  <form action={approveAction}>
                    <input type="hidden" name="entity" value={r.entity} />
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectAction} className="flex items-center gap-2">
                    <input type="hidden" name="entity" value={r.entity} />
                    <input type="hidden" name="id" value={r.id} />
                    <input
                      type="text"
                      name="reason"
                      placeholder="Reason (optional)"
                      className="w-32 rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-600 dark:bg-zinc-800"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FilterChip({
  current,
  value,
  label,
}: {
  current?: string;
  value?: string;
  label: string;
}) {
  const isOn =
    (current ?? undefined) === (value ?? undefined) ||
    (!current && !value);
  return (
    <Link
      href={value ? `/admin/queue?type=${value}` : `/admin/queue`}
      className={`rounded-full border px-3 py-1 ${
        isOn
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-200 dark:bg-zinc-200 dark:text-zinc-900"
          : "border-zinc-300 text-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
      }`}
    >
      {label}
    </Link>
  );
}

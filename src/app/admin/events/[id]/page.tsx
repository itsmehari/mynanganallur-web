import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb } from "@/db/client";
import { events } from "@/db/schema";
import {
  GenericEditor,
  type EditorField,
} from "@/app/admin/(entity)/generic-editor";

export const dynamic = "force-dynamic";

function fmtIst(d: Date | null): string {
  if (!d) return "";
  const offset = 5.5 * 60 * 60 * 1000;
  const local = new Date(d.getTime() + offset);
  return local.toISOString().slice(0, 16);
}

export default async function EditEvent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin" && session?.user?.role !== "editor") {
    redirect("/admin");
  }
  const { id } = await params;
  const db = getDb();
  const [row] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!row) notFound();

  const fields: EditorField[] = [
    { kind: "text", name: "title", label: "Title", defaultValue: row.title, required: true },
    { kind: "text", name: "slug", label: "Slug", defaultValue: row.slug, required: true },
    {
      kind: "textarea",
      name: "description",
      label: "Description (markdown)",
      defaultValue: row.description,
      rows: 12,
    },
    { kind: "datetime", name: "startsAt", label: "Starts at (IST)", defaultValue: fmtIst(row.startsAt) },
    { kind: "datetime", name: "endsAt", label: "Ends at (IST)", defaultValue: fmtIst(row.endsAt) },
    { kind: "checkbox", name: "allDay", label: "All-day", defaultChecked: row.allDay },
    { kind: "text", name: "venueName", label: "Venue", defaultValue: row.venueName },
    { kind: "text", name: "venueAddress", label: "Address", defaultValue: row.venueAddress },
    { kind: "text", name: "localityLabel", label: "Locality", defaultValue: row.localityLabel },
    { kind: "text", name: "heroImageUrl", label: "Hero image URL", defaultValue: row.heroImageUrl },
    {
      kind: "select",
      name: "status",
      label: "Status",
      defaultValue: row.status,
      options: [
        { value: "draft", label: "Draft" },
        { value: "scheduled", label: "Scheduled" },
        { value: "cancelled", label: "Cancelled" },
        { value: "completed", label: "Completed" },
      ],
    },
    { kind: "checkbox", name: "featured", label: "Featured", defaultChecked: row.featured },
  ];

  return (
    <section className="space-y-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Edit event
        </p>
        <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {row.title}
        </h1>
      </header>
      <GenericEditor
        entity="event"
        id={row.id}
        fields={fields}
        detailHref={`/local-events/${row.slug}`}
      />
    </section>
  );
}

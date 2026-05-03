import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb } from "@/db/client";
import { directoryEntries } from "@/db/schema";
import {
  GenericEditor,
  type EditorField,
} from "@/app/admin/(entity)/generic-editor";

export const dynamic = "force-dynamic";

export default async function EditDirectory({
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
  const [row] = await db
    .select()
    .from(directoryEntries)
    .where(eq(directoryEntries.id, id))
    .limit(1);
  if (!row) notFound();

  const fields: EditorField[] = [
    { kind: "text", name: "title", label: "Name", defaultValue: row.name, required: true },
    { kind: "text", name: "slug", label: "Slug", defaultValue: row.slug, required: true },
    { kind: "text", name: "address", label: "Address", defaultValue: row.address },
    { kind: "text", name: "localityLabel", label: "Locality", defaultValue: row.localityLabel },
    { kind: "text", name: "phone", label: "Phone", defaultValue: row.phone },
    { kind: "text", name: "websiteUrl", label: "Website URL", defaultValue: row.websiteUrl },
    { kind: "text", name: "hoursSummary", label: "Hours summary", defaultValue: row.hoursSummary },
    { kind: "text", name: "heroImageUrl", label: "Hero image URL", defaultValue: row.heroImageUrl },
    { kind: "checkbox", name: "verified", label: "Verified", defaultChecked: row.verified },
    { kind: "checkbox", name: "featured", label: "Featured", defaultChecked: row.featured },
  ];

  return (
    <section className="space-y-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Edit directory entry
        </p>
        <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {row.name}
        </h1>
      </header>
      <GenericEditor
        entity="directory"
        id={row.id}
        fields={fields}
        detailHref={`/directory/${row.type}/${row.slug}`}
      />
    </section>
  );
}

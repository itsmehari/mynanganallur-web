import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb } from "@/db/client";
import { propertyListings } from "@/db/schema";
import {
  GenericEditor,
  type EditorField,
} from "@/app/admin/(entity)/generic-editor";

export const dynamic = "force-dynamic";

export default async function EditProperty({
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
    .from(propertyListings)
    .where(eq(propertyListings.id, id))
    .limit(1);
  if (!row) notFound();

  const fields: EditorField[] = [
    { kind: "text", name: "title", label: "Title", defaultValue: row.title, required: true },
    { kind: "text", name: "slug", label: "Slug", defaultValue: row.slug, required: true },
    { kind: "text", name: "summary", label: "Summary", defaultValue: row.summary },
    { kind: "textarea", name: "body", label: "Body (markdown)", defaultValue: row.body, rows: 16 },
    { kind: "text", name: "localityLabel", label: "Locality", defaultValue: row.localityLabel },
    { kind: "text", name: "landmarkNote", label: "Landmark", defaultValue: row.landmarkNote },
    { kind: "text", name: "contactPhone", label: "Contact phone", defaultValue: row.contactPhone },
    { kind: "text", name: "contactEmail", label: "Contact email", defaultValue: row.contactEmail },
    { kind: "text", name: "heroImageUrl", label: "Hero image URL", defaultValue: row.heroImageUrl },
    {
      kind: "select",
      name: "status",
      label: "Status",
      defaultValue: row.status,
      options: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "archived", label: "Archived" },
      ],
    },
    { kind: "checkbox", name: "featured", label: "Featured", defaultChecked: row.featured },
  ];

  return (
    <section className="space-y-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Edit property
        </p>
        <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {row.title}
        </h1>
      </header>
      <GenericEditor
        entity="property"
        id={row.id}
        fields={fields}
        detailHref={`/properties/${row.slug}`}
      />
    </section>
  );
}

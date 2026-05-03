import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb } from "@/db/client";
import { articles } from "@/db/schema";
import {
  GenericEditor,
  type EditorField,
} from "@/app/admin/(entity)/generic-editor";

export const dynamic = "force-dynamic";

export default async function EditArticle({
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
  const [row] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  if (!row) notFound();

  const fields: EditorField[] = [
    { kind: "text", name: "title", label: "Title", defaultValue: row.title, required: true },
    { kind: "text", name: "slug", label: "Slug", defaultValue: row.slug, required: true },
    { kind: "text", name: "dek", label: "Dek (subtitle)", defaultValue: row.dek },
    { kind: "text", name: "summary", label: "Summary", defaultValue: row.summary },
    { kind: "text", name: "category", label: "Category", defaultValue: row.category },
    { kind: "text", name: "heroImageUrl", label: "Hero image URL", defaultValue: row.heroImageUrl },
    { kind: "textarea", name: "body", label: "Body (markdown)", defaultValue: row.body, rows: 20 },
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
          Edit article
        </p>
        <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {row.title}
        </h1>
      </header>
      <GenericEditor
        entity="article"
        id={row.id}
        fields={fields}
        detailHref={`/local-news/${row.slug}`}
      />
    </section>
  );
}

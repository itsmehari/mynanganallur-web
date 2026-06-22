import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb } from "@/db/client";
import { openToWorkProfiles } from "@/db/schema";
import {
  GenericEditor,
  type EditorField,
} from "@/app/admin/(entity)/generic-editor";

export const dynamic = "force-dynamic";

export default async function EditOpenToWorkProfile({
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
    .from(openToWorkProfiles)
    .where(eq(openToWorkProfiles.id, id))
    .limit(1);
  if (!row) notFound();

  const fields: EditorField[] = [
    {
      kind: "text",
      name: "displayName",
      label: "Display name",
      defaultValue: row.displayName,
      required: true,
    },
    { kind: "text", name: "slug", label: "Slug", defaultValue: row.slug, required: true },
    {
      kind: "text",
      name: "headline",
      label: "Headline",
      defaultValue: row.headline,
      required: true,
    },
    {
      kind: "textarea",
      name: "body",
      label: "Body (markdown)",
      defaultValue: row.body,
      rows: 16,
    },
    {
      kind: "text",
      name: "domainsLabel",
      label: "Domains / industries",
      defaultValue: row.domainsLabel,
    },
    {
      kind: "text",
      name: "preferredLocations",
      label: "Preferred locations",
      defaultValue: row.preferredLocations,
    },
    {
      kind: "text",
      name: "workModePreferences",
      label: "Work modes (comma-separated: remote, hybrid, onsite)",
      defaultValue: row.workModePreferences,
    },
    {
      kind: "text",
      name: "yearsExperience",
      label: "Years experience",
      defaultValue: row.yearsExperience?.toString() ?? "",
    },
    {
      kind: "text",
      name: "contactEmail",
      label: "Contact email",
      defaultValue: row.contactEmail,
    },
    {
      kind: "text",
      name: "contactPhone",
      label: "Contact phone",
      defaultValue: row.contactPhone,
    },
    {
      kind: "text",
      name: "linkedInUrl",
      label: "LinkedIn URL",
      defaultValue: row.linkedInUrl,
    },
    {
      kind: "text",
      name: "facebookUrl",
      label: "Facebook profile URL",
      defaultValue: row.facebookUrl,
    },
    {
      kind: "text",
      name: "sourcePostUrl",
      label: "Original post URL",
      defaultValue: row.sourcePostUrl,
    },
    {
      kind: "text",
      name: "resumeUrl",
      label: "Resume URL",
      defaultValue: row.resumeUrl,
    },
    {
      kind: "select",
      name: "status",
      label: "Status",
      defaultValue: row.status,
      options: [
        { value: "draft", label: "Draft" },
        { value: "open", label: "Open (published)" },
        { value: "closed", label: "Closed" },
      ],
    },
    { kind: "checkbox", name: "featured", label: "Featured", defaultChecked: row.featured },
  ];

  return (
    <section className="space-y-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Edit Open to Work profile
        </p>
        <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {row.displayName}
        </h1>
      </header>
      <GenericEditor
        entity="open_to_work"
        id={row.id}
        fields={fields}
        detailHref={`/careers/open-to-work/${row.slug}`}
      />
    </section>
  );
}

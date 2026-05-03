"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db/client";
import {
  articles,
  directoryEntries,
  events,
  jobPostings,
  propertyListings,
} from "@/db/schema";
import { recordAudit } from "@/lib/admin/audit";
import { requireStaff } from "@/lib/admin/role-guard";
import { revalidateForEntity } from "@/lib/admin/revalidate";
import { pingGoogleSitemaps } from "@/lib/seo/gsc-ping";

type Entity = "article" | "event" | "job" | "property" | "directory";

function statusForApprove(entity: Entity): string {
  switch (entity) {
    case "event":
      return "scheduled";
    case "job":
      return "open";
    case "article":
    case "property":
      return "published";
    case "directory":
    default:
      return "open"; // directory has no status enum; we just mark approved via verified=true downstream
  }
}

export async function approveAction(formData: FormData) {
  const staff = await requireStaff();
  const entity = String(formData.get("entity")) as Entity;
  const id = String(formData.get("id"));
  if (!entity || !id) return;

  const db = getDb();
  const newStatus = statusForApprove(entity);

  let slug: string | null = null;
  switch (entity) {
    case "article": {
      const [row] = await db
        .update(articles)
        .set({
          status: "published",
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(articles.id, id))
        .returning({ slug: articles.slug });
      slug = row?.slug ?? null;
      break;
    }
    case "event": {
      const [row] = await db
        .update(events)
        .set({ status: "scheduled", updatedAt: new Date() })
        .where(eq(events.id, id))
        .returning({ slug: events.slug });
      slug = row?.slug ?? null;
      break;
    }
    case "job": {
      const [row] = await db
        .update(jobPostings)
        .set({ status: "open", updatedAt: new Date() })
        .where(eq(jobPostings.id, id))
        .returning({ slug: jobPostings.slug });
      slug = row?.slug ?? null;
      break;
    }
    case "property": {
      const [row] = await db
        .update(propertyListings)
        .set({
          status: "published",
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(propertyListings.id, id))
        .returning({ slug: propertyListings.slug });
      slug = row?.slug ?? null;
      break;
    }
    case "directory": {
      const [row] = await db
        .update(directoryEntries)
        .set({ verified: true, updatedAt: new Date() })
        .where(eq(directoryEntries.id, id))
        .returning({ slug: directoryEntries.slug });
      slug = row?.slug ?? null;
      break;
    }
  }

  await recordAudit({
    actorEmail: staff.email,
    actorId: staff.userId || null,
    action: "approve",
    entityType: entity,
    entityId: id,
    note: `status -> ${newStatus}`,
  });

  revalidateForEntity(entity, slug ?? undefined);
  revalidatePath("/admin/queue");

  // Best-effort: ping GSC so newly-published content is recrawled. Never blocks.
  pingGoogleSitemaps().catch(() => undefined);
}

export async function rejectAction(formData: FormData) {
  const staff = await requireStaff();
  const entity = String(formData.get("entity")) as Entity;
  const id = String(formData.get("id"));
  const reason = String(formData.get("reason") ?? "").slice(0, 500) || null;
  if (!entity || !id) return;

  const db = getDb();
  switch (entity) {
    case "article":
      await db
        .update(articles)
        .set({
          status: "archived",
          moderationNotes: reason,
          updatedAt: new Date(),
        })
        .where(eq(articles.id, id));
      break;
    case "event":
      await db
        .update(events)
        .set({
          status: "cancelled",
          moderationNotes: reason,
          updatedAt: new Date(),
        })
        .where(eq(events.id, id));
      break;
    case "job":
      await db
        .update(jobPostings)
        .set({
          status: "closed",
          moderationNotes: reason,
          updatedAt: new Date(),
        })
        .where(eq(jobPostings.id, id));
      break;
    case "property":
      await db
        .update(propertyListings)
        .set({
          status: "archived",
          moderationNotes: reason,
          updatedAt: new Date(),
        })
        .where(eq(propertyListings.id, id));
      break;
    case "directory":
      await db
        .update(directoryEntries)
        .set({ moderationNotes: reason, updatedAt: new Date() })
        .where(eq(directoryEntries.id, id));
      break;
  }

  await recordAudit({
    actorEmail: staff.email,
    actorId: staff.userId || null,
    action: "reject",
    entityType: entity,
    entityId: id,
    note: reason,
  });

  revalidatePath("/admin/queue");
}

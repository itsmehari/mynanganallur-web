"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import {
  articles,
  directoryEntries,
  events,
  jobPostings,
  openToWorkProfiles,
  propertyListings,
} from "@/db/schema";
import { recordAudit } from "@/lib/admin/audit";
import { requireStaff } from "@/lib/admin/role-guard";
import { revalidateForEntity, type EntityKind } from "@/lib/admin/revalidate";

function readText(fd: FormData, name: string): string | null {
  const v = fd.get(name);
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function readBool(fd: FormData, name: string): boolean {
  const v = fd.get(name);
  return v === "on" || v === "true";
}

const TABLES = {
  article: articles,
  event: events,
  job: jobPostings,
  open_to_work: openToWorkProfiles,
  property: propertyListings,
  directory: directoryEntries,
} as const;

export async function saveEntityAction(formData: FormData) {
  const staff = await requireStaff();
  const entity = String(formData.get("__entity")) as EntityKind;
  const id = String(formData.get("__id"));
  if (!entity || !id || !(entity in TABLES)) {
    throw new Error("Bad entity / id.");
  }

  const db = getDb();
  let slug: string | null = null;

  switch (entity) {
    case "article": {
      const [row] = await db
        .update(articles)
        .set({
          title: readText(formData, "title") ?? "(untitled)",
          slug: readText(formData, "slug") ?? "untitled",
          summary: readText(formData, "summary"),
          body: readText(formData, "body") ?? "",
          dek: readText(formData, "dek"),
          category: readText(formData, "category"),
          heroImageUrl: readText(formData, "heroImageUrl"),
          status: (readText(formData, "status") as "draft" | "published" | "archived") ?? "draft",
          featured: readBool(formData, "featured"),
          updatedAt: new Date(),
        })
        .where(eq(articles.id, id))
        .returning({ slug: articles.slug });
      slug = row?.slug ?? null;
      break;
    }
    case "event": {
      const startsAtRaw = readText(formData, "startsAt");
      const endsAtRaw = readText(formData, "endsAt");
      const startsAt = startsAtRaw ? new Date(startsAtRaw + "+05:30") : new Date();
      const endsAt = endsAtRaw ? new Date(endsAtRaw + "+05:30") : null;
      const [row] = await db
        .update(events)
        .set({
          title: readText(formData, "title") ?? "(untitled)",
          slug: readText(formData, "slug") ?? "untitled",
          description: readText(formData, "description"),
          startsAt,
          endsAt,
          allDay: readBool(formData, "allDay"),
          venueName: readText(formData, "venueName"),
          venueAddress: readText(formData, "venueAddress"),
          localityLabel: readText(formData, "localityLabel"),
          status: (readText(formData, "status") as
            | "draft"
            | "scheduled"
            | "cancelled"
            | "completed") ?? "draft",
          featured: readBool(formData, "featured"),
          heroImageUrl: readText(formData, "heroImageUrl"),
          updatedAt: new Date(),
        })
        .where(eq(events.id, id))
        .returning({ slug: events.slug });
      slug = row?.slug ?? null;
      break;
    }
    case "job": {
      const [row] = await db
        .update(jobPostings)
        .set({
          title: readText(formData, "title") ?? "(untitled)",
          slug: readText(formData, "slug") ?? "untitled",
          body: readText(formData, "body") ?? "",
          locationLabel: readText(formData, "locationLabel"),
          remotePolicy: readText(formData, "remotePolicy") ?? "onsite",
          contactPhone: readText(formData, "contactPhone"),
          contactEmail: readText(formData, "contactEmail"),
          status: (readText(formData, "status") as "draft" | "open" | "closed") ?? "draft",
          featured: readBool(formData, "featured"),
          heroImageUrl: readText(formData, "heroImageUrl"),
          updatedAt: new Date(),
        })
        .where(eq(jobPostings.id, id))
        .returning({ slug: jobPostings.slug });
      slug = row?.slug ?? null;
      break;
    }
    case "open_to_work": {
      const yearsRaw = readText(formData, "yearsExperience");
      const yearsExperience = yearsRaw ? Number.parseInt(yearsRaw, 10) : null;
      const status =
        (readText(formData, "status") as "draft" | "open" | "closed") ?? "draft";
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 90);
      const [row] = await db
        .update(openToWorkProfiles)
        .set({
          displayName: readText(formData, "displayName") ?? "(unnamed)",
          slug: readText(formData, "slug") ?? "untitled",
          headline: readText(formData, "headline") ?? "",
          body: readText(formData, "body") ?? "",
          domainsLabel: readText(formData, "domainsLabel"),
          preferredLocations: readText(formData, "preferredLocations"),
          workModePreferences: readText(formData, "workModePreferences") ?? "hybrid",
          yearsExperience: Number.isFinite(yearsExperience) ? yearsExperience : null,
          contactEmail: readText(formData, "contactEmail"),
          contactPhone: readText(formData, "contactPhone"),
          linkedInUrl: readText(formData, "linkedInUrl"),
          facebookUrl: readText(formData, "facebookUrl"),
          sourcePostUrl: readText(formData, "sourcePostUrl"),
          resumeUrl: readText(formData, "resumeUrl"),
          status,
          featured: readBool(formData, "featured"),
          publishedAt: status === "open" ? now : null,
          expiresAt: status === "open" ? expiresAt : null,
          updatedAt: now,
        })
        .where(eq(openToWorkProfiles.id, id))
        .returning({ slug: openToWorkProfiles.slug });
      slug = row?.slug ?? null;
      break;
    }
    case "property": {
      const [row] = await db
        .update(propertyListings)
        .set({
          title: readText(formData, "title") ?? "(untitled)",
          slug: readText(formData, "slug") ?? "untitled",
          summary: readText(formData, "summary"),
          body: readText(formData, "body") ?? "",
          localityLabel: readText(formData, "localityLabel"),
          landmarkNote: readText(formData, "landmarkNote"),
          contactPhone: readText(formData, "contactPhone") ?? "",
          contactEmail: readText(formData, "contactEmail"),
          status: (readText(formData, "status") as
            | "draft"
            | "published"
            | "archived") ?? "draft",
          featured: readBool(formData, "featured"),
          heroImageUrl: readText(formData, "heroImageUrl"),
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
        .set({
          name: readText(formData, "title") ?? "(untitled)",
          slug: readText(formData, "slug") ?? "untitled",
          address: readText(formData, "address"),
          localityLabel: readText(formData, "localityLabel"),
          phone: readText(formData, "phone"),
          websiteUrl: readText(formData, "websiteUrl"),
          hoursSummary: readText(formData, "hoursSummary"),
          verified: readBool(formData, "verified"),
          featured: readBool(formData, "featured"),
          heroImageUrl: readText(formData, "heroImageUrl"),
          updatedAt: new Date(),
        })
        .where(eq(directoryEntries.id, id))
        .returning({ slug: directoryEntries.slug });
      slug = row?.slug ?? null;
      break;
    }
  }

  await recordAudit({
    actorEmail: staff.email,
    actorId: staff.userId || null,
    action: "update",
    entityType: entity,
    entityId: id,
  });

  revalidateForEntity(entity, slug ?? undefined);
  redirect(`/admin/queue?saved=${entity}`);
}

import { getDb } from "@/db/client";
import { auditLog } from "@/db/schema";

export type AuditableEntity =
  | "article"
  | "event"
  | "job"
  | "property"
  | "directory"
  | "ad_creative"
  | "newsletter"
  | "featured_order"
  | "sponsorship"
  | "partner";

export type AuditAction =
  | "create"
  | "update"
  | "approve"
  | "reject"
  | "publish"
  | "archive"
  | "delete"
  | "feature"
  | "unfeature";

export async function recordAudit(opts: {
  actorId?: string | null;
  actorEmail?: string | null;
  action: AuditAction;
  entityType: AuditableEntity;
  entityId?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  note?: string | null;
}): Promise<void> {
  try {
    const db = getDb();
    await db.insert(auditLog).values({
      actorId: opts.actorId ?? null,
      actorEmail: opts.actorEmail ?? null,
      action: opts.action,
      entityType: opts.entityType,
      entityId: opts.entityId ?? null,
      beforeJson: opts.before ?? null,
      afterJson: opts.after ?? null,
      note: opts.note ?? null,
    });
  } catch (e) {
    console.warn("[audit] failed to record", e);
  }
}

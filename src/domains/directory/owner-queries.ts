import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { directoryEntries } from "@/db/schema/tables";

export type OwnerDirectoryRow = typeof directoryEntries.$inferSelect;

export async function listDirectoryEntriesForOwner(
  ownerUserId: string,
): Promise<OwnerDirectoryRow[]> {
  const db = getDb();
  return db
    .select()
    .from(directoryEntries)
    .where(eq(directoryEntries.ownerUserId, ownerUserId))
    .orderBy(desc(directoryEntries.updatedAt));
}

export async function getDirectoryEntryForOwner(
  ownerUserId: string,
  entryId: string,
): Promise<OwnerDirectoryRow | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(directoryEntries)
    .where(
      and(
        eq(directoryEntries.id, entryId),
        eq(directoryEntries.ownerUserId, ownerUserId),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

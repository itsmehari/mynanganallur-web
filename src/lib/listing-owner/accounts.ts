import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema/auth";
import { normalizeEmail, normalizePhone } from "@/lib/listing-owner/phone";

export async function findListingOwnerByCredentials(
  emailRaw: string,
  phoneRaw: string,
): Promise<{ id: string; email: string; phone: string; name: string | null } | null> {
  const email = normalizeEmail(emailRaw);
  const phone = normalizePhone(phoneRaw);
  if (!phone) return null;

  const db = getDb();
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      phone: users.phone,
      name: users.name,
      role: users.role,
    })
    .from(users)
    .where(and(eq(users.email, email), eq(users.phone, phone)))
    .limit(1);

  const row = rows[0];
  if (!row?.phone) return null;
  if (row.role !== "listing_owner" && row.role !== "admin") return null;
  return {
    id: row.id,
    email: row.email,
    phone: row.phone,
    name: row.name,
  };
}

/** Create or update listing-owner account on business submit. */
export async function ensureListingOwnerAccount(opts: {
  email: string;
  phone: string;
  name?: string | null;
}): Promise<string> {
  const email = normalizeEmail(opts.email);
  const phone = normalizePhone(opts.phone);
  if (!phone) {
    throw new Error("Invalid phone number for listing owner account.");
  }

  const db = getDb();
  const existing = await db
    .select({ id: users.id, phone: users.phone, role: users.role })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing[0]) {
    const row = existing[0];
    if (row.phone && row.phone !== phone) {
      throw new Error(
        "This email is already registered with a different phone number.",
      );
    }
    await db
      .update(users)
      .set({
        phone,
        phoneVerified: new Date(),
        role: row.role === "admin" ? row.role : "listing_owner",
        ...(opts.name?.trim() ? { name: opts.name.trim() } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, row.id));
    return row.id;
  }

  const [created] = await db
    .insert(users)
    .values({
      email,
      phone,
      phoneVerified: new Date(),
      emailVerified: new Date(),
      name: opts.name?.trim() || null,
      role: "listing_owner",
    })
    .returning({ id: users.id });

  return created.id;
}

import { randomBytes } from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db/client";
import { listingOwnerSessions, users } from "@/db/schema/auth";
import { LISTING_OWNER_COOKIE } from "@/lib/listing-owner/constants";

export { LISTING_OWNER_COOKIE };
const SESSION_DAYS = 30;

export type ListingOwnerUser = {
  id: string;
  email: string;
  phone: string;
  name: string | null;
  role: string;
};

function sessionExpiry(): Date {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

export async function createListingOwnerSession(userId: string): Promise<string> {
  const db = getDb();
  const sessionToken = randomBytes(32).toString("hex");
  await db.insert(listingOwnerSessions).values({
    sessionToken,
    userId,
    expires: sessionExpiry(),
  });
  return sessionToken;
}

export async function setListingOwnerCookie(sessionToken: string): Promise<void> {
  const jar = await cookies();
  jar.set(LISTING_OWNER_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearListingOwnerCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(LISTING_OWNER_COOKIE);
}

export async function getListingOwnerSession(): Promise<ListingOwnerUser | null> {
  const jar = await cookies();
  const token = jar.get(LISTING_OWNER_COOKIE)?.value;
  if (!token) return null;

  const db = getDb();
  const rows = await db
    .select({
      sessionToken: listingOwnerSessions.sessionToken,
      expires: listingOwnerSessions.expires,
      userId: users.id,
      email: users.email,
      phone: users.phone,
      name: users.name,
      role: users.role,
    })
    .from(listingOwnerSessions)
    .innerJoin(users, eq(listingOwnerSessions.userId, users.id))
    .where(eq(listingOwnerSessions.sessionToken, token))
    .limit(1);

  const row = rows[0];
  if (!row || row.expires < new Date()) {
    if (row) {
      await db
        .delete(listingOwnerSessions)
        .where(eq(listingOwnerSessions.sessionToken, token));
    }
    return null;
  }
  if (!row.phone) return null;
  return {
    id: row.userId,
    email: row.email,
    phone: row.phone,
    name: row.name,
    role: row.role,
  };
}

export async function destroyListingOwnerSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(LISTING_OWNER_COOKIE)?.value;
  if (token) {
    const db = getDb();
    await db
      .delete(listingOwnerSessions)
      .where(eq(listingOwnerSessions.sessionToken, token));
  }
  await clearListingOwnerCookie();
}

/** Best-effort cleanup of expired sessions. */
export async function purgeExpiredListingOwnerSessions(): Promise<void> {
  const db = getDb();
  await db
    .delete(listingOwnerSessions)
    .where(lt(listingOwnerSessions.expires, new Date()));
}

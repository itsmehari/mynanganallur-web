"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDirectoryEntryForOwner } from "@/domains/directory/owner-queries";
import { getDb } from "@/db/client";
import { directoryEntries } from "@/db/schema";
import { requireListingOwner } from "@/lib/listing-owner/auth";
import { readField } from "@/lib/submissions";

export async function updateOwnerListingAction(formData: FormData): Promise<void> {
  const owner = await requireListingOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/my/listings?err=missing");
  }

  const entry = await getDirectoryEntryForOwner(owner.id, id);
  if (!entry) {
    redirect("/my/listings?err=not_found");
  }

  const name = readField(formData, "name", { required: true, max: 140, label: "Name" });
  const address = readField(formData, "address", { max: 240 });
  const locality = readField(formData, "locality", { max: 80 });
  const phone = readField(formData, "phone", { max: 24 });
  const website = readField(formData, "website", { max: 240 });
  const hours = readField(formData, "hours", { max: 240 });

  const db = getDb();
  await db
    .update(directoryEntries)
    .set({
      name,
      address: address || null,
      localityLabel: locality || null,
      phone: phone || null,
      websiteUrl: website || null,
      hoursSummary: hours || null,
      updatedAt: new Date(),
    })
    .where(eq(directoryEntries.id, id));

  redirect(`/my/listings/${id}?saved=1`);
}

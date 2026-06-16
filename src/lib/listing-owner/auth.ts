import { redirect } from "next/navigation";
import {
  getListingOwnerSession,
  type ListingOwnerUser,
} from "@/lib/listing-owner/session";

export async function requireListingOwner(
  returnTo = "/my/listings",
): Promise<ListingOwnerUser> {
  const user = await getListingOwnerSession();
  if (!user) {
    redirect(`/my/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
  return user;
}

export { getListingOwnerSession };

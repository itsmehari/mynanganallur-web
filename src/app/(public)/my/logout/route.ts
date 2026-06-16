import Link from "next/link";
import { redirect } from "next/navigation";
import { destroyListingOwnerSession } from "@/lib/listing-owner/session";

export async function GET() {
  await destroyListingOwnerSession();
  redirect("/my/login");
}

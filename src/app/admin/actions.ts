"use server";

import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

/**
 * Bust ISR for public routes after manual DB edits or future CMS publish.
 * Requires `editor` or `admin` role on the session user.
 */
export async function revalidatePublicContentAction(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "admin" && role !== "editor") {
    return { ok: false, error: "Sign in as editor or admin." };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

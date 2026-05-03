import { auth } from "@/auth";

export type StaffRole = "admin" | "editor";

export async function requireStaff(): Promise<{
  email: string | null;
  role: StaffRole;
  userId: string;
}> {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "admin" && role !== "editor") {
    throw new StaffOnlyError();
  }
  return {
    email: session?.user?.email ?? null,
    role,
    userId: session?.user?.id ?? "",
  };
}

export class StaffOnlyError extends Error {
  constructor() {
    super("This action requires admin or editor role.");
    this.name = "StaffOnlyError";
  }
}

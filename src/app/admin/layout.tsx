import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "./actions";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/queue", label: "Queue" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/directory", label: "Directory" },
  { href: "/admin/ads", label: "Ads" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/audit", label: "Audit log" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role;
  const isStaff = role === "admin" || role === "editor";

  return (
    <div className="min-h-full bg-zinc-100 dark:bg-zinc-950">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <Link
          href="/admin"
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
        >
          mynanganallur.in · Admin
        </Link>
        {session?.user ? (
          <div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300">
            <span>
              {session.user.email ?? session.user.name ?? "user"} · {role ?? "reader"}
            </span>
            <form action={signOutAction}>
              <button type="submit" className="underline">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/api/auth/signin"
            className="text-xs font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            Sign in
          </Link>
        )}
      </header>

      <div className="mx-auto flex max-w-[1280px] gap-6 px-4 py-6">
        {isStaff ? (
          <aside className="w-52 shrink-0">
            <nav aria-label="Admin sections" className="space-y-1 text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        ) : null}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

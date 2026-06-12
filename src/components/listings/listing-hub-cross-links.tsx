import Link from "next/link";

const HUBS = [
  { href: "/properties", label: "Properties" },
  { href: "/jobs", label: "Jobs" },
  { href: "/local-events", label: "Events" },
  { href: "/directory", label: "Directory" },
] as const;

type Props = {
  currentPath: string;
};

export function ListingHubCrossLinks({ currentPath }: Props) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {HUBS.map((hub) => {
        const active = currentPath === hub.href;
        return (
          <Link
            key={hub.href}
            href={hub.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]"
            }`}
          >
            {hub.label}
          </Link>
        );
      })}
    </div>
  );
}

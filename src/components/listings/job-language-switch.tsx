import Link from "next/link";
import { jobSlugPathSegment } from "@/lib/jobs/slug-normalize";

type Props = {
  locale: string;
  currentSlug: string;
  alternateSlug: string | null;
  className?: string;
};

export function JobLanguageSwitch({
  locale,
  currentSlug,
  alternateSlug,
  className = "",
}: Props) {
  if (!alternateSlug) return null;

  const isTa = locale.toLowerCase().startsWith("ta");
  const enSlug = isTa ? alternateSlug : currentSlug;
  const taSlug = isTa ? currentSlug : alternateSlug;

  return (
    <nav
      className={`flex flex-wrap items-center gap-2 text-sm ${className}`}
      aria-label={isTa ? "மொழி" : "Language"}
    >
      <span className="text-[var(--muted)]">{isTa ? "மொழி:" : "Language:"}</span>
      {isTa ? (
        <>
          <Link
            href={`/jobs/${jobSlugPathSegment(enSlug)}`}
            className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
            hrefLang="en"
          >
            English
          </Link>
          <span className="text-[var(--muted)]" aria-hidden>
            ·
          </span>
          <span className="font-semibold text-[var(--foreground)]" aria-current="page">
            தமிழ்
          </span>
        </>
      ) : (
        <>
          <span className="font-semibold text-[var(--foreground)]" aria-current="page">
            English
          </span>
          <span className="text-[var(--muted)]" aria-hidden>
            ·
          </span>
          <Link
            href={`/jobs/${jobSlugPathSegment(taSlug)}`}
            className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
            hrefLang="ta"
          >
            தமிழ்
          </Link>
        </>
      )}
    </nav>
  );
}

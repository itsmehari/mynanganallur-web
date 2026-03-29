import type { AdDesign } from "./types";

/** Legacy CSS / data may use `resumebuilder` — treat like ResumeDoctor */
export function normalizeAdDesign(raw: string): AdDesign {
  if (raw === "resumebuilder") return "resumedoctor";
  if (
    raw === "resumedoctor" ||
    raw === "mycovai" ||
    raw === "colourchemist" ||
    raw === "bseri"
  ) {
    return raw;
  }
  return "default";
}

type IconProps = { className?: string };

function IconDocument({ className }: IconProps) {
  return (
    <svg
      className={className}
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function IconMapPin({ className }: IconProps) {
  return (
    <svg
      className={className}
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      aria-hidden
    >
      <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" />
      <circle cx={12} cy={10} r={2.5} />
    </svg>
  );
}

function IconPalette({ className }: IconProps) {
  return (
    <svg
      className={className}
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      aria-hidden
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      <circle cx={6.5} cy={11.5} r={1} fill="currentColor" stroke="none" />
      <circle cx={9.5} cy={7.5} r={1} fill="currentColor" stroke="none" />
      <circle cx={14.5} cy={7.5} r={1} fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconCertificate({ className }: IconProps) {
  return (
    <svg
      className={className}
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      aria-hidden
    >
      <path d="M4 4h16v12H4zM8 22l4-2 4 2v-6H8z" />
      <path d="M9 9h6M9 12h4" />
    </svg>
  );
}

function IconMegaphone({ className }: IconProps) {
  return (
    <svg
      className={className}
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      aria-hidden
    >
      <path d="M3 11v2a1 1 0 0 0 1 1h2l4 3V7L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M16 8a5 5 0 0 1 0 8M19 6a8 8 0 0 1 0 12" />
    </svg>
  );
}

export function AdBannerIcon({
  design,
  className,
}: {
  design: AdDesign | string;
  className?: string;
}) {
  const d = normalizeAdDesign(design);
  switch (d) {
    case "resumedoctor":
      return <IconDocument className={className} />;
    case "mycovai":
      return <IconMapPin className={className} />;
    case "colourchemist":
      return <IconPalette className={className} />;
    case "bseri":
      return <IconCertificate className={className} />;
    default:
      return <IconMegaphone className={className} />;
  }
}

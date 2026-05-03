import Link from "next/link";

type Props = {
  searchParams: Promise<{ kind?: string; title?: string }>;
};

const LABELS: Record<string, string> = {
  job: "job listing",
  event: "event",
  business: "business listing",
  property: "property listing",
};

const WHATSAPP_NUMBER = "919840000000"; // Replace with the editor's number

export default async function SubmitThanks({ searchParams }: Props) {
  const sp = await searchParams;
  const kind = sp.kind ?? "submission";
  const label = LABELS[kind] ?? "submission";
  const titleSafe = sp.title ?? "your submission";

  const waText = encodeURIComponent(
    `Hi mynanganallur.in — I just submitted ${label}: "${titleSafe}". Wanted to flag it for review.`,
  );
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
        Submitted
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-emerald-900">
        Thanks — we’ll review within 24 hours.
      </h2>
      <p className="mt-3 text-sm text-emerald-900">
        We saved <strong>{titleSafe}</strong> to the moderation queue. You will
        get an email when it goes live. To bump it, ping us on WhatsApp.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-emerald-700 px-4 py-2 font-semibold text-white"
        >
          Ping us on WhatsApp
        </a>
        <Link
          href="/submit"
          className="rounded-full border border-emerald-300 px-4 py-2 font-medium text-emerald-900"
        >
          Submit another
        </Link>
        <Link
          href="/"
          className="rounded-full border border-emerald-300 px-4 py-2 font-medium text-emerald-900"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

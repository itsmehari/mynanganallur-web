const PROPERTY_ADS_WHATSAPP = "917200101497";

const DEFAULT_MESSAGE =
  "Hi mynanganallur.in — I'd like to post a property-related ad (rent or sale) on the site.";

type Props = {
  className?: string;
};

export function PropertyListWhatsAppCta({ className = "" }: Props) {
  const waUrl = `https://wa.me/${PROPERTY_ADS_WHATSAPP}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <section
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-5 shadow-sm ${className}`.trim()}
      aria-labelledby="property-list-wa-heading"
    >
      <p
        id="property-list-wa-heading"
        className="text-sm text-[var(--foreground)]"
      >
        Want to post your property-related ad or property rental or sales? Send
        us a message.
      </p>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Message us on WhatsApp
      </a>
    </section>
  );
}

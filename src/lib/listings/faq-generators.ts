import type { FaqItem } from "@/lib/seo/faq-jsonld";
import type { JobWithEmployer } from "@/domains/jobs";
import { propertyListings } from "@/db/schema/tables";
import { jobSalaryLine, propertyPriceLine } from "@/lib/listings/format";

type PropertyRow = typeof propertyListings.$inferSelect;

export function buildPropertyAutoFaq(row: PropertyRow): FaqItem[] {
  const price = propertyPriceLine(row) ?? "Price on enquiry";
  const locality = row.localityLabel ?? "Nanganallur area";
  return [
    {
      q: `What is listed at ${locality}?`,
      a: `${row.title}. ${row.summary ?? "See the listing body for full details."}`,
    },
    {
      q: "What is the rent or price?",
      a:
        row.kind === "rent"
          ? `Advertised rent: ${price}. Confirm advance, maintenance and other charges with the advertiser in person.`
          : `Asking price: ${price}. Negotiate and verify title documents before any payment.`,
    },
    {
      q: "How do I contact the advertiser?",
      a: `Call or WhatsApp ${row.contactPhone} using the buttons on this page. mynanganallur.in does not take commissions on property deals.`,
    },
    {
      q: "Is this listing verified by mynanganallur.in?",
      a: "No. This is an advertiser-submitted community listing. Visit the property, verify identity and paperwork, and do not transfer money to unknown accounts.",
    },
  ];
}

export function buildJobAutoFaq(row: JobWithEmployer): FaqItem[] {
  const { job, employer } = row;
  const salary = jobSalaryLine(job) ?? "Salary on request";
  const location = job.locationLabel ?? "Nanganallur area";
  const applyNote = job.contactPhone?.trim()
    ? "Use the Apply via WhatsApp button on this page."
    : "Follow the application instructions in the job description.";

  return [
    {
      q: `How do I apply for ${job.title}?`,
      a: `${applyNote} Role at ${employer.name}, ${location}.`,
    },
    {
      q: "What is the salary for this role?",
      a: `${salary}. Confirm the final offer with the employer — figures on the listing are indicative when disclosed.`,
    },
    {
      q: "Is this job in Nanganallur?",
      a: `Location: ${location}. Work mode: ${job.remotePolicy}.`,
    },
    {
      q: "Does mynanganallur.in guarantee this job?",
      a: "No. Listings are employer-submitted. Verify the employer and role details before sharing personal documents or paying any fee.",
    },
  ];
}

export function buildEventAutoFaq(event: {
  title: string;
  startsAt: Date;
  allDay: boolean;
  venueName: string | null;
  localityLabel: string | null;
  venueAddress: string | null;
}): FaqItem[] {
  const when = event.startsAt.toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: event.allDay ? undefined : "short",
    timeZone: "Asia/Kolkata",
  });
  const where =
    event.venueName ??
    event.localityLabel ??
    event.venueAddress ??
    "See event details";

  return [
    {
      q: `When is ${event.title}?`,
      a: `${when}${event.allDay ? " (all day)" : ""} at ${where}. Confirm with the organiser before you travel.`,
    },
    {
      q: "Is this event in Nanganallur?",
      a: `This event is listed for the Nanganallur site calendar. Venue: ${where}.`,
    },
    {
      q: "How do I get tickets or more information?",
      a: "Check the event description below for organiser contact details. mynanganallur.in does not sell tickets.",
    },
  ];
}

export function buildDirectoryAutoFaq(entry: {
  name: string;
  localityLabel: string | null;
  address: string | null;
  phone: string | null;
  hoursSummary: string | null;
}): FaqItem[] {
  const where = [entry.localityLabel, entry.address].filter(Boolean).join(" — ");
  return [
    {
      q: `Where is ${entry.name} located?`,
      a: where || "See the address on this listing. Confirm before visiting.",
    },
    {
      q: `How do I contact ${entry.name}?`,
      a: entry.phone
        ? `Phone: ${entry.phone}. Use the Call button on this page.`
        : "No phone listed — check the official website link if provided.",
    },
    {
      q: "What are the opening hours?",
      a: entry.hoursSummary ?? "Hours not listed — call ahead to confirm.",
    },
  ];
}

export function resolveFaqItems(
  stored: { items: { q: string; a: string }[] } | null | undefined,
  generated: FaqItem[],
): FaqItem[] {
  const fromDb = (stored?.items ?? []).filter((it) => it?.q?.trim() && it?.a?.trim());
  return fromDb.length > 0 ? fromDb : generated;
}

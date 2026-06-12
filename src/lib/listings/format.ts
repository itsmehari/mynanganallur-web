import { propertyListings } from "@/db/schema/tables";

type PropertyRow = typeof propertyListings.$inferSelect;

export function formatInrPrice(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function contactTelHref(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `tel:+91${d}`;
  return `tel:+${d}`;
}

export function contactWaHref(phone: string, message?: string): string {
  const d = phone.replace(/\D/g, "");
  const num = d.length === 10 ? `91${d}` : d;
  const base = `https://wa.me/${num}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function propertyKindLabel(kind: string): string {
  if (kind === "rent") return "Rent";
  if (kind === "sale") return "Sale";
  return "Listing";
}

export function propertyPriceLine(p: {
  kind: string;
  rentPerMonth: number | null;
  salePrice: number | null;
}): string | null {
  if (p.kind === "rent" && p.rentPerMonth != null) {
    return `${formatInrPrice(p.rentPerMonth)}/month`;
  }
  if (p.kind === "sale" && p.salePrice != null) {
    return formatInrPrice(p.salePrice);
  }
  if (p.kind === "sale") return "Price on enquiry";
  return null;
}

export function parseBuiltUpSqftFromBody(body: string): number | null {
  const m = body.match(/\*\*Built-up area:\*\*\s*([\d,]+)\s*sq\.?\s*ft/i);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

export function propertyFactPills(row: PropertyRow): string[] {
  const facts: string[] = [];
  const price = propertyPriceLine(row);
  if (price) facts.push(row.kind === "rent" ? `Rent: ${price}` : `Ask: ${price}`);
  if (row.advanceMonths != null) {
    facts.push(`Advance: ${row.advanceMonths} month(s)`);
  }
  if (row.bedrooms != null) facts.push(`${row.bedrooms} BHK`);
  if (row.areaSqft != null) facts.push(`~${row.areaSqft.toLocaleString("en-IN")} sq ft plot`);
  const builtUp = parseBuiltUpSqftFromBody(row.body);
  if (builtUp != null) {
    facts.push(`~${builtUp.toLocaleString("en-IN")} sq ft built-up`);
  }
  if (row.floorLabel) facts.push(row.floorLabel);
  if (row.facing) facts.push(`${row.facing} facing`);
  if (row.furnishing !== "unspecified") {
    facts.push(
      row.furnishing === "fully_furnished"
        ? "Fully furnished"
        : row.furnishing === "semi_furnished"
          ? "Semi-furnished"
          : "Unfurnished",
    );
  }
  if (row.vegetarianHouseholdOnly) {
    facts.push("Vegetarian household preference");
  }
  return facts;
}

export function jobSalaryLine(
  job: {
    salaryDisclosed: boolean;
    salaryMin: number | null;
    salaryMax: number | null;
  },
  opts?: { forHub?: boolean },
): string | null {
  if (!job.salaryDisclosed) {
    return opts?.forHub ? null : "Salary not disclosed";
  }
  if (job.salaryMin != null && job.salaryMax != null) {
    const range = `${formatInrPrice(job.salaryMin)}–${formatInrPrice(job.salaryMax)}`;
    return opts?.forHub ? `${range} (indicative)` : range;
  }
  if (job.salaryMin != null) {
    const from = `From ${formatInrPrice(job.salaryMin)}`;
    return opts?.forHub ? `${from} (indicative)` : from;
  }
  return opts?.forHub ? null : "Salary on request";
}

export function formatPublishedDate(d: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatEventWhen(startsAt: Date, allDay: boolean): string {
  return startsAt.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: allDay ? undefined : "short",
    timeZone: "Asia/Kolkata",
  });
}

export function formatEventDateBadge(startsAt: Date): { day: string; month: string } {
  const day = startsAt.toLocaleString("en-IN", {
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  const month = startsAt
    .toLocaleString("en-IN", { month: "short", timeZone: "Asia/Kolkata" })
    .toUpperCase();
  return { day, month };
}

export function directoryTypeTitle(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

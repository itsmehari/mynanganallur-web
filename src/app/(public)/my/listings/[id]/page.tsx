import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FormStatus,
  PhoneField,
  SubmitButton,
  TextField,
} from "@/components/forms";
import { getDirectoryEntryForOwner } from "@/domains/directory/owner-queries";
import { requireListingOwner } from "@/lib/listing-owner/auth";
import { directoryTypeTitle } from "@/lib/listings/format";
import { updateOwnerListingAction } from "./actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const owner = await requireListingOwner(`/my/listings/${id}`);
  const entry = await getDirectoryEntryForOwner(owner.id, id);
  return {
    title: entry ? `Edit ${entry.name}` : "Edit listing",
    robots: { index: false, follow: false },
  };
}

export default async function EditOwnerListingPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const owner = await requireListingOwner(`/my/listings/${id}`);
  const entry = await getDirectoryEntryForOwner(owner.id, id);
  if (!entry) notFound();

  const publicUrl = `/directory/${entry.type}/${entry.slug}`;

  return (
    <div className="mx-auto max-w-[640px] px-4 py-10 sm:px-6">
      <Link
        href="/my/listings"
        className="text-sm font-semibold text-[var(--accent)] hover:underline"
      >
        ← My listings
      </Link>

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        {directoryTypeTitle(entry.type)}
        {!entry.verified ? " · Awaiting verification" : ""}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        Edit listing
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Changes appear on your{" "}
        <Link href={publicUrl} className="font-semibold text-[var(--accent)] hover:underline">
          public page
        </Link>{" "}
        immediately. Category and URL slug are fixed — contact us to change those.
      </p>

      <form action={updateOwnerListingAction} className="mt-8 space-y-5">
        <FormStatus
          status={sp.saved ? "ok" : undefined}
          message={sp.saved ? "Saved. Your public listing is updated." : undefined}
        />
        <input type="hidden" name="id" value={entry.id} />

        <TextField
          id="name"
          label="Business / place name"
          required
          maxLength={140}
          defaultValue={entry.name}
        />
        <TextField
          id="address"
          label="Address"
          maxLength={240}
          defaultValue={entry.address ?? undefined}
        />
        <TextField
          id="locality"
          label="Locality / area"
          maxLength={80}
          defaultValue={entry.localityLabel ?? undefined}
        />
        <TextField
          id="hours"
          label="Hours summary"
          maxLength={240}
          defaultValue={entry.hoursSummary ?? undefined}
        />
        <PhoneField
          id="phone"
          label="Public phone"
          defaultValue={entry.phone ?? undefined}
        />
        <TextField
          id="website"
          label="Website"
          type="url"
          maxLength={240}
          defaultValue={entry.websiteUrl ?? undefined}
        />

        <SubmitButton label="Save changes" />
      </form>
    </div>
  );
}

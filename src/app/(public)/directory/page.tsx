import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot, buildRotationSeed } from "@/ads";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";

export const metadata: Metadata = {
  title: "Directory",
  description:
    "Nanganallur schools, hospitals, food, parks, and more — directory hub coming soon.",
};

export default function DirectoryPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
      <p className="text-sm font-medium text-[var(--accent)]">Directory</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Explore places & businesses
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Unified directory verticals will replace corridor-only PHP tables. Use
        the home page mosaic until browse + detail routes ship.
      </p>
      <AdSlot
        slotId="listings-index-top"
        size="728x90"
        seed={buildRotationSeed("/directory", "listings-index-top")}
        className="mt-10 max-w-full"
      />
      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-directory"
        className="mt-10 max-w-xl"
      />
      <Link
        href="/"
        className="mt-8 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}

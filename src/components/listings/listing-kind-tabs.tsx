import { ListingFilterChips, type FilterChip } from "@/components/listings/listing-filter-chips";

type Props = {
  currentParams: Record<string, string | undefined | null>;
};

const KIND_CHIPS: FilterChip[] = [
  { label: "All", param: "kind", value: null },
  { label: "Rent", param: "kind", value: "rent" },
  { label: "Sale", param: "kind", value: "sale" },
];

export function ListingKindTabs({ currentParams }: Props) {
  return (
    <div className="mt-4">
      <ListingFilterChips
        basePath="/properties"
        chips={KIND_CHIPS}
        currentParams={currentParams}
      />
    </div>
  );
}

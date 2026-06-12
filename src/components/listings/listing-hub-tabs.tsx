import { ListingFilterChips, type FilterChip } from "@/components/listings/listing-filter-chips";
import { directoryTypeTitle } from "@/lib/listings/format";

type Props = {
  types: string[];
  currentType: string | null;
  currentParams: Record<string, string | undefined | null>;
};

export function ListingHubTabs({ types, currentType, currentParams }: Props) {
  const chips: FilterChip[] = [
    { label: "All", param: "type", value: null },
    ...types.map((t) => ({
      label: directoryTypeTitle(t),
      param: "type",
      value: t,
    })),
  ];

  return (
    <div className="mt-4">
      <ListingFilterChips
        basePath="/directory"
        chips={chips}
        currentParams={{ ...currentParams, type: currentType }}
      />
    </div>
  );
}

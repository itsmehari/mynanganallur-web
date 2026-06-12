import { ListingFilterBar } from "@/components/search/listing-filter-bar";
import {
  ListingFilterChips,
  type FilterChip,
} from "@/components/listings/listing-filter-chips";

type Props = {
  action: string;
  q?: string;
  locality?: string;
  qPlaceholder?: string;
  chips?: FilterChip[];
  currentParams?: Record<string, string | undefined | null>;
};

export function ListingFilterRow({
  action,
  q,
  locality,
  qPlaceholder,
  chips,
  currentParams = {},
}: Props) {
  return (
    <div className="mt-6 space-y-3">
      {chips && chips.length > 0 ? (
        <ListingFilterChips
          basePath={action}
          chips={chips}
          currentParams={{ ...currentParams, q, locality }}
        />
      ) : null}
      <ListingFilterBar
        action={action}
        q={q}
        locality={locality}
        qPlaceholder={qPlaceholder}
      />
    </div>
  );
}

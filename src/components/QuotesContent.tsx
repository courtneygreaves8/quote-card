import { QuoteCardLg } from "@/components/QuoteCardLg"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Quote } from "@/types/quote"

export type SortOption = "price-asc" | "price-desc" | "provider-az"
export type FilterOption = "all" | "under-20" | "under-25" | "under-30"

interface QuotesContentProps {
  displayedQuotes: Quote[]
  sort: SortOption
  filter: FilterOption
  onSortChange: (value: SortOption) => void
  onFilterChange: (value: FilterOption) => void
  legalCover: boolean
  homeEmergency: boolean
  onLegalCoverChange: (checked: boolean) => void
  onHomeEmergencyChange: (checked: boolean) => void
  onMoreDetails: (quote: Quote) => void
  onPurchase?: (quote: Quote) => void
}

export function QuotesContent({
  displayedQuotes,
  sort,
  filter,
  onSortChange,
  onFilterChange,
  legalCover,
  homeEmergency,
  onLegalCoverChange,
  onHomeEmergencyChange,
  onMoreDetails,
  onPurchase,
}: QuotesContentProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-4 sf:flex-row sf:items-start sf:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {displayedQuotes.length === 0
              ? "No quotes match your filters"
              : `We've got ${displayedQuotes.length} quote${displayedQuotes.length === 1 ? "" : "s"} for you`}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Each quote comes with Pikl's Property Host Cover.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sf:w-auto sf:flex-row sf:flex-none sf:items-center sf:justify-end">
          <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="w-full sf:w-[180px]" aria-label="Sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="provider-az">Provider A–Z</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filter} onValueChange={(v) => onFilterChange(v as FilterOption)}>
            <SelectTrigger className="w-full sf:w-[160px]" aria-label="Filter">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All quotes</SelectItem>
              <SelectItem value="under-20">Under £20/mo</SelectItem>
              <SelectItem value="under-25">Under £25/mo</SelectItem>
              <SelectItem value="under-30">Under £30/mo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
        {displayedQuotes.length > 0 ? (
          displayedQuotes.map((quote) => (
            <QuoteCardLg
              key={quote.id}
              size="lg"
              quote={quote}
              legalCover={legalCover}
              homeEmergency={homeEmergency}
              onLegalCoverChange={onLegalCoverChange}
              onHomeEmergencyChange={onHomeEmergencyChange}
              onMoreDetails={onMoreDetails}
              onPurchase={onPurchase}
            />
          ))
        ) : (
          <div className="col-span-2 rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
            <p className="text-muted-foreground">
              No quotes match your current filters. Try changing cover amount,
              excess or policy type.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

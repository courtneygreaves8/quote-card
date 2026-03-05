import type { FilterOption, PaymentOption, Quote, SortOption } from "@/types/quote"
import { QuoteCardDf } from "@/components/QuoteCardDf"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type { SortOption, FilterOption }

interface QuotesContentProps {
  displayedQuotes: Quote[]
  policyType: string
  sort: SortOption
  filter: FilterOption
  onSortChange: (value: SortOption) => void
  onFilterChange: (value: FilterOption) => void
  paymentOption: PaymentOption
  onPaymentOptionChange: (option: PaymentOption) => void
  legalCover: boolean
  onLegalCoverChange: (checked: boolean) => void
  homeEmergency: boolean
  onHomeEmergencyChange: (checked: boolean) => void
  onMoreDetails: (quote: Quote) => void
  onPurchase?: (quote: Quote) => void
  onOpenOptions?: () => void
}

export function QuotesContent({
  displayedQuotes,
  policyType,
  sort,
  filter,
  onSortChange,
  onFilterChange,
  paymentOption,
  onPaymentOptionChange,
  legalCover,
  onLegalCoverChange,
  homeEmergency,
  onHomeEmergencyChange,
  onMoreDetails,
  onPurchase,
  onOpenOptions,
}: QuotesContentProps) {
  return (
    <div className="w-full overflow-x-hidden py-8 px-4 md:px-6 card3:px-6">
      {/* Centre stage: 3-col stacked up to 1512px; single horizontal card at 1513px+ */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-col min-[1513px]:w-fit min-[1513px]:max-w-none min-[1513px]:items-center">
        <div className="mb-8 w-full flex flex-col gap-4 min-[960px]:flex-row min-[960px]:items-start min-[960px]:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {displayedQuotes.length === 0
                ? "No quotes match your filters"
                : `We've got ${displayedQuotes.length} quote${displayedQuotes.length === 1 ? "" : "s"} for you`}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Find the cover right for you.
            </p>
          </div>
          <div className="flex w-full flex-row gap-3 min-[960px]:w-auto min-[960px]:flex-none min-[960px]:items-center min-[960px]:justify-end">
            <div className="flex-1 min-[960px]:w-[240px] min-[960px]:flex-none">
              <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
                <SelectTrigger className="w-full" aria-label="Sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="provider-az">Provider A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-[960px]:w-[240px] min-[960px]:flex-none">
              <Select value={filter} onValueChange={(v) => onFilterChange(v as FilterOption)}>
                <SelectTrigger className="w-full" aria-label="Filter">
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
            {onOpenOptions && (
              <Button
                type="button"
                className="flex-1 min-[1440px]:hidden"
                onClick={onOpenOptions}
              >
                Options
              </Button>
            )}
          </div>
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-[24px] md:grid-cols-2 card3:grid-cols-3 min-[1513px]:grid-cols-1 min-[1513px]:w-max min-[1513px]:max-w-none">
          {displayedQuotes.length > 0 ? (
            displayedQuotes.map((quote) => (
              <div key={quote.id} className="min-w-0 w-full min-h-0 [&>*]:min-w-0 [&>*]:w-full">
                <QuoteCardDf
                  quote={quote}
                  policyType={policyType}
                  paymentOption={paymentOption}
                  onPaymentOptionChange={onPaymentOptionChange}
                  legalCover={legalCover}
                  homeEmergency={homeEmergency}
                  onLegalCoverChange={onLegalCoverChange}
                  onHomeEmergencyChange={onHomeEmergencyChange}
                  onMoreDetails={onMoreDetails}
                  onPurchase={onPurchase}
                />
              </div>
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
    </div>
  )
}

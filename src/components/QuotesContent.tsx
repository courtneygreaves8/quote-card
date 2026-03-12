import type { FilterOption, PaymentOption, Quote, SortOption } from "@/types/quote"
import { useState } from "react"
import { QuoteCard } from "@/components/QuoteCard"
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
  buildingsAccidentalDamage: boolean
  contentsAccidentalDamage: boolean
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
  buildingsAccidentalDamage,
  contentsAccidentalDamage,
  onMoreDetails,
  onPurchase,
  onOpenOptions,
}: QuotesContentProps) {
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null)

  const selectedQuote =
    selectedQuoteId != null
      ? displayedQuotes.find((q) => q.id === selectedQuoteId) ?? null
      : null

  return (
    <div className="w-full overflow-x-hidden py-8 px-4 sm:px-6">
      {/* Centre stage: compact up to lg; single horizontal card at ≥1340px */}
      <div className="mx-auto flex w-full max-w-full flex-col min-[1024px]:max-w-[968px] min-[1340px]:w-fit min-[1340px]:max-w-none min-[1340px]:items-center">
        <div className="mb-8 w-full flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-none lg:flex-row lg:items-center lg:justify-end">
            {onOpenOptions && (
              <Button
                type="button"
                variant="outline"
                className="h-9 w-full justify-center gap-1.5 border-border max-[767px]:flex min-[768px]:hidden"
                onClick={onOpenOptions}
              >
                Refine results
              </Button>
            )}
            <div className="flex w-full flex-col gap-2 min-[768px]:flex-row">
              <div className="w-full min-[768px]:flex-1 lg:w-60 lg:flex-none">
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
              <div className="w-full min-[768px]:flex-1 lg:w-60 lg:flex-none">
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
            </div>
            {onOpenOptions && (
              <Button
                type="button"
                variant="outline"
                className="h-9 w-full justify-center gap-1.5 border-border min-[768px]:flex min-[1340px]:hidden max-[767px]:hidden"
                onClick={onOpenOptions}
              >
                Refine results
              </Button>
            )}
          </div>
        </div>

        {/* Compact quote list under heading on small/medium screens */}
        {displayedQuotes.length > 0 && (
          <div className="mb-4 flex w-full gap-2 pb-1 max-[767px]:flex-col min-[768px]:flex min-[768px]:flex-nowrap min-[1296px]:hidden">
            {displayedQuotes.map((quote) => {
              const monthlyPrice = quote.piklPrice
              const annualPrice = monthlyPrice * 12
              const isMonthlyPrimary = paymentOption === "monthly"

              return (
                <button
                  key={quote.id}
                  type="button"
                  onClick={() => setSelectedQuoteId(quote.id)}
                  className="flex w-full min-[768px]:w-auto min-[768px]:flex-1 min-[768px]:basis-0 min-[768px]:min-w-0 items-center justify-between rounded-xl border border-border bg-white px-3 py-2 text-left text-xs shadow-sm hover:bg-muted/60"
                >
                  <span className="mr-2 flex min-w-0 flex-col">
                    <span className="truncate text-xs font-medium uppercase tracking-wide opacity-80">
                      {quote.providerName}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {policyType}
                    </span>
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-[#1E1E1E]">
                      £{(isMonthlyPrimary ? monthlyPrice : annualPrice).toFixed(2)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {isMonthlyPrimary ? "/mo." : "annual"}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Empty placeholder panel under compact list on small/medium screens */}
        {displayedQuotes.length > 0 && !selectedQuote && (
          <div className="mb-6 w-full max-[1295px]:block min-[1296px]:hidden max-[767px]:border-t max-[767px]:border-border max-[767px]:pt-4">
            <div className="w-full rounded-xl border border-dashed border-neutral-300 bg-[#FAFAFA] px-4 py-6 text-center">
              <p className="text-sm font-medium text-[#1E1E1E]">
                Select a quote to view it here.
              </p>
            </div>
          </div>
        )}

        {/* Desktop / large layout: full grid of QuoteCards */}
        <div className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1 max-[1295px]:hidden">
          {displayedQuotes.length > 0 ? (
            displayedQuotes.map((quote) => (
              <div key={quote.id} className="min-w-0 w-full min-h-0 [&>*]:min-w-0 [&>*]:w-full">
                <QuoteCard
                  quote={quote}
                  policyType={policyType}
                  paymentOption={paymentOption}
                  onPaymentOptionChange={onPaymentOptionChange}
                  legalCover={legalCover}
                  homeEmergency={homeEmergency}
                  buildingsAccidentalDamage={buildingsAccidentalDamage}
                  contentsAccidentalDamage={contentsAccidentalDamage}
                  onLegalCoverChange={onLegalCoverChange}
                  onHomeEmergencyChange={onHomeEmergencyChange}
                  onMoreDetails={onMoreDetails}
                  onPurchase={onPurchase}
                  monthlyBreakdownInDropdown
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

        {/* Small/medium screens: show only the selected QuoteCard */}
        {selectedQuote && (
          <div className="w-full max-[1295px]:block min-[1296px]:hidden">
            <div className="min-w-0 w-full min-h-0 [&>*]:min-w-0 [&>*]:w-full">
              <QuoteCard
                quote={selectedQuote}
                policyType={policyType}
                paymentOption={paymentOption}
                onPaymentOptionChange={onPaymentOptionChange}
                legalCover={legalCover}
                homeEmergency={homeEmergency}
                buildingsAccidentalDamage={buildingsAccidentalDamage}
                contentsAccidentalDamage={contentsAccidentalDamage}
                onLegalCoverChange={onLegalCoverChange}
                onHomeEmergencyChange={onHomeEmergencyChange}
                onMoreDetails={onMoreDetails}
                onPurchase={onPurchase}
                monthlyBreakdownInDropdown
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

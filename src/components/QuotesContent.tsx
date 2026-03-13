import type { FilterOption, PaymentOption, Quote, SortOption } from "@/types/quote"
import { useEffect, useState } from "react"
import { QuoteCard } from "@/components/QuoteCard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  homeEmergency: boolean
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
  homeEmergency,
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

  // #region agent log
  useEffect(() => {
    if (typeof window === "undefined") return

    const chip = document.querySelector<HTMLElement>("[data-debug-id='default-compact-chip']")
    if (!chip) return

    const price = chip.querySelector<HTMLElement>("[data-debug-id='default-compact-price']")
    const label = chip.querySelector<HTMLElement>("[data-debug-id='default-compact-price-label']")

    const chipRect = chip.getBoundingClientRect()
    const styles = window.getComputedStyle(chip)
    const priceRect = price?.getBoundingClientRect()
    const labelRect = label?.getBoundingClientRect()

    fetch("http://127.0.0.1:7243/ingest/11a05263-57d5-49cd-ac30-6dc80d1d7b44", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "493dbf",
      },
      body: JSON.stringify({
        sessionId: "493dbf",
        runId: "pre-fix",
        hypothesisId: "H-default-compact-chip-spacing",
        location: "QuotesContent.tsx:default-compact-chip-metrics",
        message: "Default compact quote chip layout metrics",
        data: {
          chip: {
            width: chipRect.width,
            height: chipRect.height,
            paddingLeft: styles.paddingLeft,
            paddingRight: styles.paddingRight,
            marginLeft: styles.marginLeft,
            marginRight: styles.marginRight,
          },
          price: priceRect
            ? {
                width: priceRect.width,
                right: priceRect.right,
                gapToChipRight: chipRect.right - priceRect.right,
              }
            : null,
          label: labelRect
            ? {
                width: labelRect.width,
                right: labelRect.right,
                gapToChipRight: chipRect.right - labelRect.right,
              }
            : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
  }, [displayedQuotes.length, paymentOption])
  // #endregion agent log

  return (
    <div className="w-full overflow-x-hidden py-8 px-4 sm:px-6">
      {/* Centre stage: compact up to lg; single horizontal card at ≥1340px */}
      <div className="mx-auto flex w-full max-w-full flex-col min-[1024px]:max-w-[968px] min-[1340px]:w-fit min-[1340px]:max-w-none min-[1340px]:items-center">
        <div className="mb-4 w-full flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
            <div className="flex w-full flex-row gap-2">
              <div className="w-full flex-1 lg:w-60 lg:flex-none">
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
              <div className="w-full flex-1 lg:w-60 lg:flex-none">
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
        <div className="mt-0 mb-4 block border-t border-border max-[767px]:block min-[768px]:hidden" />

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
                  data-debug-id="default-compact-chip"
                  className="flex w-full min-[768px]:w-auto min-[768px]:flex-1 min-[768px]:basis-0 min-[768px]:min-w-0 items-start rounded-xl border border-border bg-white px-3 py-3 text-left text-xs shadow-sm hover:bg-muted/60"
                >
                  <span className="flex w-full min-w-0 items-start gap-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100">
                      <span className="text-[10px] font-semibold text-slate-600">LOGO</span>
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      {/* Mobile (≤767px): row1 = insurer + price (right), row2 = policy + annual (right) */}
                      <span className="flex w-full items-baseline justify-between gap-2 max-[767px]:flex min-[768px]:hidden">
                        <span className="truncate text-xs font-medium uppercase tracking-wide opacity-80">
                          {quote.providerName}
                        </span>
                        <span
                          data-debug-id="default-compact-price"
                          className="shrink-0 text-sm font-semibold text-[#1E1E1E]"
                        >
                          £{(isMonthlyPrimary ? monthlyPrice : annualPrice).toFixed(2)}
                        </span>
                      </span>
                      <span className="flex w-full items-baseline justify-between gap-2 max-[767px]:flex min-[768px]:hidden">
                        <span className="truncate text-[11px] text-muted-foreground">
                          {policyType}
                        </span>
                        <span
                          data-debug-id="default-compact-price-label"
                          className="shrink-0 text-[11px] font-normal text-muted-foreground"
                        >
                          {isMonthlyPrimary ? "/mo." : "annual"}
                        </span>
                      </span>

                      {/* Tablet/desktop (≥768px): insurer + price (right), policy + term (right) */}
                      <span className="hidden w-full items-baseline justify-between gap-3 min-[768px]:flex">
                        <span className="truncate text-xs font-medium uppercase tracking-wide opacity-80">
                          {quote.providerName}
                        </span>
                        <span
                          data-debug-id="default-compact-price"
                          className="shrink-0 flex items-baseline gap-1 whitespace-nowrap text-sm font-semibold text-[#1E1E1E]"
                        >
                          £{(isMonthlyPrimary ? monthlyPrice : annualPrice).toFixed(2)}
                        </span>
                      </span>
                      <span className="hidden w-full items-baseline justify-between gap-7 min-[768px]:flex">
                        <span className="truncate text-[11px] text-muted-foreground">
                          {policyType === "Buildings & Contents" ? "Buildings & Conten" : policyType}
                        </span>
                        <span
                          data-debug-id="default-compact-price-label"
                          className="shrink-0 text-[11px] font-normal text-muted-foreground"
                        >
                          {isMonthlyPrimary ? "/mo." : "annual"}
                        </span>
                      </span>
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

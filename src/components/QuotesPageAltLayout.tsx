import { HelpFloatingButton } from "@/components/HelpFloatingButton"
import { LoadingModal } from "@/components/LoadingModal"
import { Navbar } from "@/components/Navbar"
import { PolicySheet } from "@/components/PolicySheet"
import { QuoteSidebar } from "@/components/QuoteSidebar"
import { QuoteCardDf } from "@/components/QuoteCardDf"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { useQuotesPage } from "@/hooks/useQuotesPage"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Check, Home, Scale, Star, Users, Wrench } from "lucide-react"
import { useState } from "react"

export type QuotesPageAltLayoutProps = ReturnType<typeof useQuotesPage> & {
  onLayoutChange: (variant: "default" | "alt") => void
}

export function QuotesPageAltLayout({
  quoteReference,
  filters,
  selectedQuote,
  sheetOpen,
  setSheetOpen,
  optionsOpen,
  setOptionsOpen,
  setFilters,
  showLoadingModal,
  displayedQuotes,
  handleSelectQuote,
  onLayoutChange,
  handleEditAnswers,
  handleMoreDetails,
  handlePurchase,
  handleLoadingComplete,
}: QuotesPageAltLayoutProps) {
  const activeQuote = selectedQuote ?? displayedQuotes[0] ?? null
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [altSortMode, setAltSortMode] = useState<"price" | "rating">("price")

  const primaryQuote =
    compareIds.length > 0
      ? displayedQuotes.find((q) => q.id === compareIds[0]) ?? activeQuote
      : activeQuote

  const secondaryQuote =
    compareIds.length > 1
      ? displayedQuotes.find((q) => q.id === compareIds[1]) ?? null
      : null

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id)
      }
      if (prev.length >= 2) {
        return prev
      }
      return [...prev, id]
    })
  }

  const sortedQuotes =
    altSortMode === "price"
      ? [...displayedQuotes].sort((a, b) => a.piklPrice - b.piklPrice)
      : [...displayedQuotes].sort((a, b) => b.trustpilotRating - a.trustpilotRating)

  return (
    <div className="flex h-screen flex-col bg-neutral-50 max-[767px]:bg-neutral-200">
      <Navbar activeLayout="alt" onSelectLayout={onLayoutChange} />
      <div className="flex min-h-0 flex-1">
        {/* Persistent sidebar on large screens */}
        <div className="hidden min-[1513px]:flex">
          <QuoteSidebar
            quoteReference={quoteReference}
            filters={filters}
            onFiltersChange={setFilters}
            onEditAnswers={handleEditAnswers}
          />
        </div>

        {/* Main area: quote list (secondary sidebar) + viewing pane */}
        <main className="min-w-0 flex-1 overflow-y-auto bg-neutral-50">
          {primaryQuote ? (
            <div className="flex h-full w-full flex-col gap-4 px-3 py-4 md:flex-row md:px-0 md:py-0">
              {/* Secondary sidebar: compact list of results (docked right on desktop) */}
              <section className="w-full md:order-2 md:ml-auto md:w-[320px] md:shrink-0 md:border-l md:border-border md:bg-white md:py-6 md:pl-3 md:pr-6 md:sticky md:top-0 md:h-full md:overflow-y-auto">
                {/* Quotes count + sort control */}
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold tracking-wide text-[#1E1E1E]">
                    {sortedQuotes.length} quotes found.
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-[11px] font-medium text-[#1E1E1E] border-neutral-200"
                    onClick={() =>
                      setAltSortMode((prev) => (prev === "price" ? "rating" : "price"))
                    }
                  >
                    {altSortMode === "price" ? "Sort: Lowest price" : "Sort: Highest rating"}
                  </Button>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto md:max-h-[calc(100vh-160px)]">
                  {sortedQuotes.map((quote) => {
                    const isActive = primaryQuote?.id === quote.id
                    const isCompared = compareIds.includes(quote.id)
                    const isCompareLimitReached = compareIds.length >= 2 && !isCompared
                    const compareTooltipLabel =
                      compareIds.length === 0
                        ? "Select two providers to compare."
                        : compareIds.length === 1
                        ? "Select one more provider to compare."
                        : "You can only select two providers at one time."
                    const monthlyPrice = quote.piklPrice
                    const annualPrice = monthlyPrice * 12
                    const isMonthlyPrimary = filters.paymentOption === "monthly"

                    return (
                      <button
                        key={quote.id}
                        type="button"
                        onClick={() => {
                          // On narrower viewports, open the policy sheet instead of showing the preview card
                          if (window.innerWidth <= 1119) {
                            handleMoreDetails(quote)
                          } else {
                            // Only control which quote is shown on the right;
                            // compare checkboxes exclusively control comparison selection.
                            handleSelectQuote(quote)
                          }
                        }}
                        className={[
                          "flex w-full items-center justify-between gap-2 rounded-[10px] border px-3 py-2 text-left text-sm transition-colors",
                          isActive
                            ? "border-[#111111] bg-white text-foreground"
                            : "border-border bg-white hover:bg-muted/60",
                        ].join(" ")}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          {/* Compare checkbox at start of row */}
                          {isCompareLimitReached && !isCompared ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  aria-pressed={isCompared}
                                  aria-label="Select for compare"
                                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border cursor-not-allowed opacity-60 bg-white"
                                >
                                  {isCompared && (
                                    <Check className="h-3 w-3 text-black" aria-hidden />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                You can only select two providers at one time.
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleCompare(quote.id)
                                  }}
                                  aria-pressed={isCompared}
                                  aria-label="Select for compare"
                                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border cursor-pointer bg-white"
                                >
                                  {isCompared && <Check className="h-3 w-3 text-black" aria-hidden />}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right">{compareTooltipLabel}</TooltipContent>
                            </Tooltip>
                          )}

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[#F5F5F5] text-[10px] font-semibold text-slate-600">
                            LOGO
                          </div>
                          <div className="min-w-0 flex flex-col gap-0.5">
                            <span className="truncate text-xs font-medium uppercase tracking-wide opacity-80">
                              {quote.providerName}
                            </span>
                            <span className="truncate text-[11px] text-muted-foreground">
                              {filters.policyType}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          {isMonthlyPrimary ? (
                            <>
                              <span className="text-[13px] font-semibold tabular-nums text-foreground">
                                £{monthlyPrice.toFixed(2)}/mo.
                              </span>
                              <span className="text-[13px] tabular-nums text-muted-foreground">
                                £{annualPrice.toFixed(2)} <span>annual</span>
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-[13px] font-semibold tabular-nums text-foreground">
                                £{annualPrice.toFixed(2)} <span>annual</span>
                              </span>
                              <span className="text-[13px] tabular-nums text-muted-foreground">
                                £{monthlyPrice.toFixed(2)}/mo.
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-full justify-center gap-1.5 border-border text-xs"
                    onClick={() => setCompareIds([])}
                  >
                    Deselect all
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-full justify-center gap-1.5 border-border text-xs min-[1513px]:hidden"
                    onClick={() => setOptionsOpen(true)}
                  >
                    Refine results
                  </Button>
                </div>
              </section>

              {/* Right column: selected quote summary (full details are in PolicySheet) */}
              {/* Hidden on <=1119px so small screens just use the list + sheet */}
              <section className="mt-4 hidden min-w-0 flex-1 md:order-1 md:mt-0 md:pl-6 md:pr-3 md:pt-6 md:max-w-[960px] md:mx-auto min-[1120px]:block">
                {/* Viewing header */}
                <div className="mb-3 flex items-center justify-between text-sm font-semibold uppercase tracking-wide text-[#1E1E1E]">
                  <span>{secondaryQuote && primaryQuote ? "Comparing" : "Viewing"}</span>
                  {secondaryQuote && primaryQuote ? (
                    <span className="normal-case font-normal">
                      {primaryQuote.providerName} vs {secondaryQuote.providerName}
                    </span>
                  ) : primaryQuote ? (
                    <span className="normal-case font-normal">{primaryQuote.providerName}</span>
                  ) : null}
                </div>

                {/* Simple comparison table when two quotes are selected */}
                {secondaryQuote && primaryQuote && (
                  <div className="mb-3 rounded-[16px] border border-border bg-white px-4 py-3">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <span>Comparison table</span>
                      <span className="normal-case font-normal text-[11px] text-[#1E1E1E]">
                        {primaryQuote.providerName} vs {secondaryQuote.providerName}
                      </span>
                    </div>
                    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)] gap-y-1.5 text-[11px] text-muted-foreground">
                      <div />
                      <div className="truncate font-medium text-[#1E1E1E]">
                        {primaryQuote.providerName}
                      </div>
                      <div className="truncate font-medium text-[#1E1E1E]">
                        {secondaryQuote.providerName}
                      </div>

                      <div className="truncate">Overall</div>
                      <div className="font-medium text-[#16a34a]">Good fit</div>
                      <div className="font-medium text-[#16a34a]">Good fit</div>

                      <div className="truncate">Annual price</div>
                      <div className="font-medium text-[#1E1E1E]">
                        £
                        {(
                          primaryQuote.standardPrice +
                          primaryQuote.piklPrice +
                          primaryQuote.familyLegalAddOnPrice +
                          primaryQuote.homeEmergencyAddOnPrice
                        ).toFixed(2)}
                      </div>
                      <div className="font-medium text-[#1E1E1E]">
                        £
                        {(
                          secondaryQuote.standardPrice +
                          secondaryQuote.piklPrice +
                          secondaryQuote.familyLegalAddOnPrice +
                          secondaryQuote.homeEmergencyAddOnPrice
                        ).toFixed(2)}
                      </div>

                      <div className="truncate">Monthly price</div>
                      <div className="font-medium text-[#1E1E1E]">
                        £
                        {(
                          primaryQuote.standardPrice +
                          primaryQuote.piklPrice +
                          primaryQuote.familyLegalAddOnPrice +
                          primaryQuote.homeEmergencyAddOnPrice
                        )
                          .toFixed(2)
                          .replace(".00", "")}
                        /mo.
                      </div>
                      <div className="font-medium text-[#1E1E1E]">
                        £
                        {(
                          secondaryQuote.standardPrice +
                          secondaryQuote.piklPrice +
                          secondaryQuote.familyLegalAddOnPrice +
                          secondaryQuote.homeEmergencyAddOnPrice
                        )
                          .toFixed(2)
                          .replace(".00", "")}
                        /mo.
                      </div>

                      <div className="truncate">Home cover</div>
                      <div>Included</div>
                      <div>Included</div>

                      <div className="truncate">Host cover</div>
                      <div>Included</div>
                      <div>Included</div>
                    </div>
                  </div>
                )}

                {/* Primary card when at least one quote is selected */}
                {primaryQuote ? (
                  <div className="mb-0 flex flex-col gap-1">
                    <div className="w-full max-w-[960px]">
                      <QuoteCardDf
                        quote={primaryQuote}
                        policyType={filters.policyType}
                        paymentOption={filters.paymentOption}
                        onPaymentOptionChange={(option) =>
                          setFilters((prev) => ({ ...prev, paymentOption: option }))
                        }
                        legalCover={filters.legalCover}
                        homeEmergency={filters.homeEmergency}
                        onLegalCoverChange={(checked) =>
                          setFilters((prev) => ({ ...prev, legalCover: checked }))
                        }
                        onHomeEmergencyChange={(checked) =>
                          setFilters((prev) => ({ ...prev, homeEmergency: checked }))
                        }
                        onMoreDetails={handleMoreDetails}
                        onPurchase={() => handlePurchase()}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center px-4">
                    <div className="w-full max-w-md rounded-[12px] border border-dashed border-neutral-300 bg-[#FAFAFA] px-4 py-6 text-center">
                      <p className="text-sm font-medium text-[#1E1E1E]">
                        Please select a quote to view.
                      </p>
                    </div>
                  </div>
                )}

                {/* Secondary selected card when comparing two */}
                {secondaryQuote && (
                  <div className="mt-0 flex flex-col gap-1">
                    <Separator className="my-4" />
                    <div className="w-full max-w-[960px]">
                      <QuoteCardDf
                        quote={secondaryQuote}
                        policyType={filters.policyType}
                        paymentOption={filters.paymentOption}
                        onPaymentOptionChange={(option) =>
                          setFilters((prev) => ({ ...prev, paymentOption: option }))
                        }
                        legalCover={filters.legalCover}
                        homeEmergency={filters.homeEmergency}
                        onLegalCoverChange={(checked) =>
                          setFilters((prev) => ({ ...prev, legalCover: checked }))
                        }
                        onHomeEmergencyChange={(checked) =>
                          setFilters((prev) => ({ ...prev, homeEmergency: checked }))
                        }
                        onMoreDetails={handleMoreDetails}
                        onPurchase={() => handlePurchase()}
                      />
                    </div>
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center px-4">
              <div className="w-full max-w-md rounded-[12px] border border-dashed border-neutral-300 bg-[#FAFAFA] px-4 py-6 text-center">
                <p className="text-sm font-medium text-[#1E1E1E]">
                  Please select a quote to view.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Options sidebar as sheet (same as default layout) */}
      <Sheet open={optionsOpen} onOpenChange={setOptionsOpen}>
        <SheetContent
          side="right"
          className="flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white p-0"
        >
          <QuoteSidebar
            quoteReference={quoteReference}
            filters={filters}
            onFiltersChange={setFilters}
            onEditAnswers={handleEditAnswers}
            isSheet
            onCloseSheet={() => setOptionsOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Policy sheet drawer + loader for full flow */}
      <PolicySheet
        quote={selectedQuote}
        quoteReference={quoteReference}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onPurchase={handlePurchase}
      />

      <LoadingModal open={showLoadingModal} onClose={handleLoadingComplete} />
      <HelpFloatingButton />
    </div>
  )
}


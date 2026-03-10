import { LoadingModal } from "@/components/LoadingModal"
import { Navbar } from "@/components/Navbar"
import { PolicySheet } from "@/components/PolicySheet"
import { QuoteSidebar } from "@/components/QuoteSidebar"
import { QuoteCardDf } from "@/components/QuoteCardDf"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { useQuotesPage } from "@/hooks/useQuotesPage"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Check, Star } from "lucide-react"
import { useState } from "react"
import { PAYMENT_ACTIVE_CLASS, PAYMENT_INACTIVE_CLASS } from "@/lib/constants"

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
  const [viewMode, setViewMode] = useState<"all" | "compare">("compare")
  const [sortMode, setSortMode] = useState<"price" | "rating">("price")

  const primaryQuote =
    compareIds.length > 0
      ? displayedQuotes.find((q) => q.id === compareIds[0]) ?? activeQuote
      : activeQuote

  const secondaryQuote =
    compareIds.length > 1
      ? displayedQuotes.find((q) => q.id === compareIds[1]) ?? null
      : null

  const tertiaryQuote =
    compareIds.length > 2
      ? displayedQuotes.find((q) => q.id === compareIds[2]) ?? null
      : null

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id)
      }
      if (prev.length >= 3) {
        return prev
      }
      return [...prev, id]
    })
  }

  const sortedQuotes =
    sortMode === "price"
      ? [...displayedQuotes].sort((a, b) => a.piklPrice - b.piklPrice)
      : [...displayedQuotes].sort((a, b) => b.trustpilotRating - a.trustpilotRating)

  return (
    <div className="flex h-screen flex-col bg-neutral-50 max-[767px]:bg-neutral-200">
      <Navbar activeLayout="alt" onSelectLayout={onLayoutChange} />
      <div className="flex min-h-0 flex-1">
        {/* Persistent sidebar on very large screens */}
        <div className="hidden min-[1620px]:flex">
          <QuoteSidebar
            quoteReference={quoteReference}
            filters={filters}
            onFiltersChange={setFilters}
            onEditAnswers={handleEditAnswers}
          />
        </div>

        {/* Main area: quote list (secondary sidebar) + viewing pane */}
        <main className="min-w-0 flex-1 overflow-y-auto bg-neutral-50 pb-4">
          {primaryQuote ? (
            <div className="flex h-full w-full flex-col gap-4 px-3 py-4 max-[1295px]:items-center max-[1295px]:justify-center md:flex-row md:px-0 md:py-0 min-[1296px]:pr-[320px]">
              {/* Secondary sidebar: compact list of results (fixed right on desktop, scrollable) */}
              <section className="w-full max-w-[960px] md:order-2 md:shrink-0 min-[1296px]:ml-auto min-[1296px]:fixed min-[1296px]:right-0 min-[1296px]:top-14 min-[1296px]:z-10 min-[1296px]:flex min-[1296px]:w-[320px] min-[1296px]:h-[calc(100vh-3.5rem)] min-[1296px]:flex-col min-[1296px]:overflow-hidden min-[1296px]:border-l min-[1296px]:border-border min-[1296px]:bg-white min-[1296px]:px-6 min-[1296px]:py-6">
              {/* Small-screen heading + subcopy */}
              <div className="mb-4 hidden max-[1295px]:block">
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-xl max-[480px]:text-lg font-bold tracking-tight text-foreground">
                    We have {displayedQuotes.length} quote{displayedQuotes.length === 1 ? "" : "s"} for you.
                  </h1>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[11px] font-medium border-neutral-200"
                    onClick={() =>
                      setSortMode((prev) => (prev === "price" ? "rating" : "price"))
                    }
                  >
                    {sortMode === "price" ? "Sort: Lowest price" : "Sort: Highest rating"}
                  </Button>
                </div>
                <p className="mt-1 text-sm max-[480px]:text-xs text-muted-foreground">
                  Find the quote right for you.
                </p>
              </div>
              {/* Compare heading + sort control on one line (desktop and larger) */}
              <div className="mb-2 hidden items-center gap-2 min-[1296px]:flex">
                <span className="flex-1 text-sm font-semibold tracking-wide text-[#1E1E1E]">
                  Select &amp; compare
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-[11px] font-medium border-neutral-200"
                  onClick={() =>
                    setSortMode((prev) => (prev === "price" ? "rating" : "price"))
                  }
                >
                  {sortMode === "price" ? "Sort: Lowest price" : "Sort: Highest rating"}
                </Button>
              </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                  {sortedQuotes.map((quote) => {
                    const isActive = primaryQuote?.id === quote.id
                    const isCompared = compareIds.includes(quote.id)
                    const isCompareLimitReached = compareIds.length >= 3 && !isCompared
                    const compareTooltipLabel =
                      compareIds.length === 0
                        ? "Select up to three providers to compare."
                        : compareIds.length === 1
                        ? "Select up to two more providers to compare."
                        : compareIds.length === 2
                        ? "Select one more provider to compare."
                        : "You can only select three providers at one time."
                    const monthlyPrice = quote.piklPrice
                    const annualPrice = monthlyPrice * 12
                    const isMonthlyPrimary = filters.paymentOption === "monthly"

                    return (
                      <div key={quote.id} className="flex w-full items-stretch gap-2">
                        <button
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
                            "flex w-full items-stretch gap-2 rounded-[10px] border px-3 py-2 text-left text-sm transition-colors",
                            isActive
                              ? "border-[#111111] bg-white text-foreground"
                              : "border-border bg-white hover:bg-muted/60",
                          ].join(" ")}
                        >
                          {/* Logo block on the left for small screens */}
                          <div className="hidden max-[1295px]:flex aspect-square shrink-0 items-center justify-center self-stretch rounded-[8px] bg-[#F5F5F5]">
                            <span className="text-[10px] font-semibold text-muted-foreground">
                              LOGO
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-1">
                            {/* Policy type pill above insurer name on small screens */}
                            <span className="mb-1 inline-flex w-fit self-start max-[1295px]:inline-flex min-[1296px]:hidden items-center rounded-[4px] border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                              {filters.policyType}
                            </span>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex min-w-0 items-center gap-1.5">
                                <span className="truncate text-xs font-medium uppercase tracking-wide opacity-80">
                                  {quote.providerName}
                                </span>
                                <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-foreground">
                                  {quote.trustpilotRating.toFixed(1)}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Star className="h-3 w-3 fill-amber-400 text-amber-500" aria-hidden />
                                    </TooltipTrigger>
                                    <TooltipContent side="right">TrustPilot</TooltipContent>
                                  </Tooltip>
                                </span>
                              </div>
                              {/* Compare checkbox hidden on <=1295px */}
                              <div className="max-[1295px]:hidden">
                                {isCompareLimitReached && !isCompared ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        aria-pressed={isCompared}
                                        aria-label="Select for compare"
                                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-white opacity-60 cursor-not-allowed"
                                      >
                                        {isCompared && (
                                          <Check className="h-3 w-3 text-black" aria-hidden />
                                        )}
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                      You can only select three providers at one time.
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
                                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-white cursor-pointer"
                                      >
                                        {isCompared && (
                                          <Check className="h-3 w-3 text-black" aria-hidden />
                                        )}
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                      {compareTooltipLabel}
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                            {/* Original inline policy text kept for >=1296px only */}
                            <span className="truncate text-[11px] text-muted-foreground max-[1295px]:hidden">
                              {filters.policyType}
                            </span>
                            <div className="mt-0.5 flex w-full items-baseline justify-start gap-2">
                              {isMonthlyPrimary ? (
                                <>
                                  <span className="text-[13px] font-semibold tabular-nums text-foreground">
                                    £{monthlyPrice.toFixed(2)}/mo.
                                  </span>
                                  <span className="text-[11px] text-muted-foreground">or</span>
                                  <span className="text-[13px] tabular-nums text-muted-foreground">
                                    £{annualPrice.toFixed(2)} <span>annual</span>
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-[13px] font-semibold tabular-nums text-foreground">
                                    £{annualPrice.toFixed(2)} <span>annual</span>
                                  </span>
                                  <span className="text-[11px] text-muted-foreground">or</span>
                                  <span className="text-[13px] tabular-nums text-muted-foreground">
                                    £{monthlyPrice.toFixed(2)}/mo.
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 flex flex-col gap-2">
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
              {/* Hidden on <1296px so small/medium screens just use the list + sheet */}
              <section className="mt-4 mb-4 hidden min-w-0 flex-1 md:order-1 md:mt-0 min-[1296px]:flex min-[1296px]:justify-center min-[1296px]:pt-6">
                <div className="w-full max-w-[960px]">
                {/* Centre stage header — same as Org layout (QuotesContent) */}
                <div className="mb-8 flex w-full flex-col gap-4 min-[960px]:flex-row min-[960px]:items-start min-[960px]:justify-between">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      We've found {displayedQuotes.length} quote{displayedQuotes.length === 1 ? "" : "s"} for you.
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                      Select up to 3 insurers on the right to compare, or view all quotes.
                    </p>
                  </div>
                  <div className="flex w-full min-[960px]:w-auto min-[960px]:flex-none min-[960px]:items-center min-[960px]:justify-end">
                    <div className="flex h-10 w-full max-w-[260px] items-center gap-0.5 rounded-[8px] border border-input bg-muted/30 p-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={viewMode === "all" ? PAYMENT_ACTIVE_CLASS : PAYMENT_INACTIVE_CLASS}
                        onClick={() => setViewMode("all")}
                      >
                        View all quotes
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={viewMode === "compare" ? PAYMENT_ACTIVE_CLASS : PAYMENT_INACTIVE_CLASS}
                        onClick={() => setViewMode("compare")}
                      >
                        Compare quotes
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comparison table when at least two quotes are selected in Compare mode */}
                {viewMode === "compare" && secondaryQuote && primaryQuote && (
                  <div className="mb-3 rounded-[16px] border border-border bg-white px-4 py-3">
                    <div className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground">
                      {tertiaryQuote
                        ? `${primaryQuote.providerName} vs ${secondaryQuote.providerName} vs ${tertiaryQuote.providerName}`
                        : `${primaryQuote.providerName} vs ${secondaryQuote.providerName}`}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[280px] border-collapse text-[11px] text-muted-foreground">
                        <thead>
                          <tr className="border-b border-border text-left text-[12px] font-semibold">
                            <th className="py-2 pr-4 text-muted-foreground" scope="col">
                              Feature
                            </th>
                            <th className="py-2 pr-4 text-left text-[#1E1E1E]" scope="col">
                              {primaryQuote.providerName}
                            </th>
                            <th className="py-2 text-left text-[#1E1E1E]" scope="col">
                              {secondaryQuote.providerName}
                            </th>
                            {tertiaryQuote && (
                              <th className="py-2 text-left text-[#1E1E1E]" scope="col">
                                {tertiaryQuote.providerName}
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="[&>tr:nth-child(even)]:bg-neutral-100">
                          <tr>
                            <td className="py-2 pr-4">Annual price</td>
                            <td className="py-2 pr-4 font-medium text-[#1E1E1E]">
                              £
                              {(
                                primaryQuote.standardPrice +
                                primaryQuote.piklPrice +
                                primaryQuote.familyLegalAddOnPrice +
                                primaryQuote.homeEmergencyAddOnPrice
                              ).toFixed(2)}
                            </td>
                            <td className="py-2 font-medium text-[#1E1E1E]">
                              £
                              {(
                                secondaryQuote.standardPrice +
                                secondaryQuote.piklPrice +
                                secondaryQuote.familyLegalAddOnPrice +
                                secondaryQuote.homeEmergencyAddOnPrice
                              ).toFixed(2)}
                            </td>
                            {tertiaryQuote && (
                              <td className="py-2 font-medium text-[#1E1E1E]">
                                £
                                {(
                                  tertiaryQuote.standardPrice +
                                  tertiaryQuote.piklPrice +
                                  tertiaryQuote.familyLegalAddOnPrice +
                                  tertiaryQuote.homeEmergencyAddOnPrice
                                ).toFixed(2)}
                              </td>
                            )}
                          </tr>
                          <tr>
                            <td className="py-2 pr-4">Monthly price</td>
                            <td className="py-2 pr-4 font-medium text-[#1E1E1E]">
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
                            </td>
                            <td className="py-2 font-medium text-[#1E1E1E]">
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
                            </td>
                            {tertiaryQuote && (
                              <td className="py-2 font-medium text-[#1E1E1E]">
                                £
                                {(
                                  tertiaryQuote.standardPrice +
                                  tertiaryQuote.piklPrice +
                                  tertiaryQuote.familyLegalAddOnPrice +
                                  tertiaryQuote.homeEmergencyAddOnPrice
                                )
                                  .toFixed(2)
                                  .replace(".00", "")}
                                /mo.
                              </td>
                            )}
                          </tr>
                          <tr>
                            <td className="py-2 pr-4">Buildings cover</td>
                            <td className="py-2 pr-4">Up to £1,000,000</td>
                            <td className="py-2">Up to £750,000</td>
                            {tertiaryQuote && <td className="py-2">Up to £1,200,000</td>}
                          </tr>
                          <tr>
                            <td className="py-2 pr-4">Contents cover</td>
                            <td className="py-2 pr-4">Up to £50,000</td>
                            <td className="py-2">Up to £40,000</td>
                            {tertiaryQuote && <td className="py-2">Up to £60,000</td>}
                          </tr>
                          <tr>
                            <td className="py-2 pr-4">Successful claims</td>
                            <td className="py-2 pr-4">94.3% in last 12 months</td>
                            <td className="py-2">92.8% in last 12 months</td>
                            {tertiaryQuote && (
                              <td className="py-2">95.6% in last 12 months</td>
                            )}
                          </tr>
                          <tr>
                            <td className="py-2 pr-4">Defaqto rating</td>
                            <td className="py-2 pr-4">4.8 / 5</td>
                            <td className="py-2">4.6 / 5</td>
                            {tertiaryQuote && <td className="py-2">4.9 / 5</td>}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Primary / list view when at least one quote is available */}
                {viewMode === "all" ? (
                  <div className="mb-0 flex flex-col gap-3">
                    {displayedQuotes.map((quote) => (
                      <div key={quote.id} className="w-full max-w-[960px]">
                        <QuoteCardDf
                          quote={quote}
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
                          monthlyBreakdownInDropdown
                          forceHorizontalLayout
                        />
                      </div>
                    ))}
                  </div>
                ) : primaryQuote ? (
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
                        monthlyBreakdownInDropdown
                        forceHorizontalLayout
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

                {/* Secondary selected card when comparing multiple */}
                {viewMode === "compare" && secondaryQuote && (
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
                        monthlyBreakdownInDropdown
                        forceHorizontalLayout
                      />
                    </div>
                  </div>
                )}

                {/* Tertiary selected card when comparing three */}
                {viewMode === "compare" && tertiaryQuote && (
                  <div className="mt-0 flex flex-col gap-1">
                    <Separator className="my-4" />
                    <div className="w-full max-w-[960px]">
                      <QuoteCardDf
                        quote={tertiaryQuote}
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
                        monthlyBreakdownInDropdown
                        forceHorizontalLayout
                      />
                    </div>
                  </div>
                )}
                </div>
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
    </div>
  )
}


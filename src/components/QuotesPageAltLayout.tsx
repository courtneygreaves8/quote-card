import { Check, Star } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { PolicySheet } from "@/components/PolicySheet"
import { QuoteSidebar } from "@/components/QuoteSidebar"
import { QuoteCard } from "@/components/QuoteCard"
import { ResponsiveTooltip } from "@/components/ResponsiveTooltip"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PAYMENT_ACTIVE_CLASS, PAYMENT_INACTIVE_CLASS, QUOTE_LIST_POLL_DURATION_MS } from "@/lib/constants"
import type { useQuotesPage } from "@/hooks/useQuotesPage"
import { useQuotesAltLayout } from "@/hooks/useQuotesAltLayout"

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
  displayedQuotes,
  handleSelectQuote,
  onLayoutChange,
  handleEditAnswers,
  handleMoreDetails,
  handlePurchase,
}: QuotesPageAltLayoutProps) {
  const {
    primaryQuote,
    secondaryQuote,
    tertiaryQuote,
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    visibleQuoteCount,
    sortedQuotes,
    compareIds,
    handleToggleCompare,
    handleQuoteListClick,
  } = useQuotesAltLayout({
    displayedQuotes,
    selectedQuote,
    onMoreDetails: handleMoreDetails,
    onSelectQuote: handleSelectQuote,
  })

  return (
    <div className="flex h-screen flex-col bg-neutral-50 max-[767px]:bg-[#F1F1F1]">
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
        <main className="min-w-0 flex-1 overflow-y-auto bg-neutral-50 pb-4 max-[767px]:bg-[#F1F1F1] max-[1295px]:hidden">
          {primaryQuote ? (
            <div className="flex h-full w-full flex-col gap-4 px-3 py-4 max-[1295px]:items-center max-[1295px]:justify-center max-[767px]:items-start max-[767px]:justify-start md:flex-row md:px-3 md:py-4 min-[976px]:px-0 min-[976px]:py-0 min-[1296px]:pr-[320px]">
              {/* Secondary sidebar: compact list of results (fixed right on desktop, scrollable) */}
              <section className="w-full max-w-[960px] md:order-2 md:shrink-0 min-[1296px]:ml-auto min-[1296px]:fixed min-[1296px]:right-0 min-[1296px]:top-14 min-[1296px]:z-10 min-[1296px]:flex min-[1296px]:w-[320px] min-[1296px]:h-[calc(100vh-3.5rem)] min-[1296px]:flex-col min-[1296px]:overflow-hidden min-[1296px]:border-l min-[1296px]:border-border min-[1296px]:bg-white min-[1296px]:px-6 min-[1296px]:py-6">
              {/* Small-screen heading + subcopy */}
              <div className="mb-4 hidden max-[1295px]:block">
                <h1 className="text-xl max-[767px]:text-2xl max-[480px]:text-xl font-bold tracking-tight text-foreground">
                  We have {visibleQuoteCount} quote{visibleQuoteCount === 1 ? "" : "s"} for you.
                </h1>
                <p className="mt-1 text-base max-[480px]:text-sm text-muted-foreground">
                  Find the quote right for you.
                </p>
                {/* Mobile actions row: sort + refine (≤767px) */}
                <div className="mt-3 flex items-center gap-2 max-[767px]:flex min-[768px]:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 px-3 text-xs font-medium border-neutral-200"
                    onClick={() =>
                      setSortMode((prev) => (prev === "price" ? "rating" : "price"))
                    }
                  >
                    {sortMode === "price" ? "Sort: Lowest price" : "Sort: Highest rating"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 px-3 text-xs font-medium border-border"
                    onClick={() => setOptionsOpen(true)}
                  >
                    Refine results
                  </Button>
                </div>
                {/* Tablet heading row: sort + refine (768px–1295px) */}
                <div className="mt-3 hidden items-center gap-2 min-[768px]:flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 px-3 text-xs font-medium border-neutral-200"
                    onClick={() =>
                      setSortMode((prev) => (prev === "price" ? "rating" : "price"))
                    }
                  >
                    {sortMode === "price" ? "Sort: Lowest price" : "Sort: Highest rating"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 px-3 text-xs font-medium border-border"
                    onClick={() => setOptionsOpen(true)}
                  >
                    Refine results
                  </Button>
                </div>
              </div>
              {/* Compare heading + sort control on one line (desktop and larger) */}
              <div className="mb-2 hidden items-center gap-2 min-[1296px]:flex">
                <span className="flex-1 text-sm font-semibold tracking-wide text-[#1E1E1E]">
                  Select &amp; compare
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs font-medium border-neutral-200"
                  onClick={() =>
                    setSortMode((prev) => (prev === "price" ? "rating" : "price"))
                  }
                >
                  {sortMode === "price" ? "Sort: Lowest price" : "Sort: Highest rating"}
                </Button>
              </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                  {sortedQuotes.map((quote, index) => {
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

                    const delayMs =
                      sortedQuotes.length > 1
                        ? (index / (sortedQuotes.length - 1)) * QUOTE_LIST_POLL_DURATION_MS
                        : 0

                    return (
                      <div
                        key={quote.id}
                        className="flex w-full items-stretch gap-2 quote-list-poll-in"
                        style={{ ["--quote-poll-delay" as string]: `${delayMs}ms` }}
                      >
                        <button
                          type="button"
                          onClick={() => handleQuoteListClick(quote)}
                          className={[
                            "flex w-full items-stretch gap-2 rounded-xl border px-3 py-2 max-[767px]:py-3 text-left text-sm transition-colors",
                            isActive
                              ? "border-[#111111] bg-white text-foreground"
                              : "border-border bg-white hover:bg-muted/60",
                          ].join(" ")}
                        >
                          {/* Logo block on the left for small screens */}
                          <div className="hidden max-[1295px]:flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F5F5F5]">
                            {quote.logo ? (
                              <img
                                src={quote.logo}
                                alt=""
                                className="h-full w-full object-contain object-center"
                              />
                            ) : (
                              <span className="text-xs font-semibold text-muted-foreground">
                                LOGO
                              </span>
                            )}
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-1">
                            {/* Policy type pill above insurer name on small screens */}
                            <span className="mb-1 inline-flex w-fit self-start max-[1295px]:inline-flex min-[1296px]:hidden items-center rounded border border-border px-1.5 py-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {filters.policyType}
                            </span>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex min-w-0 items-center gap-1.5">
                                <span className="truncate text-xs font-medium uppercase tracking-wide opacity-80">
                                  {quote.providerName}
                                </span>
                                <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-foreground">
                                  {quote.trustpilotRating.toFixed(1)}
                                  <ResponsiveTooltip side="right" content="Defaqto rating">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" aria-hidden />
                                  </ResponsiveTooltip>
                                </span>
                              </div>
                              {/* Compare checkbox hidden on <=1295px */}
                              <div className="max-[1295px]:hidden">
                                {isCompareLimitReached && !isCompared ? (
                                  <ResponsiveTooltip
                                    side="right"
                                    content="You can only select three providers at one time."
                                  >
                                    <button
                                      type="button"
                                      aria-pressed={isCompared}
                                      aria-label="Select for compare"
                                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-white opacity-60 cursor-not-allowed"
                                    >
                                      {isCompared && (
                                        <Check className="h-3 w-3 text-brand-dark" aria-hidden />
                                      )}
                                    </button>
                                  </ResponsiveTooltip>
                                ) : (
                                  <ResponsiveTooltip side="right" content={compareTooltipLabel}>
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
                                        <Check className="h-3 w-3 text-brand-dark" aria-hidden />
                                      )}
                                    </button>
                                  </ResponsiveTooltip>
                                )}
                              </div>
                            </div>
                            {/* Original inline policy text kept for >=1296px only */}
                            <span className="truncate text-xs text-muted-foreground max-[1295px]:hidden">
                              {filters.policyType}
                            </span>
                            <div className="mt-0.5 flex w-full items-baseline justify-start gap-2">
                              {isMonthlyPrimary ? (
                                <>
                                  <span className="text-sm font-semibold tabular-nums text-foreground">
                                    £{monthlyPrice.toFixed(2)}/mo.
                                  </span>
                                  <span className="text-xs text-muted-foreground">or</span>
                                  <span className="text-sm tabular-nums text-muted-foreground">
                                    £{annualPrice.toFixed(2)} <span>annual</span>
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-sm font-semibold tabular-nums text-foreground">
                                    £{annualPrice.toFixed(2)} <span>annual</span>
                                  </span>
                                  <span className="text-xs text-muted-foreground">or</span>
                                  <span className="text-sm tabular-nums text-muted-foreground">
                                    £{monthlyPrice.toFixed(2)}/mo.
                                  </span>
                                </>
                              )}
                            </div>
                            {/* Mobile-only view button at bottom of card */}
                            <div className="mt-2 max-[767px]:flex min-[768px]:hidden">
                              <Button
                                size="sm"
                                className="h-9 w-full justify-center rounded text-xs font-medium"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMoreDetails(quote)
                                }}
                              >
                                View
                              </Button>
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
                    className="h-9 w-full justify-center gap-1.5 border-border text-xs min-[1513px]:hidden max-[1295px]:hidden"
                    onClick={() => setOptionsOpen(true)}
                  >
                    Refine results
                  </Button>
                </div>
              </section>

              {/* Right column: selected quote summary (full details are in PolicySheet) */}
              {/* Hidden on <1296px so small/medium screens just use the list + sheet */}
              <section className="mt-4 mb-4 hidden min-w-0 flex-1 md:order-1 md:mt-0 min-[1296px]:flex min-[1296px]:justify-center min-[1296px]:pt-6">
                <div className="w-full max-w-full min-[1024px]:max-w-[968px]">
                {/* Centre stage header — same as Org layout (QuotesContent) */}
                <div className="mb-8 flex w-full flex-col gap-4 min-[960px]:flex-row min-[960px]:items-start min-[960px]:justify-between">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      We've found {visibleQuoteCount} quote{visibleQuoteCount === 1 ? "" : "s"} for you.
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                      Select up to 3 insurers on the right to compare, or view all quotes.
                    </p>
                  </div>
                  <div className="flex w-full min-[960px]:w-auto min-[960px]:flex-none min-[960px]:items-center min-[960px]:justify-end">
                    <div className="flex h-fit w-full max-w-[260px] items-center gap-0.5 rounded-lg border border-input bg-muted/30 p-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`${
                          viewMode === "all" ? PAYMENT_ACTIVE_CLASS : PAYMENT_INACTIVE_CLASS
                        } rounded-[8px]`}
                        onClick={() => setViewMode("all")}
                      >
                        View all quotes
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`${
                          viewMode === "compare" ? PAYMENT_ACTIVE_CLASS : PAYMENT_INACTIVE_CLASS
                        } rounded-[8px]`}
                        onClick={() => setViewMode("compare")}
                      >
                        Compare quotes
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comparison table when at least two quotes are selected in Compare mode */}
                {viewMode === "compare" && secondaryQuote && primaryQuote && (
                  <div className="mb-3 rounded-2xl border border-border bg-white px-4 py-3">
                    <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground">
                      <span className="inline-flex w-fit items-center rounded border border-border bg-muted px-2 py-1 text-[#1E1E1E]">
                        {primaryQuote.providerName}
                      </span>
                      <span>vs</span>
                      <span className="inline-flex w-fit items-center rounded border border-border bg-muted px-2 py-1 text-[#1E1E1E]">
                        {secondaryQuote.providerName}
                      </span>
                      {tertiaryQuote && (
                        <>
                          <span>vs</span>
                          <span className="inline-flex w-fit items-center rounded border border-border bg-muted px-2 py-1 text-[#1E1E1E]">
                            {tertiaryQuote.providerName}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[280px] border-collapse text-xs text-muted-foreground">
                        <thead>
                          <tr className="border-b border-border text-left text-xs font-semibold">
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
                      <div key={quote.id} className="w-full max-w-full min-[1024px]:max-w-[968px]">
                        <QuoteCard
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
                        />
                      </div>
                    ))}
                  </div>
                ) : primaryQuote ? (
                  <div className="mb-0 flex flex-col gap-1">
                    <div className="w-full max-w-full min-[1024px]:max-w-[968px]">
                      <QuoteCard
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
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center px-4">
                    <div className="w-full max-w-md rounded-xl border border-dashed border-neutral-300 bg-[#FAFAFA] px-4 py-6 text-center">
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
                    <div className="w-full max-w-full min-[1024px]:max-w-[968px]">
                      <QuoteCard
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
                      />
                    </div>
                  </div>
                )}

                {/* Tertiary selected card when comparing three */}
                {viewMode === "compare" && tertiaryQuote && (
                  <div className="mt-0 flex flex-col gap-1">
                    <Separator className="my-4" />
                    <div className="w-full max-w-full min-[1024px]:max-w-[968px]">
                      <QuoteCard
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
                      />
                    </div>
                  </div>
                )}
                </div>
              </section>
            </div>
          ) : (
                  <div className="flex h-full items-center justify-center px-4">
                    <div className="w-full max-w-md rounded-xl border border-dashed border-neutral-300 bg-[#FAFAFA] px-4 py-6 text-center">
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
    </div>
  )
}


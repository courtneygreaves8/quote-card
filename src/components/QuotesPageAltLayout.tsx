import { HelpFloatingButton } from "@/components/HelpFloatingButton"
import { LoadingModal } from "@/components/LoadingModal"
import { Navbar } from "@/components/Navbar"
import { PolicySheet } from "@/components/PolicySheet"
import { QuoteSidebar } from "@/components/QuoteSidebar"
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

                {/* Primary card when at least one quote is selected */}
                {primaryQuote ? (
                  <div className="mb-0 flex flex-col gap-1">
                    {/* Summary header */}
                    <div className="mb-0 flex flex-col gap-2 rounded-[16px] border border-border bg-white px-3 py-3">
                      <div className="flex items-center justify-between gap-4">
                        {/* Left: logo + rating + insurer name */}
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[8px] bg-[#F5F5F5] text-xs font-semibold text-slate-600">
                            LOGO
                          </div>
                          <div className="flex min-w-0 flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" aria-hidden />
                              <span>{primaryQuote.trustpilotRating.toFixed(1)} rating</span>
                            </div>
                            <span className="truncate text-base font-semibold text-foreground">
                              {primaryQuote.providerName}
                            </span>
                            <span className="text-xs text-muted-foreground">{filters.policyType}</span>
                          </div>
                        </div>

                        {/* Right: inline actions */}
                        <div className="flex shrink-0 flex-row items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 text-xs"
                            onClick={() => handleMoreDetails(primaryQuote)}
                          >
                            More info
                          </Button>
                          <Button size="sm" className="h-9 px-4 text-xs" onClick={handlePurchase}>
                            Purchase
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Coverage breakdown + total premium for primary */}
                    <div className="mt-0 flex flex-col gap-2 rounded-[16px] border border-border bg-white px-3 py-3">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Home */}
                        <div className="flex flex-col gap-2 rounded-[10px] border border-neutral-200 bg-[#FAFAFA] p-2">
                          {/* Row 1: icon badge + status */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FCFCFC] text-neutral-700">
                                <Home className="h-4 w-4" aria-hidden />
                              </div>
                            </div>
                            <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              Included
                            </span>
                          </div>
                          {/* Row 2: heading + tooltip */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-foreground">Home Insurance</span>
                          </div>
                          {/* Row 3: price + excess */}
                          <div className="mt-1 flex items-baseline justify-between gap-2 text-[11px] text-muted-foreground">
                            <span className="text-[15px] font-semibold tabular-nums text-foreground">
                              £{primaryQuote.standardPrice.toFixed(2)}
                            </span>
                            <span>
                              Excess:{" "}
                              <span className="font-semibold text-foreground">
                                {primaryQuote.policyDetails.excess || "£0"}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Host */}
                        <div className="flex flex-col gap-2 rounded-[10px] border border-neutral-200 bg-[#FAFAFA] p-2">
                          {/* Row 1: icon badge + status */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FCFCFC] text-neutral-700">
                                <Users className="h-4 w-4" aria-hidden />
                              </div>
                            </div>
                            <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              Included
                            </span>
                          </div>
                          {/* Row 2: heading */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-foreground">Host Insurance</span>
                          </div>
                          {/* Row 3: price + excess */}
                          <div className="mt-1 flex items-baseline justify-between gap-2 text-[11px] text-muted-foreground">
                            <span className="text-[15px] font-semibold tabular-nums text-foreground">
                              £{primaryQuote.piklPrice.toFixed(2)}
                            </span>
                            <span>
                              Excess: <span className="font-semibold text-foreground">£50</span>
                            </span>
                          </div>
                        </div>

                        {/* Legal */}
                        <div className="flex flex-col gap-2 rounded-[10px] border border-neutral-200 bg-[#FAFAFA] p-2">
                          {/* Row 1: icon badge + status */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FCFCFC] text-neutral-700">
                                <Scale className="h-4 w-4" aria-hidden />
                              </div>
                            </div>
                            <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              Optional
                            </span>
                          </div>
                          {/* Row 2: heading */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-foreground">Legal Protection</span>
                          </div>
                          {/* Row 3: price + toggle */}
                          <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                            <span className="text-[15px] font-semibold tabular-nums text-foreground">
                              £{primaryQuote.familyLegalAddOnPrice.toFixed(2)}
                            </span>
                            <Switch
                              checked={filters.legalCover}
                              onCheckedChange={(checked) =>
                                setFilters((prev) => ({ ...prev, legalCover: checked }))
                              }
                              aria-label="Toggle legal protection"
                            />
                          </div>
                        </div>

                        {/* Emergency */}
                        <div className="flex flex-col gap-2 rounded-[10px] border border-neutral-200 bg-[#FAFAFA] p-2">
                          {/* Row 1: icon badge + status */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FCFCFC] text-neutral-700">
                                <Wrench className="h-4 w-4" aria-hidden />
                              </div>
                            </div>
                            <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              Optional
                            </span>
                          </div>
                          {/* Row 2: heading */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-foreground">Emergency Cover</span>
                          </div>
                          {/* Row 3: price + toggle */}
                          <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                            <span className="text-[15px] font-semibold tabular-nums text-foreground">
                              £{primaryQuote.homeEmergencyAddOnPrice.toFixed(2)}
                            </span>
                            <Switch
                              checked={filters.homeEmergency}
                              onCheckedChange={(checked) =>
                                setFilters((prev) => ({ ...prev, homeEmergency: checked }))
                              }
                              aria-label="Toggle emergency cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Totals: order depends on selected payment option */}
                      {filters.paymentOption === "monthly" ? (
                        <>
                          {/* Total Monthly Premium (primary) */}
                          <div className="mt-2 flex items-center justify-between rounded-[10px] border border-dashed border-neutral-300 bg-[#FAFAFA] px-3 py-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              Total Monthly Premium
                            </span>
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                              £
                              {(
                                primaryQuote.standardPrice +
                                primaryQuote.piklPrice +
                                primaryQuote.familyLegalAddOnPrice +
                                primaryQuote.homeEmergencyAddOnPrice
                              )
                                .toFixed(2)
                                .replace(".00", "")}
                              <span className="text-[11px] font-medium text-muted-foreground">/mo.</span>
                            </span>
                          </div>

                          {/* Total Annual Premium (secondary) */}
                          <div className="flex items-center justify-between gap-2 rounded-[10px] border border-dashed border-neutral-300 bg-[#FAFAFA] px-3 py-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-muted-foreground">
                                Total Annual Premium
                              </span>
                              <span className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-primary">
                                10% cheaper
                              </span>
                            </div>
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                              £
                              {(
                                primaryQuote.standardPrice +
                                primaryQuote.piklPrice +
                                primaryQuote.familyLegalAddOnPrice +
                                primaryQuote.homeEmergencyAddOnPrice
                              ).toFixed(2)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Total Annual Premium (primary) */}
                          <div className="mt-2 flex items-center justify-between gap-2 rounded-[10px] border border-dashed border-neutral-300 bg-[#FAFAFA] px-3 py-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-muted-foreground">
                                Total Annual Premium
                              </span>
                              <span className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-primary">
                                10% cheaper
                              </span>
                            </div>
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                              £
                              {(
                                primaryQuote.standardPrice +
                                primaryQuote.piklPrice +
                                primaryQuote.familyLegalAddOnPrice +
                                primaryQuote.homeEmergencyAddOnPrice
                              ).toFixed(2)}
                            </span>
                          </div>

                          {/* Total Monthly Premium (secondary) */}
                          <div className="flex items-center justify-between rounded-[10px] border border-dashed border-neutral-300 bg-[#FAFAFA] px-3 py-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              Total Monthly Premium
                            </span>
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                              £
                              {(
                                primaryQuote.standardPrice +
                                primaryQuote.piklPrice +
                                primaryQuote.familyLegalAddOnPrice +
                                primaryQuote.homeEmergencyAddOnPrice
                              )
                                .toFixed(2)
                                .replace(".00", "")}
                              <span className="text-[11px] font-medium text-muted-foreground">/mo.</span>
                            </span>
                          </div>
                        </>
                      )}
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

                    {/* Summary header */}
                    <div className="mb-0 flex flex-col gap-2 rounded-[16px] border border-border bg-white px-3 py-3">
                      <div className="flex items-center justify-between gap-4">
                        {/* Left: logo + rating + insurer name */}
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[8px] bg-[#F5F5F5] text-xs font-semibold text-slate-600">
                            LOGO
                          </div>
                          <div className="flex min-w-0 flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" aria-hidden />
                              <span>{secondaryQuote.trustpilotRating.toFixed(1)} rating</span>
                            </div>
                            <span className="truncate text-base font-semibold text-foreground">
                              {secondaryQuote.providerName}
                            </span>
                            <span className="text-xs text-muted-foreground">{filters.policyType}</span>
                          </div>
                        </div>

                        {/* Right: inline actions for secondary card */}
                        <div className="flex shrink-0 flex-row items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 text-xs"
                            onClick={() => handleMoreDetails(secondaryQuote)}
                          >
                            More info
                          </Button>
                          <Button
                            size="sm"
                            className="h-9 px-4 text-xs"
                            onClick={handlePurchase}
                          >
                            Purchase
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Coverage breakdown + total premium for secondary */}
                    <div className="mt-0 flex flex-col gap-2 rounded-[16px] border border-border bg-white px-3 py-3">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Home */}
                        <div className="flex flex-col gap-2 rounded-[10px] border border-neutral-200 bg-[#FAFAFA] p-2">
                          {/* Row 1: icon badge + status */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FCFCFC] text-neutral-700">
                                <Home className="h-4 w-4" aria-hidden />
                              </div>
                            </div>
                            <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              Included
                            </span>
                          </div>
                          {/* Row 2: heading + tooltip */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-foreground">Home Insurance</span>
                          </div>
                          {/* Row 3: price + excess */}
                          <div className="mt-1 flex items-baseline justify-between gap-2 text-[11px] text-muted-foreground">
                            <span className="text-[15px] font-semibold tabular-nums text-foreground">
                              £{secondaryQuote.standardPrice.toFixed(2)}
                            </span>
                            <span>
                              Excess:{" "}
                              <span className="font-semibold text-foreground">
                                {secondaryQuote.policyDetails.excess || "£0"}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Host */}
                        <div className="flex flex-col gap-2 rounded-[10px] border border-neutral-200 bg-[#FAFAFA] p-2">
                          {/* Row 1: icon badge + status */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FCFCFC] text-neutral-700">
                                <Users className="h-4 w-4" aria-hidden />
                              </div>
                            </div>
                            <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              Included
                            </span>
                          </div>
                          {/* Row 2: heading + tooltip */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-foreground">Host Insurance</span>
                          </div>
                          {/* Row 3: price + excess */}
                          <div className="mt-1 flex items-baseline justify-between gap-2 text-[11px] text-muted-foreground">
                            <span className="text-[15px] font-semibold tabular-nums text-foreground">
                              £{secondaryQuote.piklPrice.toFixed(2)}
                            </span>
                            <span>
                              Excess: <span className="font-semibold text-foreground">£50</span>
                            </span>
                          </div>
                        </div>

                        {/* Legal */}
                        <div className="flex flex-col gap-2 rounded-[10px] border border-neutral-200 bg-[#FAFAFA] p-2">
                          {/* Row 1: icon badge + status */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FCFCFC] text-neutral-700">
                                <Scale className="h-4 w-4" aria-hidden />
                              </div>
                            </div>
                            <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              Optional
                            </span>
                          </div>
                          {/* Row 2: heading + tooltip */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-foreground">Legal Protection</span>
                          </div>
                          {/* Row 3: price + toggle */}
                          <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                            <span className="text-[15px] font-semibold tabular-nums text-foreground">
                              £{secondaryQuote.familyLegalAddOnPrice.toFixed(2)}
                            </span>
                            <Switch
                              checked={filters.legalCover}
                              onCheckedChange={(checked) =>
                                setFilters((prev) => ({ ...prev, legalCover: checked }))
                              }
                              aria-label="Toggle legal protection"
                            />
                          </div>
                        </div>

                        {/* Emergency */}
                        <div className="flex flex-col gap-2 rounded-[10px] border border-neutral-200 bg-[#FAFAFA] p-2">
                          {/* Row 1: icon badge + status */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FCFCFC] text-neutral-700">
                                <Wrench className="h-4 w-4" aria-hidden />
                              </div>
                            </div>
                            <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              Optional
                            </span>
                          </div>
                          {/* Row 2: heading + tooltip */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-foreground">Emergency Cover</span>
                          </div>
                          {/* Row 3: price + toggle */}
                          <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                            <span className="text-[15px] font-semibold tabular-nums text-foreground">
                              £{secondaryQuote.homeEmergencyAddOnPrice.toFixed(2)}
                            </span>
                            <Switch
                              checked={filters.homeEmergency}
                              onCheckedChange={(checked) =>
                                setFilters((prev) => ({ ...prev, homeEmergency: checked }))
                              }
                              aria-label="Toggle emergency cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Totals for secondary: mirror primary order */}
                      {filters.paymentOption === "monthly" ? (
                        <>
                          {/* Total Monthly Premium (primary) */}
                          <div className="mt-2 flex items-center justify-between rounded-[10px] border border-dashed border-neutral-300 bg-[#FAFAFA] px-3 py-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              Total Monthly Premium
                            </span>
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                              £
                              {(
                                secondaryQuote.standardPrice +
                                secondaryQuote.piklPrice +
                                secondaryQuote.familyLegalAddOnPrice +
                                secondaryQuote.homeEmergencyAddOnPrice
                              )
                                .toFixed(2)
                                .replace(".00", "")}
                              <span className="text-[11px] font-medium text-muted-foreground">/mo.</span>
                            </span>
                          </div>
                          {/* Total Annual Premium (secondary) */}
                          <div className="flex items-center justify-between gap-2 rounded-[10px] border border-dashed border-neutral-300 bg-[#FAFAFA] px-3 py-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              Total Annual Premium
                            </span>
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                              £
                              {(
                                secondaryQuote.standardPrice +
                                secondaryQuote.piklPrice +
                                secondaryQuote.familyLegalAddOnPrice +
                                secondaryQuote.homeEmergencyAddOnPrice
                              ).toFixed(2)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Total Annual Premium (primary) */}
                          <div className="mt-2 flex items-center justify-between gap-2 rounded-[10px] border border-dashed border-neutral-300 bg-[#FAFAFA] px-3 py-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              Total Annual Premium
                            </span>
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                              £
                              {(
                                secondaryQuote.standardPrice +
                                secondaryQuote.piklPrice +
                                secondaryQuote.familyLegalAddOnPrice +
                                secondaryQuote.homeEmergencyAddOnPrice
                              ).toFixed(2)}
                            </span>
                          </div>
                          {/* Total Monthly Premium (secondary) */}
                          <div className="flex items-center justify-between rounded-[10px] border border-dashed border-neutral-300 bg-[#FAFAFA] px-3 py-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              Total Monthly Premium
                            </span>
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                              £
                              {(
                                secondaryQuote.standardPrice +
                                secondaryQuote.piklPrice +
                                secondaryQuote.familyLegalAddOnPrice +
                                secondaryQuote.homeEmergencyAddOnPrice
                              )
                                .toFixed(2)
                                .replace(".00", "")}
                              <span className="text-[11px] font-medium text-muted-foreground">/mo.</span>
                            </span>
                          </div>
                        </>
                      )}
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


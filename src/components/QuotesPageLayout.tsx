import { HelpFloatingButton } from "@/components/HelpFloatingButton"
import { Navbar } from "@/components/Navbar"
import { PolicySheet } from "@/components/PolicySheet"
import { QuoteSidebar } from "@/components/QuoteSidebar"
import { QuotesContent } from "@/components/QuotesContent"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { useQuotesPage } from "@/hooks/useQuotesPage"

export type QuotesPageLayoutProps = ReturnType<typeof useQuotesPage> & {
  onLayoutChange: (variant: "default" | "alt") => void
  /** Allow alt layout to reuse body without rendering a second navbar */
  showNavbar?: boolean
}

export function QuotesPageLayout({
  quoteReference,
  filters,
  setFilters,
  selectedQuote,
  sheetOpen,
  setSheetOpen,
  optionsOpen,
  setOptionsOpen,
  sort,
  setSort,
  filter,
  setFilter,
  showLoadingModal,
  displayedQuotes,
  handleEditAnswers,
  handleMoreDetails,
  handlePurchase,
  handleLoadingComplete,
  onLayoutChange,
  showNavbar = true,
}: QuotesPageLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-neutral-50">
      {showNavbar && <Navbar activeLayout="default" onSelectLayout={onLayoutChange} />}
      <div className="flex min-h-0 flex-1">
        <div className="hidden min-[1340px]:flex">
          <QuoteSidebar
            quoteReference={quoteReference}
            filters={filters}
            onFiltersChange={setFilters}
            onEditAnswers={handleEditAnswers}
          />
        </div>
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          <QuotesContent
            displayedQuotes={displayedQuotes}
            policyType={filters.policyType}
            sort={sort}
            filter={filter}
            onSortChange={setSort}
            onFilterChange={setFilter}
            paymentOption={filters.paymentOption}
            onPaymentOptionChange={(option) =>
              setFilters((f) => ({ ...f, paymentOption: option }))
            }
            legalCover={filters.legalCover}
            onLegalCoverChange={(checked) =>
              setFilters((f) => ({ ...f, legalCover: checked }))
            }
            homeEmergency={filters.homeEmergency}
            onHomeEmergencyChange={(checked) =>
              setFilters((f) => ({ ...f, homeEmergency: checked }))
            }
            buildingsAccidentalDamage={filters.buildingsAccidentalDamage}
            contentsAccidentalDamage={filters.contentsAccidentalDamage}
            onMoreDetails={handleMoreDetails}
            onPurchase={handlePurchase}
            onOpenOptions={() => setOptionsOpen(true)}
          />
        </main>
      </div>
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
      <PolicySheet
        quote={selectedQuote}
        quoteReference={quoteReference}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onPurchase={handlePurchase}
      />
      <HelpFloatingButton />
    </div>
  )
}

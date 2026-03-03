import { useMemo, useState } from "react"
import { LoadingModal } from "@/components/LoadingModal"
import { Navbar } from "@/components/Navbar"
import { PolicyDrawer } from "@/components/PolicyDrawer"
import { PurchaseConfirmed } from "@/components/PurchaseConfirmed"
import { QuoteSidebar } from "@/components/QuoteSidebar"
import {
  QuotesContent,
  type SortOption,
  type FilterOption,
} from "@/components/QuotesContent"
import { HelpFloatingButton } from "@/components/HelpFloatingButton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { mockQuotes } from "@/data/quotes"
import { EXCESS_OPTIONS } from "@/lib/constants"
import { parseExcessNum } from "@/lib/utils"
import { Quote, QuoteFilters as QuoteFiltersType } from "@/types/quote"

const defaultFilters: QuoteFiltersType = {
  coverAmount: 500000,
  excess: "£250",
  policyType: "Buildings & Contents",
  coverStartDate: new Date().toISOString().slice(0, 10),
  paymentOption: "monthly",
  buildingsAccidentalDamage: false,
  legalCover: false,
  homeEmergency: false,
}

const QUOTE_REF =
  "QR-" + Math.random().toString(36).slice(2, 10).toUpperCase()

const MIN_QUOTES = 3
const MAX_QUOTES = 7

const FILTER_MAX_PRICE: Record<FilterOption, number | null> = {
  all: null,
  "under-20": 20,
  "under-25": 25,
  "under-30": 30,
}

function App() {
  const [filters, setFilters] = useState<QuoteFiltersType>(defaultFilters)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sort, setSort] = useState<SortOption>("price-asc")
  const [filter, setFilter] = useState<FilterOption>("all")
  // Hidden for now – set to true to show "Finding quotes" loading animation
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [showPurchaseConfirmed, setShowPurchaseConfirmed] = useState(false)

  const handleEditAnswers = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  const quotes = useMemo(() => {
    const selectedExcessNum = parseExcessNum(filters.excess)
    let list = mockQuotes.filter(
      (q) =>
        parseExcessNum(q.policyDetails.excess) <= selectedExcessNum &&
        q.policyDetails.policyType === filters.policyType
    )
    const maxPrice = FILTER_MAX_PRICE[filter]
    if (maxPrice != null) {
      list = list.filter((q) => q.piklPrice <= maxPrice)
    }
    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.piklPrice - b.piklPrice)
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.piklPrice - a.piklPrice)
    } else {
      list = [...list].sort((a, b) =>
        a.providerName.localeCompare(b.providerName)
      )
    }
    return list
  }, [filters, sort, filter])

  const excessIndex = EXCESS_OPTIONS.indexOf(filters.excess)
  const displayCount = Math.max(
    MIN_QUOTES,
    Math.min(
      MAX_QUOTES,
      MAX_QUOTES -
        Math.round(
          (excessIndex / (EXCESS_OPTIONS.length - 1)) * (MAX_QUOTES - MIN_QUOTES)
        )
    )
  )

  const displayedQuotes = useMemo(() => {
    if (quotes.length >= displayCount) {
      return quotes.slice(0, displayCount)
    }
    if (quotes.length >= MIN_QUOTES) {
      return quotes
    }
    const includedIds = new Set(quotes.map((q) => q.id))
    const selectedExcessNum = parseExcessNum(filters.excess)
    const maxPrice = FILTER_MAX_PRICE[filter]
    const others = mockQuotes
      .filter((q) => {
        if (q.policyDetails.policyType !== filters.policyType || includedIds.has(q.id))
          return false
        if (parseExcessNum(q.policyDetails.excess) <= selectedExcessNum)
          return false
        if (maxPrice != null && q.piklPrice > maxPrice) return false
        return true
      })
      .sort(
        (a, b) =>
          parseExcessNum(a.policyDetails.excess) -
          parseExcessNum(b.policyDetails.excess)
      )
    const padCount = Math.min(
      displayCount - quotes.length,
      Math.max(MIN_QUOTES - quotes.length, 0)
    )
    const padded = others.slice(0, Math.max(0, padCount))
    const combined = [...quotes, ...padded]
    if (sort === "price-asc") {
      combined.sort((a, b) => a.piklPrice - b.piklPrice)
    } else if (sort === "price-desc") {
      combined.sort((a, b) => b.piklPrice - a.piklPrice)
    } else {
      combined.sort((a, b) => a.providerName.localeCompare(b.providerName))
    }
    return combined.slice(0, displayCount)
  }, [quotes, displayCount, filters.policyType, filters.excess, sort, filter])

  const handleMoreDetails = (quote: Quote) => {
    setSelectedQuote(quote)
    setDrawerOpen(true)
  }

  const handlePurchase = () => {
    setShowPurchaseConfirmed(true)
  }

  if (showPurchaseConfirmed) {
    return (
      <TooltipProvider>
        <PurchaseConfirmed onSkip={() => setShowPurchaseConfirmed(false)} />
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-neutral-50">
        <Navbar />
        <div className="flex min-h-0 flex-1">
          <QuoteSidebar
            quoteReference={QUOTE_REF}
            filters={filters}
            onFiltersChange={setFilters}
            onEditAnswers={handleEditAnswers}
          />
          <main className="flex-1 overflow-y-auto">
            <QuotesContent
              displayedQuotes={displayedQuotes}
              sort={sort}
              filter={filter}
              onSortChange={setSort}
              onFilterChange={setFilter}
              legalCover={filters.legalCover}
              homeEmergency={filters.homeEmergency}
              onLegalCoverChange={(checked) =>
                setFilters((f) => ({ ...f, legalCover: checked }))
              }
              onHomeEmergencyChange={(checked) =>
                setFilters((f) => ({ ...f, homeEmergency: checked }))
              }
              onMoreDetails={handleMoreDetails}
              onPurchase={handlePurchase}
            />
          </main>
        </div>
        <PolicyDrawer
          quote={selectedQuote}
          quoteReference={QUOTE_REF}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
        <LoadingModal
          open={showLoadingModal}
          onClose={() => setShowLoadingModal(false)}
        />
        <HelpFloatingButton />
      </div>
    </TooltipProvider>
  )
}

export default App

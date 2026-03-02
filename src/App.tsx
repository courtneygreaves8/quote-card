import { useState, useMemo } from "react"
import { LoadingModal } from "@/components/LoadingModal"
import { Navbar } from "@/components/Navbar"
import { PolicyDrawer } from "@/components/PolicyDrawer"
import { QuoteCard } from "@/components/QuoteCard"
import { QuoteSidebar } from "@/components/QuoteSidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TooltipProvider } from "@/components/ui/tooltip"
import { mockQuotes } from "@/data/quotes"
import { Quote, QuoteFilters as QuoteFiltersType } from "@/types/quote"

type SortOption = "price-asc" | "price-desc" | "provider-az"
type FilterOption = "all" | "under-20" | "under-25" | "under-30"

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

const QUOTE_REF = "QR-" + Math.random().toString(36).slice(2, 10).toUpperCase()

const EXCESS_OPTIONS = Array.from(
  { length: 21 },
  (_, i) => (i === 20 ? "£1,000" : `£${i * 50}`)
)

const MIN_QUOTES = 3
const MAX_QUOTES = 7

function parseExcessNum(s: string): number {
  return parseInt(s.replace(/[£,]/g, ""), 10) || 0
}

function App() {
  const [filters, setFilters] = useState<QuoteFiltersType>(defaultFilters)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sort, setSort] = useState<SortOption>("price-asc")
  const [filter, setFilter] = useState<FilterOption>("all")
  const [showLoadingModal, setShowLoadingModal] = useState(true)

  const handleEditAnswers = () => {
    // Navigate back to form when implemented
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  const quotes = useMemo(() => {
    const selectedExcessNum = parseExcessNum(filters.excess)
    let list = mockQuotes.filter(
      (q) =>
        parseExcessNum(q.policyDetails.excess) <= selectedExcessNum &&
        q.policyDetails.policyType === filters.policyType
    )
    const maxPrice =
      filter === "under-20" ? 20 : filter === "under-25" ? 25 : filter === "under-30" ? 30 : null
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
      MAX_QUOTES - Math.round((excessIndex / (EXCESS_OPTIONS.length - 1)) * (MAX_QUOTES - MIN_QUOTES))
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
    const maxPrice =
      filter === "under-20" ? 20 : filter === "under-25" ? 25 : filter === "under-30" ? 30 : null
    const others = mockQuotes
      .filter((q) => {
        if (q.policyDetails.policyType !== filters.policyType || includedIds.has(q.id)) return false
        if (parseExcessNum(q.policyDetails.excess) <= selectedExcessNum) return false
        if (maxPrice != null && q.piklPrice > maxPrice) return false
        return true
      })
      .sort(
        (a, b) =>
          parseExcessNum(a.policyDetails.excess) - parseExcessNum(b.policyDetails.excess)
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
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {displayedQuotes.length === 0
                  ? "No quotes match your filters"
                  : `We've got ${displayedQuotes.length} quote${displayedQuotes.length === 1 ? "" : "s"} for you`}
              </h1>
              <p className="mt-1 text-muted-foreground">
                Each quote comes with Pikl's Property Host Cover.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                <SelectTrigger className="w-[180px]" aria-label="Sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">Price: low to high</SelectItem>
                    <SelectItem value="price-desc">Price: high to low</SelectItem>
                    <SelectItem value="provider-az">Provider A–Z</SelectItem>
                  </SelectContent>
              </Select>
              <Select value={filter} onValueChange={(v) => setFilter(v as FilterOption)}>
                <SelectTrigger className="w-[160px]" aria-label="Filter">
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
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  legalCover={filters.legalCover}
                  homeEmergency={filters.homeEmergency}
                  onLegalCoverChange={(checked) =>
                    setFilters((f) => ({ ...f, legalCover: checked }))
                  }
                  onHomeEmergencyChange={(checked) =>
                    setFilters((f) => ({ ...f, homeEmergency: checked }))
                  }
                  onMoreDetails={handleMoreDetails}
                />
              ))
            ) : (
              <div className="col-span-2 rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
                <p className="text-muted-foreground">
                  No quotes match your current filters. Try changing cover
                  amount, excess or policy type.
                </p>
              </div>
            )}
          </div>
        </div>
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
      </div>
    </TooltipProvider>
  )
}

export default App

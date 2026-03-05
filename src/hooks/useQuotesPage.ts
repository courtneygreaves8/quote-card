import { useMemo, useState } from "react"
import { mockQuotes } from "@/data/quotes"
import {
  EXCESS_OPTIONS,
  FILTER_MAX_PRICE,
  MAX_QUOTES,
  MIN_QUOTES,
} from "@/lib/constants"
import { parseExcessNum } from "@/lib/utils"
import type { FilterOption, Quote, QuoteFilters, SortOption } from "@/types/quote"

function getDefaultFilters(): QuoteFilters {
  return {
    coverAmount: 500000,
    excess: "£250",
    policyType: "Buildings & Contents",
    coverStartDate: new Date().toISOString().slice(0, 10),
    paymentOption: "annual",
    buildingsAccidentalDamage: false,
    contentsAccidentalDamage: false,
    legalCover: false,
    homeEmergency: false,
  }
}

export function useQuotesPage() {
  const [filters, setFilters] = useState<QuoteFilters>(getDefaultFilters)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [sort, setSort] = useState<SortOption>("price-asc")
  const [filter, setFilter] = useState<FilterOption>("all")
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [showPurchaseConfirmed, setShowPurchaseConfirmed] = useState(false)
  const [quoteReference] = useState(() =>
    "QR-" + Math.random().toString(36).slice(2, 10).toUpperCase()
  )

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

  const displayCount = useMemo(() => {
    const excessIndex = EXCESS_OPTIONS.indexOf(filters.excess)
    return Math.max(
      MIN_QUOTES,
      Math.min(
        MAX_QUOTES,
        MAX_QUOTES -
          Math.round(
            (excessIndex / (EXCESS_OPTIONS.length - 1)) *
              (MAX_QUOTES - MIN_QUOTES)
          )
      )
    )
  }, [filters.excess])

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
        if (
          q.policyDetails.policyType !== filters.policyType ||
          includedIds.has(q.id)
        )
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
  }, [
    quotes,
    displayCount,
    filters.policyType,
    filters.excess,
    sort,
    filter,
  ])

  const handleEditAnswers = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  const handleMoreDetails = (quote: Quote) => {
    setSelectedQuote(quote)
    setDrawerOpen(true)
  }

  const handlePurchase = () => {
    setShowPurchaseConfirmed(true)
  }

  const handleClosePurchaseConfirmed = () => {
    setShowPurchaseConfirmed(false)
  }

  return {
    quoteReference,
    filters,
    setFilters,
    selectedQuote,
    drawerOpen,
    setDrawerOpen,
    optionsOpen,
    setOptionsOpen,
    sort,
    setSort,
    filter,
    setFilter,
    showLoadingModal,
    setShowLoadingModal,
    showPurchaseConfirmed,
    displayedQuotes,
    handleEditAnswers,
    handleMoreDetails,
    handlePurchase,
    handleClosePurchaseConfirmed,
  }
}

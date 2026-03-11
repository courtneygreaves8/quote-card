import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import type { Quote } from "@/types/quote"
import { QUOTE_LIST_POLL_DURATION_MS, VIEWPORT_SHEET_BREAKPOINT_PX } from "@/lib/constants"

export type AltSortMode = "price" | "rating"

export interface UseQuotesAltLayoutArgs {
  displayedQuotes: Quote[]
  selectedQuote: Quote | null
  onMoreDetails: (quote: Quote) => void
  onSelectQuote: (quote: Quote) => void
}

export function useQuotesAltLayout({
  displayedQuotes,
  selectedQuote,
  onMoreDetails,
  onSelectQuote,
}: UseQuotesAltLayoutArgs) {
  const activeQuote = selectedQuote ?? displayedQuotes[0] ?? null
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"all" | "compare">("compare")
  const [sortMode, setSortMode] = useState<AltSortMode>("price")
  const [visibleQuoteCount, setVisibleQuoteCount] = useState(0)

  const sortedQuotes = useMemo(
    () =>
      sortMode === "price"
        ? [...displayedQuotes].sort((a, b) => a.piklPrice - b.piklPrice)
        : [...displayedQuotes].sort((a, b) => b.trustpilotRating - a.trustpilotRating),
    [displayedQuotes, sortMode]
  )

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
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const handleQuoteListClick = (quote: Quote) => {
    if (typeof window !== "undefined" && window.innerWidth <= VIEWPORT_SHEET_BREAKPOINT_PX) {
      onMoreDetails(quote)
    } else {
      onSelectQuote(quote)
    }
  }

  useLayoutEffect(() => {
    const n = sortedQuotes.length
    if (n === 0) {
      setVisibleQuoteCount(0)
      return
    }
    setVisibleQuoteCount(1)
    const timeouts: number[] = []
    for (let i = 1; i < n; i++) {
      const delayMs =
        n > 1 ? (i / (n - 1)) * QUOTE_LIST_POLL_DURATION_MS : 0
      const t = window.setTimeout(() => setVisibleQuoteCount(i + 1), delayMs)
      timeouts.push(t)
    }
    return () => timeouts.forEach(clearTimeout)
  }, [sortMode, sortedQuotes.length])

  useEffect(() => {
    setVisibleQuoteCount((prev) =>
      sortedQuotes.length < prev ? sortedQuotes.length : prev
    )
  }, [sortedQuotes.length])

  return {
    activeQuote,
    compareIds,
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    visibleQuoteCount,
    sortedQuotes,
    primaryQuote,
    secondaryQuote,
    tertiaryQuote,
    handleToggleCompare,
    handleQuoteListClick,
  }
}

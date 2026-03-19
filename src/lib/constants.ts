import type { FilterOption } from "@/types/quote"

/**
 * Layout breakpoints (use in Tailwind: min-[1440px], min-[1513px], etc.):
 * - 1440px: persistent QuoteSidebar visible; Options button hidden.
 * - 1513px: QuoteCard horizontal layout + single-card grid; below 1513px = stacked cards (1/2/3 cols by width).
 * - card3 (1100px): 3-column grid starts.
 */
/** Horizontal padding for navbar and sidebar (aligns nav content with sidebar content) */
export const LAYOUT_PADDING_X = "px-6"

/** Excess options from £0 to £1,000 in £50 steps */
export const EXCESS_OPTIONS = Array.from(
  { length: 21 },
  (_, i) => (i === 20 ? "£1,000" : `£${i * 50}`)
)

export const COVER_TYPES = [
  "Buildings only",
  "Contents only",
  "Buildings & Contents",
] as const

/** Payment option button: active (selected) state */
export const PAYMENT_ACTIVE_CLASS =
  "flex-1 rounded-full bg-neutral-200 text-[#1E1E1E] hover:bg-neutral-200 hover:text-[#1E1E1E]"

/** Payment option button: inactive state */
export const PAYMENT_INACTIVE_CLASS =
  "flex-1 rounded-full hover:bg-neutral-100"

/** Sidebar excess +/- button (uses standard control heights) */
export const EXCESS_BTN_CLASS =
  "h-11 w-11 md:h-9 md:w-9 shrink-0 rounded-lg border-neutral-200 p-0"

export const MIN_QUOTES = 3
export const MAX_QUOTES = 4

/** Max price cap per filter option (null = no cap) */
export const FILTER_MAX_PRICE: Record<FilterOption, number | null> = {
  all: null,
  "under-20": 20,
  "under-25": 25,
  "under-30": 30,
}

/** Compulsory excess amount used in policy sheet */
export const COMPULSORY_EXCESS = 100

/** Quote card pricing: annual display range (reflects 10% discount) */
export const ANNUAL_DISPLAY_MIN = 170.77
export const ANNUAL_DISPLAY_MAX = 247.77
export const SOURCE_TOTAL_MIN = 15
export const SOURCE_TOTAL_MAX = 80
export const MONTHLY_DIVISOR = 11
/** Extra amount added to base instalment for deposit (monthly breakdown) */
export const MONTHLY_DEPOSIT_EXTRA = 20
/** Extra amount added to base instalment for ×1 (admin fee) */
export const MONTHLY_X1_EXTRA = 5

/** Alt layout: duration over which quote list items animate in after skeleton (ms) */
export const QUOTE_LIST_POLL_DURATION_MS = 4000

/** Viewport width below which quote list item click opens policy sheet instead of preview (px) */
export const VIEWPORT_SHEET_BREAKPOINT_PX = 1119

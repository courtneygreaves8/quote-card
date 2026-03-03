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
  "flex-1 rounded-[8px] bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] text-white hover:opacity-90 hover:bg-gradient-to-r hover:from-[#1a1a1a] hover:to-[#0f0f0f] hover:text-white"

/** Payment option button: inactive state */
export const PAYMENT_INACTIVE_CLASS =
  "flex-1 rounded-[8px] hover:bg-neutral-100"

/** Sidebar excess +/- button (square, soft border) */
export const EXCESS_BTN_CLASS =
  "h-8 w-8 shrink-0 rounded-md border-neutral-200 p-0"

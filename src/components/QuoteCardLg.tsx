import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Quote } from "@/types/quote"
import type { PaymentOption } from "@/types/quote"
import { CheckSquare, HelpCircle, Info, ShoppingCart, Square } from "lucide-react"

const TOOLTIP_TRIGGER_CLASS =
  "inline-flex rounded text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

/** Annual pricing display range (quotes are scaled into this range). */
const ANNUAL_DISPLAY_MIN = 170.77
const ANNUAL_DISPLAY_MAX = 344.77
const SOURCE_TOTAL_MIN = 15
const SOURCE_TOTAL_MAX = 80

/**
 * QuoteCardLg — LOCKED LAYOUT
 * Horizontal layout (logo | cover columns | total | buttons) is fixed for viewport >= 1024px.
 * Tailwind breakpoint: `qc` in tailwind.config.js = 1024px. Do not change this breakpoint or
 * the structure of the large layout; responsive behavior below 1024px may be adjusted separately.
 */
interface QuoteCardLgProps {
  quote: Quote
  paymentOption: PaymentOption
  onPaymentOptionChange: (option: PaymentOption) => void
  legalCover: boolean
  homeEmergency: boolean
  onLegalCoverChange: (checked: boolean) => void
  onHomeEmergencyChange: (checked: boolean) => void
  onMoreDetails: (quote: Quote) => void
  onPurchase?: (quote: Quote) => void
  size?: "sm" | "md" | "lg"
}

export function QuoteCardLg({
  quote,
  paymentOption,
  onPaymentOptionChange,
  legalCover,
  onLegalCoverChange,
  homeEmergency,
  onHomeEmergencyChange,
  onMoreDetails,
  onPurchase,
  size = "lg",
}: QuoteCardLgProps) {
  const totalPrice =
    quote.standardPrice +
    quote.piklPrice +
    (legalCover ? quote.familyLegalAddOnPrice : 0) +
    (homeEmergency ? quote.homeEmergencyAddOnPrice : 0)

  const pricingMode = paymentOption

  /** Scale annual total into [ANNUAL_DISPLAY_MIN, ANNUAL_DISPLAY_MAX]; line items scale proportionally. */
  const displayedAnnualTotal = Math.min(
    ANNUAL_DISPLAY_MAX,
    Math.max(
      ANNUAL_DISPLAY_MIN,
      ANNUAL_DISPLAY_MIN +
        ((totalPrice - SOURCE_TOTAL_MIN) * (ANNUAL_DISPLAY_MAX - ANNUAL_DISPLAY_MIN)) /
          (SOURCE_TOTAL_MAX - SOURCE_TOTAL_MIN)
    )
  )
  const scaleFactor = totalPrice > 0 ? displayedAnnualTotal / totalPrice : 1

  /** Monthly payment = displayed annual total / 11; 1 deposit + 1st month + 9 more installments. */
  const MONTHLY_DIVISOR = 11
  const monthlyAmount = displayedAnnualTotal / MONTHLY_DIVISOR

  const formatPounds = (n: number) => `£${n.toFixed(2)}`
  const toDisplayAnnual = (value: number) => formatPounds(value * scaleFactor)
  const toDisplayMonthly = (value: number) =>
    formatPounds((value * scaleFactor) / MONTHLY_DIVISOR)
  const toDisplay = (value: number) =>
    pricingMode === "annual" ? toDisplayAnnual(value) : toDisplayMonthly(value)

  const priceClass =
    size === "sm"
      ? "text-sm font-medium text-foreground"
      : "text-base font-medium text-foreground"

  const basePadding =
    size === "sm"
      ? "px-3 py-3"
      : size === "md"
        ? "px-4 py-3"
        : "px-4 py-4"

  // #region agent log
  useEffect(() => {
    const t = setTimeout(() => {
      const card = document.querySelector("[data-debug-card]")
      if (!card) return
      const stackedDepositRow = card.querySelector("[data-debug-monthly-stacked]")
      if (stackedDepositRow) {
        const label = stackedDepositRow.querySelector("span:first-of-type")
        const price = stackedDepositRow.querySelector("span:last-of-type")
        const getData = (el: Element | null) => {
          if (!el) return null
          const s = window.getComputedStyle(el)
          return { fontSize: s.fontSize, className: el.className, parentClassName: el.parentElement?.className?.slice(0, 80) }
        }
        fetch("http://127.0.0.1:7243/ingest/fe71717d-8c8f-4399-8308-a1d78489b4ab", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "QuoteCardLg.tsx:stacked", message: "Stacked monthly breakdown computed styles", data: { label: getData(label), price: getData(price), pricingMode }, timestamp: Date.now(), hypothesisId: "H1_H3" }) }).catch(() => {})
      }
      const desktopCol = card.querySelector("[data-debug-monthly-desktop]")
      if (desktopCol) {
        const s = window.getComputedStyle(desktopCol)
        const firstP = desktopCol.querySelector("p")
        const pStyle = firstP ? window.getComputedStyle(firstP) : null
        fetch("http://127.0.0.1:7243/ingest/fe71717d-8c8f-4399-8308-a1d78489b4ab", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "QuoteCardLg.tsx:desktop", message: "Desktop monthly column layout", data: { columnHeight: s.height, justifyContent: s.justifyContent, alignItems: s.alignItems, display: s.display, firstPMarginBlock: pStyle?.marginBlock ?? null, firstPClassName: firstP?.className?.slice(0, 60) }, timestamp: Date.now(), hypothesisId: "H4_H5" }) }).catch(() => {})
      }
    }, 150)
    return () => clearTimeout(t)
  }, [pricingMode])
  // #endregion

  return (
    <div className="flex min-w-0 w-full max-w-[1024px] flex-col">
      {/* Pricing tabs attached to top-left, in-flow for large layout only */}
      <div className="hidden qc:block">
        <div className="inline-flex rounded-t-[8px] rounded-b-none border border-b-0 border-border bg-muted/40 text-xs font-medium text-muted-foreground">
          <button
            type="button"
            onClick={() => onPaymentOptionChange("annual")}
            className={`flex items-center gap-1.5 rounded-t-[8px] px-4 py-2 transition-colors ${
              pricingMode === "annual"
                ? "bg-white text-foreground"
                : "bg-transparent text-muted-foreground"
            }`}
          >
            Annual
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              10% cheaper
            </span>
          </button>
          <button
            type="button"
            onClick={() => onPaymentOptionChange("monthly")}
            className={`rounded-t-[8px] px-4 py-2 transition-colors ${
              pricingMode === "monthly"
                ? "bg-white text-foreground"
                : "bg-transparent text-muted-foreground"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <Card className="min-w-0 overflow-hidden rounded-[8px] qc:rounded-tl-none qc:rounded-tr-[8px] bg-white shadow-sm transition-shadow hover:shadow-md" data-debug-card>
        {/* Stacked layout: 0–1339px (hidden from 1340px up) */}
        <div className={`flex min-w-0 flex-col gap-3 px-4 py-4 qc:hidden`}>
          {/* Header: logo + pricing toggle + insurer name */}
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
              <span className="text-xs font-bold text-muted-foreground">LOGO</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {pricingMode === "annual" ? "Annual" : "Monthly"}
              </span>
              <Switch
                checked={pricingMode === "monthly"}
                onCheckedChange={(checked) =>
                  onPaymentOptionChange(checked ? "monthly" : "annual")
                }
                aria-label="Toggle pricing mode"
              />
            </div>
          </div>

          <div className="mt-1 min-w-0 break-words text-base font-semibold text-foreground">
            {quote.providerName}
          </div>

        {/* Core breakdown */}
        <div className="mt-2 flex min-w-0 flex-col">
          <div className="flex min-w-0 items-baseline justify-between gap-2 py-2">
            <span className="min-w-0 truncate text-sm text-muted-foreground">Home insurance</span>
            <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
              {toDisplay(quote.standardPrice)}
            </span>
          </div>
          <div className="flex min-w-0 items-baseline justify-between gap-2 border-t border-border py-2">
            <span className="min-w-0 truncate text-sm text-muted-foreground">Host insurance</span>
            <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
              {toDisplay(quote.piklPrice)}
            </span>
          </div>

          {pricingMode === "monthly" && (
            <div className="text-[14px]" data-debug-monthly-stacked>
              <div className="flex min-w-0 items-baseline justify-between gap-2 border-t border-border py-2">
                <span className="min-w-0 truncate text-[14px] text-muted-foreground">Deposit</span>
                <span className="shrink-0 text-[14px] font-medium tabular-nums text-foreground">
                  {formatPounds(monthlyAmount)}
                </span>
              </div>
              <div className="flex min-w-0 items-baseline justify-between gap-2 border-t border-border py-2">
                <span className="flex min-w-0 items-baseline gap-1 text-[14px] text-muted-foreground">
                  × 1
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={cn(TOOLTIP_TRIGGER_CLASS, "inline-flex align-baseline")}
                        aria-label="Admin fee info"
                      >
                        <HelpCircle className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[220px]">
                      Our insurer PremFina charges a £5 admin fee.
                    </TooltipContent>
                  </Tooltip>
                </span>
                <span className="shrink-0 text-[14px] font-medium tabular-nums text-foreground">
                  {formatPounds(monthlyAmount + 5)}
                </span>
              </div>
              <div className="flex min-w-0 items-baseline justify-between gap-2 border-t border-border py-2">
                <span className="min-w-0 truncate text-[14px] text-muted-foreground">× 9</span>
                <span className="shrink-0 text-[14px] font-medium tabular-nums text-foreground">
                  {formatPounds(monthlyAmount)}
                </span>
              </div>
            </div>
          )}

          <div className="flex min-w-0 items-baseline justify-between gap-2 border-t border-border py-2">
            <span className="min-w-0 text-sm text-muted-foreground">Excess</span>
            <span className="shrink-0 text-sm font-medium text-foreground">
              {quote.policyDetails.excess}
            </span>
          </div>
        </div>

        {/* Extras divider */}
        <div className="mt-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>Extras</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Home emergency toggle card (stacked layout) */}
        <button
          type="button"
          onClick={() => onHomeEmergencyChange(!homeEmergency)}
          className="mt-2 flex w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
          aria-pressed={homeEmergency}
          aria-label="Toggle Home emergency"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            {homeEmergency ? (
              <CheckSquare className="h-5 w-5 shrink-0 text-foreground" aria-hidden />
            ) : (
              <Square className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            )}
            Home emergency
          </span>
          <span className="text-sm font-medium text-foreground">
            {toDisplay(quote.homeEmergencyAddOnPrice)}
          </span>
        </button>

        {/* Legal cover toggle card */}
        <button
          type="button"
          onClick={() => onLegalCoverChange(!legalCover)}
          className="mt-2 flex w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
          aria-pressed={legalCover}
          aria-label="Toggle Legal cover"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            {legalCover ? (
              <CheckSquare className="h-5 w-5 shrink-0 text-foreground" aria-hidden />
            ) : (
              <Square className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            )}
            Legal cover
          </span>
          <span className="text-sm font-medium text-foreground">
            {toDisplay(quote.familyLegalAddOnPrice)}
          </span>
        </button>

        {/* Total & actions */}
        <div className="mt-2 flex min-w-0 items-center justify-between gap-2 border-t border-border pt-3">
          <span className="min-w-0 text-sm font-medium text-muted-foreground">Total price</span>
          <span className="shrink-0 text-lg font-semibold tabular-nums text-foreground">{toDisplay(totalPrice)}</span>
        </div>

        <div className="flex min-w-0 flex-col gap-2 pt-2">
          <Button className="h-10 w-full gap-1.5" onClick={() => onPurchase?.(quote)}>
            <ShoppingCart className="h-4 w-4 shrink-0" />
            Purchase
          </Button>
          <Button
            variant="outline"
            className="h-10 w-full gap-1.5"
            onClick={() => onMoreDetails(quote)}
          >
            <Info className="h-4 w-4 shrink-0" />
            More details
          </Button>
        </div>
      </div>

      {/* Locked large layout: 1024px+ only (qc breakpoint) */}
      <div
        className={`hidden qc:flex flex-col gap-4 ${basePadding} qc:flex-row qc:items-center qc:gap-0 qc:px-0 qc:py-4`}
      >
        {/* Logo — same column padding and height as total/buttons on desktop */}
        <div className="flex shrink-0 items-start qc:flex qc:h-[4.8rem] qc:items-center qc:border-r qc:border-border qc:px-5">
          <div className="flex size-[4.8rem] items-center justify-center rounded-lg bg-neutral-100 p-2">
            <span className="text-sm font-bold text-muted-foreground">
              LOGO
            </span>
          </div>
        </div>

        {/* Middle: 2×2 grid on mobile, horizontal row with equal-height dividers on desktop */}
        <div className="mt-2 grid flex-1 gap-3 sm:grid-cols-2 qc:mt-0 qc:flex qc:flex-row qc:items-stretch qc:gap-0">
          {/* Home insurance */}
          <div
            className={cn(
              "rounded-lg border border-neutral-200 bg-white px-3 py-2 qc:flex qc:min-w-0 qc:h-[4.8rem] qc:flex-1 qc:flex-col qc:justify-center qc:rounded-none qc:border-0 qc:border-r qc:border-border qc:px-5 qc:py-3",
              pricingMode === "monthly" && "qc:pl-5 qc:pr-3"
            )}
          >
            <p className="mb-1 flex flex-col gap-0 text-sm text-muted-foreground">
              <span>Home</span>
              <span className="inline-flex items-center gap-1.5">
                insurance
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={TOOLTIP_TRIGGER_CLASS}
                      aria-label="What is standard cover?"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[220px]">
                    General home insurance covering buildings and contents.
                  </TooltipContent>
                </Tooltip>
              </span>
            </p>
            <p className={priceClass}>
              {pricingMode === "annual"
                ? toDisplayAnnual(quote.standardPrice)
                : toDisplayMonthly(quote.standardPrice)}
            </p>
          </div>

          {/* Host insurance */}
          <div
            className={cn(
              "rounded-lg border border-neutral-200 bg-white px-3 py-2 qc:flex qc:min-w-0 qc:h-[4.8rem] qc:flex-1 qc:flex-col qc:justify-center qc:rounded-none qc:border-0 qc:border-r qc:border-border qc:px-5 qc:py-3",
              pricingMode === "monthly" && "qc:pl-5 qc:pr-3"
            )}
          >
            <p className="mb-1 flex flex-col gap-0 text-sm text-muted-foreground">
              <span>Host</span>
              <span className="inline-flex items-center gap-1.5">
                insurance
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={TOOLTIP_TRIGGER_CLASS}
                      aria-label="What is Pikl cover?"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[220px]">
                    Host insurance for short-term letting and home sharing.
                  </TooltipContent>
                </Tooltip>
              </span>
            </p>
            <p className={priceClass}>
              {pricingMode === "annual"
                ? toDisplayAnnual(quote.piklPrice)
                : toDisplayMonthly(quote.piklPrice)}
            </p>
          </div>

          {/* Legal cover — \"Family legal\" on one line, \"protection\" below */}
          <div
            className={cn(
              "flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 qc:flex qc:min-w-0 qc:h-[4.8rem] qc:flex-1 qc:flex-row qc:items-center qc:justify-between qc:gap-4 qc:rounded-none qc:border-0 qc:border-r qc:border-border qc:px-5 qc:py-3",
              pricingMode === "monthly" && "qc:pr-6"
            )}
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                <span className="whitespace-nowrap">Family legal</span>
                <span className="block">protection</span>
              </p>
              <p className={priceClass}>
                {pricingMode === "annual"
                  ? toDisplayAnnual(quote.familyLegalAddOnPrice)
                  : toDisplayMonthly(quote.familyLegalAddOnPrice)}
              </p>
            </div>
            <Switch
              checked={legalCover}
              onCheckedChange={onLegalCoverChange}
              aria-label="Family legal protection"
            />
          </div>

          {/* Home emergency column */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 qc:flex qc:min-w-0 qc:h-[4.8rem] qc:flex-1 qc:flex-row qc:items-center qc:justify-between qc:gap-4 qc:rounded-none qc:border-0 qc:border-r qc:border-border qc:px-5 qc:py-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                <span>Home</span>
                <span className="block">emergency</span>
              </p>
              <p className={priceClass}>
                {pricingMode === "annual"
                  ? toDisplayAnnual(quote.homeEmergencyAddOnPrice)
                  : toDisplayMonthly(quote.homeEmergencyAddOnPrice)}
              </p>
            </div>
            <Switch
              checked={homeEmergency}
              onCheckedChange={onHomeEmergencyChange}
              aria-label="Home emergency cover"
            />
          </div>

          {/* Monthly breakdown column — same style as other columns, only when monthly */}
          {pricingMode === "monthly" && (
            <div className="hidden flex-col justify-center rounded-lg border border-neutral-200 bg-white px-3 py-2 qc:flex qc:min-w-0 qc:h-[4.8rem] qc:flex-1 qc:flex-col qc:justify-center qc:rounded-none qc:border-0 qc:border-r qc:border-border qc:px-5 qc:py-3" data-debug-monthly-desktop>
              <div className="flex items-center justify-between gap-2 border-b border-border pb-1.5">
                <span className="m-0 text-sm text-muted-foreground">Deposit</span>
                <span className="m-0 shrink-0 text-sm font-medium tabular-nums text-foreground">
                  {formatPounds(monthlyAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 border-b border-border py-1.5">
                <span className="m-0 flex items-center gap-1.5 text-sm text-muted-foreground">
                  × 1
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={TOOLTIP_TRIGGER_CLASS}
                        aria-label="Admin fee info"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[220px]">
                      Our insurer PremFina charges a £5 admin fee.
                    </TooltipContent>
                  </Tooltip>
                </span>
                <span className="m-0 shrink-0 text-sm font-medium tabular-nums text-foreground">
                  {formatPounds(monthlyAmount + 5)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1.5">
                <span className="m-0 text-sm text-muted-foreground">× 9</span>
                <span className={cn("m-0 shrink-0 tabular-nums text-sm font-medium text-foreground")}>
                  {formatPounds(monthlyAmount)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Total price + CTAs — stacked on mobile, side-by-side on desktop */}
        <div className="mt-3 flex w-full flex-col gap-3 qc:mt-0 qc:w-auto qc:shrink-0 qc:flex-row qc:items-stretch qc:gap-4 qc:pl-5 qc:pr-5">
          {/* Total price column — 5.4rem tall on desktop */}
          <div className="flex h-auto flex-col items-center justify-center rounded-lg bg-neutral-100 px-3 py-2 text-center qc:h-[5.4rem]">
            {pricingMode === "annual" ? (
              <>
                <p className="text-sm text-muted-foreground">Total price</p>
                <p className="text-md font-semibold text-foreground tabular-nums">
                  {formatPounds(displayedAnnualTotal)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Excess {quote.policyDetails.excess}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Monthly Price</p>
                <p className="text-md font-semibold text-foreground tabular-nums">
                  {formatPounds(monthlyAmount)}<span className="text-xs font-normal">/mo.</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Excess {quote.policyDetails.excess}
                </p>
              </>
            )}
          </div>

          {/* Action buttons column — stretches to match total height */}
          <div className="flex h-auto flex-col justify-between gap-2 qc:w-[8rem] qc:rounded-br-lg qc:py-0">
            <Button className="h-10 w-full gap-1.5" onClick={() => onPurchase?.(quote)}>
              <ShoppingCart className="h-4 w-4 shrink-0" />
              Purchase
            </Button>
            <Button
              variant="outline"
              className="h-10 w-full gap-1.5"
              onClick={() => onMoreDetails(quote)}
            >
              <Info className="h-4 w-4 shrink-0" />
              More details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
  )
}

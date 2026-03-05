import { CheckSquare, HelpCircle, Info, ShoppingCart, Square } from "lucide-react"
import {
  ANNUAL_DISPLAY_MAX,
  ANNUAL_DISPLAY_MIN,
  MONTHLY_DEPOSIT_EXTRA,
  MONTHLY_DIVISOR,
  MONTHLY_X1_EXTRA,
  SOURCE_TOTAL_MAX,
  SOURCE_TOTAL_MIN,
} from "@/lib/constants"
import { Quote } from "@/types/quote"
import type { PaymentOption } from "@/types/quote"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface QuoteCardDfProps {
  quote: Quote
  paymentOption: PaymentOption
  onPaymentOptionChange: (option: PaymentOption) => void
  legalCover: boolean
  homeEmergency: boolean
  onLegalCoverChange: (checked: boolean) => void
  onHomeEmergencyChange: (checked: boolean) => void
  onMoreDetails: (quote: Quote) => void
  onPurchase?: (quote: Quote) => void
}

const TOOLTIP_TRIGGER_CLASS =
  "inline-flex rounded text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-ring"

export function QuoteCardDf({
  quote,
  paymentOption,
  onPaymentOptionChange,
  legalCover,
  homeEmergency,
  onLegalCoverChange,
  onHomeEmergencyChange,
  onMoreDetails,
  onPurchase,
}: QuoteCardDfProps) {
  const pricingMode = paymentOption

  const totalPriceRaw =
    quote.standardPrice +
    quote.piklPrice +
    (legalCover ? quote.familyLegalAddOnPrice : 0) +
    (homeEmergency ? quote.homeEmergencyAddOnPrice : 0)

  /** Scale annual total into [ANNUAL_DISPLAY_MIN, ANNUAL_DISPLAY_MAX]; line items scale proportionally. */
  const displayedAnnualTotal = Math.min(
    ANNUAL_DISPLAY_MAX,
    Math.max(
      ANNUAL_DISPLAY_MIN,
      ANNUAL_DISPLAY_MIN +
        ((totalPriceRaw - SOURCE_TOTAL_MIN) * (ANNUAL_DISPLAY_MAX - ANNUAL_DISPLAY_MIN)) /
          (SOURCE_TOTAL_MAX - SOURCE_TOTAL_MIN)
    )
  )
  const scaleFactor = totalPriceRaw > 0 ? displayedAnnualTotal / totalPriceRaw : 1

  /** Monthly: 1 deposit + 1× first month + 9 more. Base instalment = displayedAnnualTotal / 11. */
  const monthlyAmount = displayedAnnualTotal / MONTHLY_DIVISOR
  const depositAmount = monthlyAmount + MONTHLY_DEPOSIT_EXTRA
  const x1Amount = monthlyAmount + MONTHLY_X1_EXTRA

  const formatPounds = (n: number) => `£${n.toFixed(2)}`
  const toDisplayAnnual = (value: number) => formatPounds(value * scaleFactor)
  const toDisplayMonthly = (value: number) =>
    formatPounds((value * scaleFactor) / MONTHLY_DIVISOR)
  const toDisplay = (value: number) =>
    pricingMode === "annual" ? toDisplayAnnual(value) : toDisplayMonthly(value)

  return (
    <div className="flex min-w-0 w-full">
      <Card className="flex min-w-0 w-full max-w-full flex-col items-stretch rounded-[20px] border-none bg-white p-3 min-[1440px]:gap-6">
        {/* Stacked layout (QuoteCardSm) — 1439px and below */}
        <div className="flex min-w-0 w-full flex-col gap-3 p-0 min-[1440px]:hidden">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
              <span className="text-xs font-bold text-muted-foreground">LOGO</span>
            </div>
            <div className="flex items-center gap-2">
              {pricingMode === "annual" && (
                <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  10% cheaper
                </span>
              )}
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
          <div className="flex min-w-0 items-center gap-2">
            <span className="break-words text-base font-semibold text-foreground">
              {quote.providerName}
            </span>
            <span className="inline-flex shrink-0 items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Buildings & Contents
            </span>
          </div>
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
              <>
                <div className="flex min-w-0 items-baseline justify-between gap-2 border-t border-border py-3">
                  <span className="min-w-0 truncate text-[14px] text-muted-foreground">Deposit</span>
                  <span className="shrink-0 text-[14px] font-medium tabular-nums text-foreground">
                    {formatPounds(depositAmount)}
                  </span>
                </div>
                <div className="flex min-w-0 items-baseline justify-between gap-2 border-t border-border py-3">
                  <span className="flex min-w-0 items-baseline gap-1 text-[14px] text-muted-foreground">
                    × 1
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={`${TOOLTIP_TRIGGER_CLASS} inline-flex align-baseline`}
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
                    {formatPounds(x1Amount)}
                  </span>
                </div>
                <div className="flex min-w-0 items-baseline justify-between gap-2 border-t border-border py-3">
                  <span className="min-w-0 truncate text-[14px] text-muted-foreground">× 9</span>
                  <span className="shrink-0 text-[14px] font-medium tabular-nums text-foreground">
                    {formatPounds(monthlyAmount)}
                  </span>
                </div>
              </>
            )}
            <div className="flex min-w-0 items-baseline justify-between gap-2 border-t border-border py-2">
              <span className="min-w-0 text-sm text-muted-foreground">Excess</span>
              <span className="shrink-0 text-sm font-medium text-foreground">
                {quote.policyDetails.excess}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>Extras</span>
            <div className="h-px flex-1 bg-border" />
          </div>
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
          <div className="mt-2 flex min-w-0 items-center justify-between gap-2 border-t border-border pt-3">
            <span className="min-w-0 text-sm font-medium text-muted-foreground">Total price</span>
            <span className="shrink-0 text-lg font-semibold tabular-nums text-foreground">
              {pricingMode === "annual"
                ? formatPounds(displayedAnnualTotal)
                : `${formatPounds(monthlyAmount)}/mo.`}
            </span>
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

        {/* Horizontal layout (QuoteCardDf) — 1440px and above */}
        <div className="hidden min-w-0 w-full flex-col gap-6 min-[1440px]:flex">
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          {/* Logo + insurer name */}
          <div className="flex items-center gap-3">
            <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[10px] bg-[#D9D9D9]">
              <span className="text-xs font-semibold text-slate-600">LOGO</span>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="inline-flex w-fit rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Buildings & Contents
              </span>
              <span className="text-[16px] font-semibold text-[#1E1E1E]">
                {quote.providerName || "Insurer name"}
              </span>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-3">
            {/* Annual toggle: badge (when annual), label, then toggle */}
            <div className="flex items-center gap-2">
              {pricingMode === "annual" && (
                <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  10% cheaper
                </span>
              )}
              <span className="text-[14px] font-medium leading-[14px] text-[#1E1E1E]">
                {pricingMode === "annual" ? "Annual" : "Monthly"}
              </span>
              <Switch
                checked={pricingMode === "monthly"}
                onCheckedChange={(checked) =>
                  onPaymentOptionChange(checked ? "monthly" : "annual")
                }
                aria-label="Toggle annual or monthly"
              />
            </div>

            {/* More info */}
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-2 rounded-[6px] border-[#E2E8F0] bg-white px-4 py-2 text-[14px] font-medium text-slate-900"
              onClick={() => onMoreDetails(quote)}
            >
              More info
            </Button>

            {/* Purchase */}
            <Button
              type="button"
              className="flex items-center justify-center gap-2 rounded-[6px] bg-slate-900 px-4 py-2 text-[14px] font-medium text-white"
              onClick={() => onPurchase?.(quote)}
            >
              Purchase
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex min-w-0 w-full max-w-full items-stretch gap-6 overflow-x-auto rounded-[16px] border border-[#E2E8F0] bg-muted/30 p-3">
          {/* Home column */}
          <div className="flex min-w-0 flex-col items-start gap-4">
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap text-[14px] font-medium text-[#1E1E1E]">
                Home insurance
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={TOOLTIP_TRIGGER_CLASS}
                    aria-label="What is standard cover?"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[220px]">
                  General home insurance covering buildings and contents.
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-[18px] font-semibold text-[#1E1E1E]">
              {toDisplay(quote.standardPrice)}
            </div>
            <div className="text-[14px] font-medium text-[#1E1E1E]">
              Excess:{" "}
              <span className="font-semibold">
                {quote.policyDetails.excess ?? "£0"}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-auto w-px self-stretch bg-[#E2E8F0]" />

          {/* Host column */}
          <div className="flex min-w-0 flex-col items-start gap-4">
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap text-[14px] font-medium text-[#1E1E1E]">
                Host insurance
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={TOOLTIP_TRIGGER_CLASS}
                    aria-label="What is Pikl cover?"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[220px]">
                  Host insurance for short-term letting and home sharing.
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-[18px] font-semibold text-[#1E1E1E]">
              {toDisplay(quote.piklPrice)}
            </div>
            <div className="text-[14px] font-medium text-[#1E1E1E]">
              Excess: <span className="font-semibold">£50.00</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-auto w-px self-stretch bg-[#E2E8F0]" />

          {/* Family legal column */}
          <div className="flex min-w-[180px] w-[180px] flex-none flex-col items-start gap-4">
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap text-[14px] font-medium text-[#1E1E1E]">
                Family legal protection
              </span>
              <HelpCircle className="h-4 w-4 text-slate-500" aria-hidden />
            </div>
            <div className="text-[18px] font-semibold text-[#1E1E1E]">
              {toDisplay(quote.familyLegalAddOnPrice)}
            </div>
            <Switch
              checked={legalCover}
              onCheckedChange={onLegalCoverChange}
              aria-label="Family legal protection"
            />
          </div>

          {/* Divider */}
          <div className="h-auto w-px self-stretch bg-[#E2E8F0]" />

          {/* Home emergency column */}
          <div className="flex min-w-[180px] w-[180px] flex-none flex-col items-start gap-4">
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap text-[14px] font-medium text-[#1E1E1E]">
                Home emergency cover
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={TOOLTIP_TRIGGER_CLASS}
                    aria-label="What is home emergency cover?"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[220px]">
                  Optional home emergency cover add-on.
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-[18px] font-semibold text-[#1E1E1E]">
              {toDisplay(quote.homeEmergencyAddOnPrice)}
            </div>
            <Switch
              checked={homeEmergency}
              onCheckedChange={onHomeEmergencyChange}
              aria-label="Home emergency cover"
            />
          </div>

          {pricingMode === "monthly" && (
            <>
              {/* Divider */}
              <div className="h-auto w-px self-stretch bg-[#E2E8F0]" />

              {/* Monthly breakdown */}
              <div className="flex w-[121px] min-w-[121px] flex-none flex-col items-stretch">
                <div className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] py-2">
                  <span className="text-[14px] font-medium text-[#1E1E1E]">Deposit:</span>
                  <span className="text-[14px] font-semibold text-[#1E1E1E]">
                    {formatPounds(depositAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] py-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[14px] font-medium text-[#1E1E1E]">×1</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={TOOLTIP_TRIGGER_CLASS}
                          aria-label="Admin fee info"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[220px]">
                        Our insurer PremFina charges a £5 admin fee.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-[14px] font-semibold text-[#1E1E1E]">
                    {formatPounds(x1Amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2">
                  <span className="text-[14px] font-medium text-[#1E1E1E]">×9</span>
                  <span className="text-[14px] font-semibold text-[#1E1E1E]">
                    {formatPounds(monthlyAmount)}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Total price block */}
          <div className="flex h-[120px] w-[120px] flex-none flex-col items-center justify-center gap-4 rounded-[12px] border border-[#E2E8F0] bg-white p-2 text-center">
            <div className="text-[14px] font-medium text-[#1E1E1E]">
              {pricingMode === "annual" ? "Total price" : "Monthly Price"}
            </div>
            <div className="text-[14px] font-semibold text-[#1E1E1E]">
              {pricingMode === "annual"
                ? formatPounds(displayedAnnualTotal)
                : (
                    <>
                      {formatPounds(monthlyAmount)}
                      <span className="text-xs font-normal">/mo.</span>
                    </>
                  )}
            </div>
          </div>
        </div>
        </div>
      </Card>
    </div>
  )
}


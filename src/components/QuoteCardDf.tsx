import {
  HelpCircle,
  Home,
  Info,
  Scale,
  ShoppingCart,
  Users,
  Wrench,
} from "lucide-react"
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
  policyType: string
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

const COLUMN_ICON_CLASS =
  "flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FFF] text-neutral-700"
const COLUMN_BOX_CLASS =
  "flex w-[200px] min-w-[200px] flex-none flex-col gap-3 rounded-[12px] border border-neutral-200 bg-[#FFF] p-3"

export function QuoteCardDf({
  quote,
  policyType,
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
      <Card className="flex min-w-0 w-full max-w-full flex-col items-stretch rounded-[20px] border-none bg-white p-3 min-[1513px]:gap-3">
        {/* Stacked layout (QuoteCardSm) — 1512px and below */}
        <div className="flex min-w-0 w-full flex-col gap-2 p-0 min-[1513px]:hidden">
          {/* Logo + insurer name (left) | policyType badge (right) */}
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
                <span className="text-xs font-bold text-muted-foreground">LOGO</span>
              </div>
              <span className="break-words text-base font-semibold text-foreground">
                {quote.providerName}
              </span>
            </div>
            <span className="inline-flex shrink-0 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-muted-foreground">
              {policyType}
            </span>
          </div>

          {/* Home + Host in one wrapper, divider between them */}
          <div className="flex w-full flex-col rounded-[12px] border border-neutral-200 bg-[#FAFAFA]">
            <div className="flex w-full flex-col gap-3 p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className={COLUMN_ICON_CLASS}>
                    <Home className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Home insurance</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    Included
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
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[18px] font-semibold text-foreground tabular-nums">
                  {toDisplay(quote.standardPrice)}
                </span>
                <span className="text-sm font-medium text-foreground">
                  Excess:{" "}
                  <span className="font-semibold">
                    {(quote.policyDetails.excess ?? "£0").replace(/\.00$/, "")}
                  </span>
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-neutral-200" aria-hidden />

            <div className="flex w-full flex-col gap-3 p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className={COLUMN_ICON_CLASS}>
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Host insurance</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    Included
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
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[18px] font-semibold text-foreground tabular-nums">
                  {toDisplay(quote.piklPrice)}
                </span>
                <span className="text-sm font-medium text-foreground">
                  Excess: <span className="font-semibold">£50</span>
                </span>
              </div>
            </div>
          </div>

          {/* Family legal + Home emergency — side by side */}
          <div className="flex w-full gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-[12px] border border-neutral-200 bg-[#FAFAFA] p-2">
              <div className="flex items-center justify-between gap-2">
                <div className={COLUMN_ICON_CLASS}>
                  <Scale className="h-4 w-4" />
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    Optional
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={TOOLTIP_TRIGGER_CLASS}
                        aria-label="Family legal protection"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[220px]">
                      Optional family legal protection add-on.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground">Legal Cover</span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[18px] font-semibold text-foreground tabular-nums">
                  {toDisplay(quote.familyLegalAddOnPrice)}
                </span>
                <Switch
                  checked={legalCover}
                  onCheckedChange={onLegalCoverChange}
                  aria-label="Family legal protection"
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-[12px] border border-neutral-200 bg-[#FAFAFA] p-2">
              <div className="flex items-center justify-between gap-2">
                <div className={COLUMN_ICON_CLASS}>
                  <Wrench className="h-4 w-4" />
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    Optional
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
              </div>
              <span className="text-sm font-medium text-foreground">Emergency Cover</span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[18px] font-semibold text-foreground tabular-nums">
                  {toDisplay(quote.homeEmergencyAddOnPrice)}
                </span>
                <Switch
                  checked={homeEmergency}
                  onCheckedChange={onHomeEmergencyChange}
                  aria-label="Home emergency cover"
                />
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-neutral-200" aria-hidden />

          {/* Monthly only — payment breakdown, full width */}
          {pricingMode === "monthly" && (
            <div className="flex w-full flex-col gap-0 bg-[#FAFAFA] py-2">
              <span className="mb-2 text-sm font-medium text-muted-foreground">
                Payment breakdown
              </span>
              <div className="flex items-center justify-between gap-4 border-b border-neutral-200 py-2">
                <span className="text-[14px] font-medium text-foreground">Deposit:</span>
                <span className="text-[14px] font-semibold text-foreground tabular-nums">
                  {formatPounds(depositAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-neutral-200 py-2">
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-medium text-foreground">First payment (×1):</span>
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
                <span className="text-[14px] font-semibold text-foreground tabular-nums">
                  {formatPounds(x1Amount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-2">
                <span className="text-[14px] font-medium text-foreground">Monthly (×9):</span>
                <span className="text-[14px] font-semibold text-foreground tabular-nums">
                  {formatPounds(monthlyAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Total price block — full width, both modes */}
          <div className="flex w-full flex-col gap-3 bg-[#FAFAFA] py-2">
            <div className="flex w-full items-center justify-between gap-2">
              <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Annual is 10% Cheaper
              </span>
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
            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {pricingMode === "annual" ? "Total price" : "Total monthly price"}
              </span>
              <span className="text-lg font-semibold tabular-nums text-foreground">
                {pricingMode === "annual"
                  ? formatPounds(displayedAnnualTotal)
                  : `${formatPounds(monthlyAmount)}/mo.`}
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-neutral-200" aria-hidden />

          {/* Full width: More info, then Purchase */}
          <Button
            variant="outline"
            className="h-10 w-full gap-1.5"
            onClick={() => onMoreDetails(quote)}
          >
            <Info className="h-4 w-4 shrink-0" />
            More info
          </Button>
          <Button className="h-10 w-full gap-1.5" onClick={() => onPurchase?.(quote)}>
            <ShoppingCart className="h-4 w-4 shrink-0" />
            Purchase
          </Button>
        </div>

        {/* Horizontal layout — 1513px and above */}
        <div className="hidden min-w-0 w-full flex-col gap-3 min-[1513px]:flex">
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          {/* Logo + insurer name */}
          <div className="flex items-center gap-3">
            <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[10px] bg-[#F5F5F5]">
              <span className="text-xs font-semibold text-slate-600">LOGO</span>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="inline-flex w-fit rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {policyType}
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
        <div className="flex min-w-0 w-full max-w-full flex-nowrap items-stretch gap-4 overflow-x-auto">
          {/* Home column */}
          <div className={COLUMN_BOX_CLASS}>
            <div className="flex items-center justify-between gap-2">
              <div className={COLUMN_ICON_CLASS}>
                <Home className="h-4 w-4" />
              </div>
              <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Included
              </span>
            </div>
            <div className="flex flex-col gap-2">
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
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[18px] font-semibold text-[#1E1E1E]">
                  {toDisplay(quote.standardPrice)}
                </span>
                <span className="text-[14px] font-medium text-[#1E1E1E]">
                  Excess:{" "}
                  <span className="font-semibold">
                    {(quote.policyDetails.excess ?? "£0").replace(/\.00$/, "")}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Host column */}
          <div className={COLUMN_BOX_CLASS}>
            <div className="flex items-center justify-between gap-2">
              <div className={COLUMN_ICON_CLASS}>
                <Users className="h-4 w-4" />
              </div>
              <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Included
              </span>
            </div>
            <div className="flex flex-col gap-2">
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
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[18px] font-semibold text-[#1E1E1E]">
                  {toDisplay(quote.piklPrice)}
                </span>
                <span className="text-[14px] font-medium text-[#1E1E1E]">
                  Excess: <span className="font-semibold">£50</span>
                </span>
              </div>
            </div>
          </div>

          {/* Family legal column */}
          <div className={COLUMN_BOX_CLASS}>
            <div className="flex items-center justify-between gap-2">
              <div className={COLUMN_ICON_CLASS}>
                <Scale className="h-4 w-4" />
              </div>
              <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Optional
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <span className="whitespace-nowrap text-[14px] font-medium text-[#1E1E1E]">
                  Legal Cover
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={TOOLTIP_TRIGGER_CLASS}
                      aria-label="Family legal protection"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[220px]">
                    Optional family legal protection add-on.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[18px] font-semibold text-[#1E1E1E]">
                  {toDisplay(quote.familyLegalAddOnPrice)}
                </span>
                <Switch
                  checked={legalCover}
                  onCheckedChange={onLegalCoverChange}
                  aria-label="Family legal protection"
                />
              </div>
            </div>
          </div>

          {/* Home emergency column */}
          <div className={COLUMN_BOX_CLASS}>
            <div className="flex items-center justify-between gap-2">
              <div className={COLUMN_ICON_CLASS}>
                <Wrench className="h-4 w-4" />
              </div>
              <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Optional
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <span className="whitespace-nowrap text-[14px] font-medium text-[#1E1E1E]">
                  Emergency Cover
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
              <div className="flex items-center justify-between gap-2">
                <span className="text-[18px] font-semibold text-[#1E1E1E]">
                  {toDisplay(quote.homeEmergencyAddOnPrice)}
                </span>
                <Switch
                  checked={homeEmergency}
                  onCheckedChange={onHomeEmergencyChange}
                  aria-label="Home emergency cover"
                />
              </div>
            </div>
          </div>

          {/* Divider after Home emergency */}
          <div
            className="h-auto w-px flex-shrink-0 self-stretch bg-neutral-200"
            aria-hidden
          />

          {pricingMode === "monthly" && (
            <div className="flex w-fit flex-none flex-col justify-center self-stretch py-2">
              <div className="flex items-center justify-between gap-4 border-b border-neutral-200 py-2">
                <span className="text-[14px] font-medium text-[#1E1E1E]">Deposit</span>
                <span className="text-[14px] font-semibold text-[#1E1E1E]">
                  {formatPounds(depositAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-neutral-200 py-2">
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-medium text-[#1E1E1E]">× 1</span>
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
                <span className="text-[14px] font-medium text-[#1E1E1E]">× 9</span>
                <span className="text-[14px] font-semibold text-[#1E1E1E]">
                  {formatPounds(monthlyAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Total price block */}
          <div className="flex w-[120px] min-w-[120px] flex-none flex-col items-center justify-center gap-1 self-stretch rounded-[12px] border border-neutral-200 bg-[#FAFAFA] p-3 text-center">
            <span className="text-[14px] font-medium text-[#1E1E1E]">
              {pricingMode === "annual" ? "Total price" : "Monthly price"}
            </span>
            <span className="text-[14px] font-semibold text-[#1E1E1E]">
              {pricingMode === "annual"
                ? formatPounds(displayedAnnualTotal)
                : `${formatPounds(monthlyAmount)}/mo.`}
            </span>
          </div>
        </div>
        </div>
      </Card>
    </div>
  )
}

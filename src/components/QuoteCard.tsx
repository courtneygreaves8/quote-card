import { Check, ChevronDown, HelpCircle, Home, Info, Scale, ShieldCheck, Star, Tag, Users, Wrench } from "lucide-react"
import {
  ANNUAL_DISPLAY_MAX,
  ANNUAL_DISPLAY_MIN,
  MONTHLY_DEPOSIT_EXTRA,
  MONTHLY_DIVISOR,
  MONTHLY_X1_EXTRA,
  PAYMENT_ACTIVE_CLASS,
  PAYMENT_INACTIVE_CLASS,
  SOURCE_TOTAL_MAX,
  SOURCE_TOTAL_MIN,
} from "@/lib/constants"
import type { PaymentOption, Quote } from "@/types/quote"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ResponsiveTooltip } from "@/components/ResponsiveTooltip"

interface QuoteCardProps {
  quote: Quote
  policyType: string
  paymentOption: PaymentOption
  onPaymentOptionChange: (option: PaymentOption) => void
  legalCover: boolean
  homeEmergency: boolean
  /** Sidebar toggles that affect base buildings/contents pricing */
  buildingsAccidentalDamage: boolean
  contentsAccidentalDamage: boolean
  onMoreDetails: (quote: Quote) => void
  onPurchase?: (quote: Quote) => void
  monthlyBreakdownInDropdown?: boolean
}

const TOOLTIP_TRIGGER_CLASS_DF =
  "inline-flex cursor-pointer rounded text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-ring"

const COLUMN_ICON_CLASS =
  "flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FCFCFC] text-neutral-700 transition-colors duration-150 group-hover:bg-[#FFF]"

const COLUMN_BOX_GRID_CLASS =
  "group flex w-full flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-3 transition-colors duration-150 hover:bg-[#FCFCFC]"

export function QuoteCard({
  quote,
  policyType,
  paymentOption,
  onPaymentOptionChange,
  legalCover,
  homeEmergency,
  buildingsAccidentalDamage,
  contentsAccidentalDamage,
  onMoreDetails,
  onPurchase,
  monthlyBreakdownInDropdown = false,
}: QuoteCardProps) {
  const pricingMode = paymentOption

  // Base standard price adjusted for buildings / contents accidental damage
  const adjustedStandardPrice =
    quote.standardPrice +
    (buildingsAccidentalDamage ? 3 : 0) +
    (contentsAccidentalDamage ? 2 : 0)

  const totalPriceRaw =
    adjustedStandardPrice +
    quote.piklPrice +
    (legalCover ? quote.familyLegalAddOnPrice : 0) +
    (homeEmergency ? quote.homeEmergencyAddOnPrice : 0)

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
      <Card className="flex min-w-0 w-full max-w-full flex-col items-stretch rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition-shadow duration-200 hover:shadow-lg lg:border-none lg:shadow-none lg:gap-3">
        <div className="flex min-w-0 w-full flex-col gap-3">
          {/* Header */}
          <div className="flex w-full flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100">
                <span className="text-xs font-semibold text-slate-600">LOGO</span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <div className="inline-flex w-fit items-center gap-1 rounded-sm border border-neutral-200 bg-white px-1.5 py-0.5 text-xs text-muted-foreground">
                  <span className="font-medium">{quote.trustpilotRating.toFixed(1)}</span>
                  <ResponsiveTooltip content="Defaqto rating">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden />
                  </ResponsiveTooltip>
                </div>
                <span className="truncate text-base font-semibold text-[#1E1E1E]">
                  {quote.providerName} &amp; Pikl
                </span>
                <span className="truncate text-xs text-muted-foreground">{policyType}</span>
              </div>
            </div>

            <div className="flex w-full flex-col items-stretch gap-2 lg:w-auto lg:flex-row lg:items-start lg:justify-end lg:gap-1.5">
              {/* Mobile payment toggle – top-right on <=1023px */}
              <div className="flex h-9 w-full items-center overflow-hidden rounded-full border border-input bg-muted/30 gap-0.5 px-0.5 py-0.5 lg:hidden">
                <Button
                  type="button"
                  variant="ghost"
                  size="pill"
                  className={`${pricingMode === "annual" ? PAYMENT_ACTIVE_CLASS : PAYMENT_INACTIVE_CLASS} flex-1 h-full px-2 gap-1.5 text-xs`}
                  onClick={() => onPaymentOptionChange("annual")}
                >
                  <span className="inline-flex items-center gap-0.5">
                    <Tag className="h-3 w-3 shrink-0" aria-hidden />
                    <span>-10%</span>
                  </span>
                  Annual
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="pill"
                  className={`${pricingMode === "monthly" ? PAYMENT_ACTIVE_CLASS : PAYMENT_INACTIVE_CLASS} flex-1 h-full px-2 text-xs`}
                  onClick={() => onPaymentOptionChange("monthly")}
                >
                  Monthly
                </Button>
              </div>

              {/* Desktop (lg+): annual/monthly toggle next to More info + Continue column */}
              <div className="hidden w-full flex-row items-start gap-2 lg:flex lg:w-auto">
                <div className="flex h-9 w-fit items-center overflow-hidden rounded-full border border-input bg-muted/30 gap-0.5 px-0.5 py-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="pill"
                    className={`${pricingMode === "annual" ? PAYMENT_ACTIVE_CLASS : PAYMENT_INACTIVE_CLASS} !flex-initial h-full px-2 gap-1.5 text-xs`}
                    onClick={() => onPaymentOptionChange("annual")}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      <Tag className="h-3 w-3 shrink-0" aria-hidden />
                      <span>-10%</span>
                    </span>
                    Annual
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="pill"
                    className={`${pricingMode === "monthly" ? PAYMENT_ACTIVE_CLASS : PAYMENT_INACTIVE_CLASS} !flex-initial h-full px-2 text-xs`}
                    onClick={() => onPaymentOptionChange("monthly")}
                  >
                    Monthly
                  </Button>
                </div>
                <div className="flex flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-center gap-1.5 border-[#E2E8F0] bg-white px-4 text-xs font-medium text-slate-900"
                    onClick={() => onMoreDetails(quote)}
                  >
                    <Info className="h-4 w-4 shrink-0" />
                    More info
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    className="justify-center gap-1.5 px-4 text-xs font-medium"
                    onClick={() => onPurchase?.(quote)}
                  >
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex min-w-0 w-full max-w-full flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-2">
            {/* Four coverage blocks: 2×2 grid below lg, 4 columns on desktop */}
            <div
              className={
                monthlyBreakdownInDropdown
                  ? "order-1 grid w-full flex-1 min-w-0 grid-cols-2 gap-2 md:grid-cols-4"
                  : "order-1 grid w-full grid-cols-2 gap-2 md:grid-cols-4 lg:w-max lg:flex-shrink-0"
              }
            >
              {/* Home column */}
              <div className={COLUMN_BOX_GRID_CLASS}>
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
                    <span className="whitespace-nowrap text-sm font-medium text-[#1E1E1E]">
                      Home Insurance
                    </span>
                  </div>
                  {/* Mobile / tablet: price and excess on one line */}
                  <div className="flex items-baseline justify-between gap-2 lg:hidden">
                    <span className="text-base font-semibold text-[#1E1E1E]">
                      {toDisplay(adjustedStandardPrice)}
                    </span>
                    <span className="inline-flex items-center rounded-[8px] border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Excess{" "}
                      <span className="ml-1 font-semibold text-[#1E1E1E]">
                        {(quote.policyDetails.excess ?? "£0").replace(/\.00$/, "")}
                      </span>
                    </span>
                  </div>
                  {/* Desktop (lg+): price on first line, excess badge + tooltip on second line (right) */}
                  <div className="hidden flex-col gap-3 lg:flex">
                    <span className="text-base font-semibold text-[#1E1E1E]">
                      {toDisplay(adjustedStandardPrice)}
                    </span>
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="inline-flex items-center rounded-[8px] border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Excess{" "}
                        <span className="ml-1 font-semibold text-[#1E1E1E]">
                          {(quote.policyDetails.excess ?? "£0").replace(/\.00$/, "")}
                        </span>
                      </span>
                      <ResponsiveTooltip
                        side="right"
                        className="max-w-xs"
                        content={
                          <p className="text-sm">
                            Home Insurance: Covers the structure of your property and contents. This is
                            included in your quote and provided by {quote.providerName}.
                          </p>
                        }
                      >
                        <button
                          type="button"
                          className={TOOLTIP_TRIGGER_CLASS_DF}
                          aria-label="What is standard cover?"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </ResponsiveTooltip>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host column */}
              <div className={COLUMN_BOX_GRID_CLASS}>
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
                    <span className="whitespace-nowrap text-sm font-medium text-[#1E1E1E]">
                      Host Insurance
                    </span>
                  </div>
                  {/* Mobile / tablet: price and excess on one line */}
                  <div className="flex items-baseline justify-between gap-2 lg:hidden">
                    <span className="text-base font-semibold text-[#1E1E1E]">
                      {toDisplay(quote.piklPrice)}
                    </span>
                    <span className="inline-flex items-center rounded-[8px] border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Excess <span className="ml-1 font-semibold text-[#1E1E1E]">£50</span>
                    </span>
                  </div>
                  {/* Desktop (lg+): price on first line, excess badge + tooltip on second line (right) */}
                  <div className="hidden flex-col gap-3 lg:flex">
                    <span className="text-base font-semibold text-[#1E1E1E]">
                      {toDisplay(quote.piklPrice)}
                    </span>
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="inline-flex items-center rounded-[8px] border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Excess <span className="ml-1 font-semibold text-[#1E1E1E]">£50</span>
                      </span>
                      <ResponsiveTooltip
                        side="right"
                        className="max-w-xs"
                        content={
                          <p className="text-sm">
                            Host Insurance: Covers short-term letting and home sharing. This is included in
                            your quote and provided by Pikl.
                          </p>
                        }
                      >
                        <button
                          type="button"
                          className={TOOLTIP_TRIGGER_CLASS_DF}
                          aria-label="What is Pikl cover?"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </ResponsiveTooltip>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal column */}
              <div className={COLUMN_BOX_GRID_CLASS}>
                <div className="flex items-center justify-between gap-2">
                  <div className={COLUMN_ICON_CLASS}>
                    <Scale className="h-4 w-4" />
                  </div>
                  <span
                    className={
                      legalCover
                        ? "inline-flex items-center gap-1 rounded-md border border-transparent bg-button px-2 py-0.5 text-xs font-medium text-white"
                        : "rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {legalCover ? (
                      <>
                        <Check className="h-3 w-3 shrink-0" aria-hidden />
                        Selected
                      </>
                    ) : (
                      "Optional"
                    )}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap text-sm font-medium text-[#1E1E1E]">
                      Legal Cover
                    </span>
                  </div>
                  {/* Mobile / tablet: price and excess badge (no toggle) */}
                  <div className="flex items-baseline justify-between gap-2 lg:hidden">
                    <span className="text-base font-semibold text-[#1E1E1E]">
                      {toDisplay(quote.familyLegalAddOnPrice)}
                    </span>
                    <span className="inline-flex items-center rounded-[8px] border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Excess <span className="ml-1 font-semibold text-[#1E1E1E]">£25</span>
                    </span>
                  </div>
                  {/* Desktop (lg+): price on first line, excess badge + tooltip on second line (right) */}
                  <div className="hidden flex-col gap-3 lg:flex">
                    <span className="text-base font-semibold text-[#1E1E1E]">
                      {toDisplay(quote.familyLegalAddOnPrice)}
                    </span>
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="inline-flex items-center rounded-[8px] border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Excess <span className="ml-1 font-semibold text-[#1E1E1E]">£25</span>
                      </span>
                      <ResponsiveTooltip
                        side="right"
                        className="max-w-xs"
                        content={
                          <p className="text-sm">
                            Legal cover is an optional add-on providing legal protection for you and your
                            household.
                          </p>
                        }
                      >
                        <button
                          type="button"
                          className={TOOLTIP_TRIGGER_CLASS_DF}
                          aria-label="Family legal protection"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </ResponsiveTooltip>
                    </div>
                  </div>
                </div>
              </div>

              {/* Home emergency column */}
              <div className={COLUMN_BOX_GRID_CLASS}>
                <div className="flex items-center justify-between gap-2">
                  <div className={COLUMN_ICON_CLASS}>
                    <Wrench className="h-4 w-4" />
                  </div>
                  <span
                    className={
                      homeEmergency
                        ? "inline-flex items-center gap-1 rounded-md border border-transparent bg-button px-2 py-0.5 text-xs font-medium text-white"
                        : "rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {homeEmergency ? (
                      <>
                        <Check className="h-3 w-3 shrink-0" aria-hidden />
                        Selected
                      </>
                    ) : (
                      "Optional"
                    )}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap text-sm font-medium text-[#1E1E1E]">
                      Emergency Cover
                    </span>
                  </div>
                  {/* Mobile / tablet: price and excess badge (no toggle) */}
                  <div className="flex items-baseline justify-between gap-2 lg:hidden">
                    <span className="text-base font-semibold text-[#1E1E1E]">
                      {toDisplay(quote.homeEmergencyAddOnPrice)}
                    </span>
                    <span className="inline-flex items-center rounded-[8px] border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Excess <span className="ml-1 font-semibold text-[#1E1E1E]">£25</span>
                    </span>
                  </div>
                  {/* Desktop (lg+): price on first line, excess badge + tooltip on second line (right) */}
                  <div className="hidden flex-col gap-3 lg:flex">
                    <span className="text-base font-semibold text-[#1E1E1E]">
                      {toDisplay(quote.homeEmergencyAddOnPrice)}
                    </span>
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="inline-flex items-center rounded-[8px] border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Excess <span className="ml-1 font-semibold text-[#1E1E1E]">£25</span>
                      </span>
                      <ResponsiveTooltip
                        side="right"
                        className="max-w-xs"
                        content={
                          <p className="text-sm">
                            Emergency cover is an optional add-on for home emergency cover.
                          </p>
                        }
                      >
                        <button
                          type="button"
                          className={TOOLTIP_TRIGGER_CLASS_DF}
                          aria-label="What is home emergency cover?"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </ResponsiveTooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {pricingMode === "monthly" && !monthlyBreakdownInDropdown && (
              <div className="order-4 flex w-full flex-col justify-center py-2 lg:order-2 lg:w-fit lg:flex-none lg:self-stretch">
                <div className="flex items-center justify-between gap-4 border-b border-neutral-200 py-2">
                  <span className="text-sm font-medium text-[#1E1E1E]">Deposit</span>
                  <span className="text-sm font-semibold text-[#1E1E1E]">
                    {formatPounds(depositAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-neutral-200 py-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-[#1E1E1E]">× 1</span>
                    <ResponsiveTooltip
                      side="right"
                      className="max-w-xs"
                      content={
                        <p className="text-sm">
                          First payment (×1): Our insurer PremFina charges a £5 admin fee on this instalment.
                        </p>
                      }
                    >
                      <button
                        type="button"
                        className={TOOLTIP_TRIGGER_CLASS_DF}
                        aria-label="Admin fee info"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </ResponsiveTooltip>
                  </div>
                  <span className="text-sm font-semibold text-[#1E1E1E]">
                    {formatPounds(x1Amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2">
                  <span className="text-sm font-medium text-[#1E1E1E]">× 9</span>
                  <span className="text-sm font-semibold text-[#1E1E1E]">
                    {formatPounds(monthlyAmount)}
                  </span>
                </div>
              </div>
            )}

            {/* Total price block */}
            <div
              className={
                monthlyBreakdownInDropdown
                  ? "order-3 flex w-full flex-col items-center justify-center gap-1 self-stretch rounded-xl border border-neutral-200 bg-[#FAFAFA] p-3 text-center lg:order-3 lg:w-[160.5px] lg:min-w-[160.5px] lg:flex-none"
                  : "order-3 flex w-full flex-col items-center justify-center gap-1 self-stretch rounded-xl border border-neutral-200 bg-[#FAFAFA] p-3 text-center lg:order-3 lg:w-[160.5px] lg:min-w-[160.5px] lg:flex-none"
              }
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#1E1E1E]">
                  {pricingMode === "annual" ? "Total Annual" : "Total Monthly"}
                </span>
                <span className="text-sm font-medium text-[#1E1E1E]">Premium</span>
              </div>
              <span className="text-base font-semibold text-[#1E1E1E]">
                {pricingMode === "annual"
                  ? formatPounds(displayedAnnualTotal)
                  : formatPounds(monthlyAmount)}
              </span>
            </div>
          </div>

          {pricingMode === "monthly" && monthlyBreakdownInDropdown && (
            <Collapsible className="group/breakdown w-full">
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left text-sm font-medium text-[#1E1E1E] shadow-sm hover:bg-neutral-50">
                <span>Monthly breakdown</span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/breakdown:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-visible">
                <div className="mt-3 w-full overflow-hidden rounded-b-xl rounded-t-xl border border-neutral-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 py-2">
                    <span className="text-sm font-medium text-[#1E1E1E]">Deposit</span>
                    <span className="text-sm font-semibold text-[#1E1E1E]">
                      {formatPounds(depositAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-100 px-4 py-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-[#1E1E1E]">× 1</span>
                      <ResponsiveTooltip
                        side="right"
                        className="max-w-xs"
                        content={
                          <p className="text-sm">
                            First payment (×1): Our insurer PremFina charges a £5 admin fee on this instalment.
                          </p>
                        }
                      >
                        <button
                          type="button"
                          className={TOOLTIP_TRIGGER_CLASS_DF}
                          aria-label="Admin fee info"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </ResponsiveTooltip>
                    </div>
                    <span className="text-sm font-semibold text-[#1E1E1E]">
                      {formatPounds(x1Amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-b-xl bg-white px-4 py-2">
                    <span className="text-sm font-medium text-[#1E1E1E]">× 9</span>
                    <span className="text-sm font-semibold text-[#1E1E1E]">
                      {formatPounds(monthlyAmount)}
                    </span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* More info + Purchase at bottom of card for 1023px and below */}
          <div className="mt-1 flex w-full flex-col gap-2 lg:hidden">
            <Button
              type="button"
              variant="outline"
              className="flex-1 justify-center gap-1.5 border-[#E2E8F0] bg-white px-4 text-xs font-medium text-slate-900 h-9 max-[767px]:h-11 max-[767px]:min-h-[44px]"
              onClick={() => onMoreDetails(quote)}
            >
              <Info className="h-4 w-4 shrink-0" />
              More info
            </Button>
            <Button
              type="button"
              variant="default"
              className="flex-1 justify-center gap-1.5 px-4 text-xs font-medium h-9 max-[767px]:h-11 max-[767px]:min-h-[44px]"
              onClick={() => onPurchase?.(quote)}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}


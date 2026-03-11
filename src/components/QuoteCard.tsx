import {
  ChevronDown,
  HelpCircle,
  Home,
  Info,
  Scale,
  Tag,
  ShoppingCart,
  Star,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PAYMENT_ACTIVE_CLASS, PAYMENT_INACTIVE_CLASS } from "@/lib/constants"

interface QuoteCardProps {
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
  monthlyBreakdownInDropdown?: boolean
  forceHorizontalLayout?: boolean
}

const TOOLTIP_TRIGGER_CLASS_DF =
  "inline-flex cursor-pointer rounded text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-ring"

const COLUMN_ICON_CLASS =
  "flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FCFCFC] text-neutral-700 transition-colors duration-150 group-hover:bg-[#FFF]"

const COLUMN_BOX_GRID_CLASS =
  "group flex w-full flex-col gap-3 rounded-[12px] border border-neutral-200 bg-[#FFF] p-3 transition-colors duration-150 hover:bg-[#FCFCFC] lg:w-[192px] lg:min-w-[192px] lg:flex-none"

export function QuoteCard({
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
  monthlyBreakdownInDropdown = false,
  forceHorizontalLayout = false,
}: QuoteCardProps) {
  const pricingMode = paymentOption

  const totalPriceRaw =
    quote.standardPrice +
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
      <Card className="flex min-w-0 w-full max-w-full flex-col items-stretch rounded-[20px] border-none bg-white p-3 shadow-none transition-shadow duration-200 hover:shadow-lg lg:gap-3">
        <div className="flex min-w-0 w-full flex-col gap-3">
          {/* Header */}
          <div className="flex w-full flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#F5F5F5]">
                <span className="text-xs font-semibold text-slate-600">LOGO</span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <div className="inline-flex w-fit items-center gap-1 rounded-[4px] border border-neutral-200 bg-white px-1.5 py-0.5 text-xs text-muted-foreground">
                  <span className="font-medium">{quote.trustpilotRating.toFixed(1)}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden />
                    </TooltipTrigger>
                    <TooltipContent>TrustPilot</TooltipContent>
                  </Tooltip>
                </div>
                <span className="truncate text-[16px] font-semibold text-[#1E1E1E]">
                  {(quote.providerName || "Insurer name") + " + Pikl"}
                </span>
                <span className="truncate text-xs text-muted-foreground">{policyType}</span>
              </div>
            </div>

            <div className="flex w-full flex-col items-stretch gap-2 lg:w-auto lg:flex-row lg:items-center lg:justify-end lg:gap-1.5">
              {/* Badge + toggle: only show in header on ≥lg (1024px) */}
              <div className="hidden items-center gap-2 lg:flex">
                {pricingMode === "annual" && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-[#FFF] px-3 py-0.5 text-xs font-medium text-primary whitespace-nowrap">
                    <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden />
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

              {/* Buttons: side by side on all breakpoints (fill width on small) */}
              <div className="flex w-full flex-row gap-2 lg:gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 flex-1 justify-center gap-1.5 border-[#E2E8F0] bg-white px-4 text-[12px] font-medium text-slate-900"
                  onClick={() => onMoreDetails(quote)}
                >
                  <Info className="h-4 w-4 shrink-0" />
                  More info
                </Button>

                <Button
                  type="button"
                  className="h-9 flex-1 justify-center gap-1.5 bg-slate-900 px-4 text-[12px] font-medium text-white"
                  onClick={() => onPurchase?.(quote)}
                >
                  <ShoppingCart className="h-4 w-4 shrink-0" />
                  Purchase
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex min-w-0 w-full max-w-full flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-3">
            {/* Four coverage blocks: 2×2 grid below lg, 4 columns on desktop */}
            <div
              className={
                monthlyBreakdownInDropdown
                  ? "order-1 grid w-full flex-1 min-w-0 grid-cols-2 gap-3 lg:grid-cols-4"
                  : "order-1 grid w-full grid-cols-2 gap-3 lg:grid-cols-4 lg:w-max lg:flex-shrink-0"
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
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap text-[14px] font-medium text-[#1E1E1E]">
                      Home Insurance
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={TOOLTIP_TRIGGER_CLASS_DF}
                          aria-label="What is standard cover?"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[220px]">
                        <p className="text-sm">
                          Home Insurance: Covers the structure of your property and contents. This
                          is included in your quote and provided by {quote.providerName}.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[16px] font-semibold text-[#1E1E1E]">
                      {toDisplay(quote.standardPrice)}
                    </span>
                    <span className="whitespace-nowrap text-[12px] font-medium text-[#1E1E1E]">
                      Excess:{" "}
                      <span className="font-semibold">
                        {(quote.policyDetails.excess ?? "£0").replace(/\.00$/, "")}
                      </span>
                    </span>
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
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap text-[14px] font-medium text-[#1E1E1E]">
                      Host Insurance
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={TOOLTIP_TRIGGER_CLASS_DF}
                          aria-label="What is Pikl cover?"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[220px]">
                        <p className="text-sm">
                          Host Insurance: Covers short-term letting and home sharing. This is
                          included in your quote and provided by Pikl.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[16px] font-semibold text-[#1E1E1E]">
                      {toDisplay(quote.piklPrice)}
                    </span>
                    <span className="whitespace-nowrap text-[12px] font-medium text-[#1E1E1E]">
                      Excess: <span className="font-semibold">£50</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Legal column */}
              <div className={COLUMN_BOX_GRID_CLASS}>
                <div className="flex items-center justify-between gap-2">
                  <div className={COLUMN_ICON_CLASS}>
                    <Scale className="h-4 w-4" />
                  </div>
                  <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    Optional
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap text-[14px] font-medium text-[#1E1E1E]">
                      Legal Cover
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={TOOLTIP_TRIGGER_CLASS_DF}
                          aria-label="Family legal protection"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[220px]">
                        <p className="text-sm">
                          Legal cover is an optional add-on providing legal protection for you and
                          your household.
                        </p>
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
              <div className={COLUMN_BOX_GRID_CLASS}>
                <div className="flex items-center justify-between gap-2">
                  <div className={COLUMN_ICON_CLASS}>
                    <Wrench className="h-4 w-4" />
                  </div>
                  <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    Optional
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap text-[14px] font-medium text-[#1E1E1E]">
                      Emergency Cover
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={TOOLTIP_TRIGGER_CLASS_DF}
                          aria-label="What is home emergency cover?"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[220px]">
                        <p className="text-sm">
                          Emergency cover is an optional add-on for home emergency cover.
                        </p>
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
            </div>

            {pricingMode === "monthly" && !monthlyBreakdownInDropdown && (
              <div className="order-4 flex w-full flex-col justify-center py-2 lg:order-2 lg:w-fit lg:flex-none lg:self-stretch">
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
                          className={TOOLTIP_TRIGGER_CLASS_DF}
                          aria-label="Admin fee info"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[220px]">
                        <p className="text-sm">
                          First payment (×1): Our insurer PremFina charges a £5 admin fee on this
                          instalment.
                        </p>
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

            {/* Mobile payment toggle – styled like sidebar, full-width below lg */}
            <div className="order-2 w-full lg:hidden">
              <div className="flex w-full items-center rounded-[999px] border border-input bg-muted/30 gap-0.5 px-1 py-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={
                    pricingMode === "annual" ? PAYMENT_ACTIVE_CLASS : PAYMENT_INACTIVE_CLASS
                  }
                  onClick={() => onPaymentOptionChange("annual")}
                >
                  Annual
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={
                    pricingMode === "monthly" ? PAYMENT_ACTIVE_CLASS : PAYMENT_INACTIVE_CLASS
                  }
                  onClick={() => onPaymentOptionChange("monthly")}
                >
                  Monthly
                </Button>
              </div>
            </div>

            {/* Total price block */}
            <div
              className={
                monthlyBreakdownInDropdown
                  ? "order-3 flex w-full flex-col items-center justify-center gap-1 self-stretch rounded-[12px] border border-neutral-200 bg-[#FAFAFA] p-3 text-center lg:order-3 lg:w-[134px] lg:min-w-[134px] lg:flex-none"
                  : "order-3 flex w-full flex-col items-center justify-center gap-1 self-stretch rounded-[12px] border border-neutral-200 bg-[#FAFAFA] p-3 text-center lg:order-3 lg:flex-1 lg:min-w-0"
              }
            >
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-[#1E1E1E]">
                  {pricingMode === "annual" ? "Total Annual" : "Total Monthly"}
                </span>
                <span className="text-[14px] font-medium text-[#1E1E1E]">Premium</span>
              </div>
              <span className="text-[16px] font-semibold text-[#1E1E1E]">
                {pricingMode === "annual"
                  ? formatPounds(displayedAnnualTotal)
                  : `${formatPounds(monthlyAmount)}/mo.`}
              </span>
            </div>
          </div>

          {pricingMode === "monthly" && monthlyBreakdownInDropdown && (
            <Collapsible className="group/breakdown w-full">
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-[12px] border border-neutral-200 bg-white px-4 py-3 text-left text-[14px] font-medium text-[#1E1E1E] shadow-sm hover:bg-neutral-50">
                <span>Monthly breakdown</span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/breakdown:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-visible">
                <div className="mt-3 w-full overflow-hidden rounded-b-[12px] rounded-t-[12px] border border-neutral-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 py-2">
                    <span className="text-[14px] font-medium text-[#1E1E1E]">Deposit</span>
                    <span className="text-[14px] font-semibold text-[#1E1E1E]">
                      {formatPounds(depositAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-100 px-4 py-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-medium text-[#1E1E1E]">× 1</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className={TOOLTIP_TRIGGER_CLASS_DF}
                            aria-label="Admin fee info"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[220px]">
                          <p className="text-sm">
                            First payment (×1): Our insurer PremFina charges a £5 admin fee on this
                            instalment.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-[14px] font-semibold text-[#1E1E1E]">
                      {formatPounds(x1Amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-b-[12px] bg-white px-4 py-2">
                    <span className="text-[14px] font-medium text-[#1E1E1E]">× 9</span>
                    <span className="text-[14px] font-semibold text-[#1E1E1E]">
                      {formatPounds(monthlyAmount)}
                    </span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </Card>
    </div>
  )
}


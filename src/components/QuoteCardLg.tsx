import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Quote } from "@/types/quote"
import { CheckSquare, HelpCircle, Info, ShoppingCart, Square } from "lucide-react"
import { useState } from "react"

const TOOLTIP_TRIGGER_CLASS =
  "inline-flex rounded text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

/**
 * QuoteCardLg — LOCKED LAYOUT
 * Horizontal layout (logo | cover columns | total | buttons) is fixed for viewport >= 1024px.
 * Tailwind breakpoint: `qc` in tailwind.config.js = 1024px. Do not change this breakpoint or
 * the structure of the large layout; responsive behavior below 1024px may be adjusted separately.
 */
interface QuoteCardLgProps {
  quote: Quote
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
  legalCover,
  homeEmergency,
  onLegalCoverChange,
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

  const [pricingMode, setPricingMode] = useState<"annual" | "monthly">("annual")

  const toDisplay = (value: number) =>
    pricingMode === "annual" ? value : Math.round(value / 12)

  const coverLabelClass =
    "mb-1 flex items-center gap-1.5 text-sm text-muted-foreground"
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

  return (
    <Card className="overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Stacked layout: 0–1023px (hidden from 1024px up) */}
      <div className={`flex flex-col gap-3 px-4 py-4 qc:hidden`}>
        {/* Header: logo + pricing toggle + insurer name */}
        <div className="flex items-center justify-between gap-3">
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
                setPricingMode(checked ? "monthly" : "annual")
              }
              aria-label="Toggle pricing mode"
            />
          </div>
        </div>

        <div className="mt-1 text-base font-semibold text-foreground">
          {quote.providerName}
        </div>

        {/* Core breakdown */}
        <div className="mt-2 flex flex-col">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Home insurance</span>
            <span className="text-sm font-medium text-foreground">
              £{toDisplay(quote.standardPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="text-sm text-muted-foreground">Host insurance</span>
            <span className="text-sm font-medium text-foreground">
              £{toDisplay(quote.piklPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">Excess</span>
            <span className="text-sm font-medium text-foreground">{quote.policyDetails.excess}</span>
          </div>
        </div>

        {/* Extras divider */}
        <div className="mt-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>Extras</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Home emergency toggle card */}
        <button
          type="button"
          onClick={() => onHomeEmergencyChange(!homeEmergency)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
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
            £{toDisplay(quote.homeEmergencyAddOnPrice)}
          </span>
        </button>

        {/* Legal cover toggle card */}
        <button
          type="button"
          onClick={() => onLegalCoverChange(!legalCover)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
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
            £{toDisplay(quote.familyLegalAddOnPrice)}
          </span>
        </button>

        {/* Total & actions */}
        <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-medium text-muted-foreground">Total price</span>
          <span className="text-lg font-semibold text-foreground">£{toDisplay(totalPrice)}</span>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            size="sm"
            className="w-full gap-1.5"
            onClick={() => onPurchase?.(quote)}
          >
            <ShoppingCart className="h-4 w-4 shrink-0" />
            Purchase
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5"
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
          <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 qc:flex qc:min-w-0 qc:h-[4.8rem] qc:flex-1 qc:flex-col qc:justify-center qc:rounded-none qc:border-0 qc:border-r qc:border-border qc:px-5 qc:py-3">
            <p className={coverLabelClass}>
              Home insurance
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
            </p>
            <p className={priceClass}>£{quote.standardPrice}</p>
          </div>

          {/* Host insurance */}
          <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 qc:flex qc:min-w-0 qc:h-[4.8rem] qc:flex-1 qc:flex-col qc:justify-center qc:rounded-none qc:border-0 qc:border-r qc:border-border qc:px-5 qc:py-3">
            <p className={coverLabelClass}>
              Host insurance
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
            </p>
            <p className={priceClass}>£{quote.piklPrice}</p>
          </div>

          {/* Legal cover */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 qc:flex qc:min-w-0 qc:h-[4.8rem] qc:flex-1 qc:flex-row qc:items-center qc:justify-between qc:gap-4 qc:rounded-none qc:border-0 qc:border-r qc:border-border qc:px-5 qc:py-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Legal cover</p>
              <p className={priceClass}>£{quote.familyLegalAddOnPrice}</p>
            </div>
            <Switch
              checked={legalCover}
              onCheckedChange={onLegalCoverChange}
              aria-label="Legal cover"
            />
          </div>

          {/* Home emergency */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 qc:flex qc:min-w-0 qc:h-[4.8rem] qc:flex-1 qc:flex-row qc:items-center qc:justify-between qc:gap-4 qc:rounded-none qc:border-0 qc:px-5 qc:py-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Home emergency</p>
              <p className={priceClass}>£{quote.homeEmergencyAddOnPrice}</p>
            </div>
            <Switch
              checked={homeEmergency}
              onCheckedChange={onHomeEmergencyChange}
              aria-label="Home emergency cover"
            />
          </div>
        </div>

        {/* Total price + CTAs — stacked on mobile, side-by-side on desktop */}
        <div className="mt-3 flex w-full flex-col gap-3 qc:mt-0 qc:w-auto qc:shrink-0 qc:flex-row qc:items-stretch qc:gap-4 qc:pl-5 qc:pr-5">
          {/* Total price column — 5.4rem tall on desktop */}
          <div className="flex h-auto flex-col items-center justify-center rounded-lg bg-neutral-100 px-3 text-center qc:h-[5.4rem]">
            <p className="text-sm text-muted-foreground">Total price</p>
            <p className="text-md font-semibold text-foreground">£{totalPrice}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Excess {quote.policyDetails.excess}</p>
          </div>

          {/* Action buttons column — stretches to match total height */}
          <div className="flex h-auto flex-col justify-between gap-2 qc:w-[8rem] qc:rounded-br-lg qc:py-0">
            <Button
              size="sm"
              className="w-full gap-1.5"
              onClick={() => onPurchase?.(quote)}
            >
              <ShoppingCart className="h-4 w-4 shrink-0" />
              Purchase
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => onMoreDetails(quote)}
            >
              <Info className="h-4 w-4 shrink-0" />
              More details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Quote } from "@/types/quote"
import { HelpCircle, Info, ShoppingCart } from "lucide-react"

const TOOLTIP_TRIGGER_CLASS =
  "inline-flex rounded text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

interface QuoteCardProps {
  quote: Quote
  legalCover: boolean
  onLegalCoverChange: (checked: boolean) => void
  onMoreDetails: (quote: Quote) => void
  onPurchase?: (quote: Quote) => void
  size?: "sm" | "md" | "lg"
}

export function QuoteCard({
  quote,
  legalCover,
  onLegalCoverChange,
  onMoreDetails,
  onPurchase,
  size = "lg",
}: QuoteCardProps) {
  const totalPrice =
    quote.standardPrice +
    quote.piklPrice +
    (legalCover ? quote.familyLegalAddOnPrice : 0)

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
      <div
        className={`flex flex-col gap-4 ${basePadding} qc:flex-row qc:items-stretch qc:gap-0 qc:px-0 qc:py-4`}
      >
        {/* Logo — same column padding and height as total/buttons on desktop */}
        <div className="flex shrink-0 items-start qc:flex qc:h-[4.8rem] qc:items-center qc:border-r qc:border-border qc:px-5">
          <div className="flex size-[4.8rem] items-center justify-center rounded-lg bg-neutral-100 p-2">
            <span className="text-sm font-bold text-muted-foreground">
              LOGO
            </span>
          </div>
        </div>

        {/* Middle: grid on mobile, horizontal row with equal-height dividers on desktop (Home emergency hidden) */}
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
              <p className="text-sm text-muted-foreground">Family legal protection</p>
              <p className={priceClass}>£{quote.familyLegalAddOnPrice}</p>
            </div>
            <Switch
              checked={legalCover}
              onCheckedChange={onLegalCoverChange}
              aria-label="Family legal protection"
            />
          </div>
        </div>

        {/* Total price + CTAs — stacked on mobile, side-by-side on desktop */}
        <div className="mt-3 flex w-full flex-col gap-3 qc:mt-0 qc:w-auto qc:shrink-0 qc:flex-row qc:items-stretch qc:gap-4 qc:pl-5 qc:pr-5">
          {/* Total price column — match divider/column height */}
          <div className="flex h-[5.4rem] flex-col items-center justify-center rounded-lg bg-neutral-100 px-3 text-center">
            <p className="text-sm text-muted-foreground">Total price</p>
            <p className="text-md font-semibold text-foreground">£{totalPrice}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Excess {quote.policyDetails.excess}</p>
          </div>

          {/* Action buttons column — match total price height on desktop */}
          <div className="flex h-auto flex-col justify-between gap-2 qc:h-[5.4rem] qc:w-[8rem] qc:rounded-br-lg qc:py-0">
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

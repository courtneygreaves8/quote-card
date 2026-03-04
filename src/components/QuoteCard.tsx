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
  homeEmergency: boolean
  onLegalCoverChange: (checked: boolean) => void
  onHomeEmergencyChange: (checked: boolean) => void
  onMoreDetails: (quote: Quote) => void
  onPurchase?: (quote: Quote) => void
}

export function QuoteCard({
  quote,
  legalCover,
  homeEmergency,
  onLegalCoverChange,
  onHomeEmergencyChange,
  onMoreDetails,
  onPurchase,
}: QuoteCardProps) {
  const totalPrice =
    quote.standardPrice +
    quote.piklPrice +
    (legalCover ? quote.familyLegalAddOnPrice : 0) +
    (homeEmergency ? quote.homeEmergencyAddOnPrice : 0)

  return (
    <Card className="overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 px-4 py-4 qc:flex-row qc:items-stretch qc:gap-0 qc:px-0">
        {/* Logo */}
        <div className="flex shrink-0 items-start qc:items-center qc:px-4">
          <div className="flex size-[4.8rem] items-center justify-center rounded-lg bg-neutral-100 p-2">
            <span className="text-sm font-bold text-muted-foreground">
              LOGO
            </span>
          </div>
        </div>

        {/* Middle: 2×2 grid of cover blocks */}
        <div className="mt-2 grid flex-1 gap-3 sm:grid-cols-2 qc:mt-0 qc:px-4">
          {/* Home insurance */}
          <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2">
            <p className="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
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
            <p className="text-base font-medium text-foreground">
              £{quote.standardPrice}
            </p>
          </div>

          {/* Host insurance */}
          <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2">
            <p className="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
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
            <p className="text-base font-medium text-foreground">
              £{quote.piklPrice}
            </p>
          </div>

          {/* Family legal add-on */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Legal cover</p>
              <p className="text-base font-medium text-foreground">
                £{quote.familyLegalAddOnPrice}
              </p>
            </div>
            <Switch
              checked={legalCover}
              onCheckedChange={onLegalCoverChange}
              aria-label="Legal cover"
            />
          </div>

          {/* Home emergency cover */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Home emergency</p>
              <p className="text-base font-medium text-foreground">
                £{quote.homeEmergencyAddOnPrice}
              </p>
            </div>
            <Switch
              checked={homeEmergency}
              onCheckedChange={onHomeEmergencyChange}
              aria-label="Home emergency cover"
            />
          </div>
        </div>

        {/* Right: total price + CTAs */}
        <div className="mt-3 flex w-full flex-col gap-3 qc:mt-0 qc:w-[11rem] qc:px-4">
          <div className="rounded-[8px] bg-neutral-100 px-4 py-2 text-center">
            <p className="text-sm text-muted-foreground">Total price</p>
            <p className="text-base font-semibold text-foreground">
              £{totalPrice}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Excess {quote.policyDetails.excess}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              className="w-full text-xs"
              onClick={() => onPurchase?.(quote)}
            >
              <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
              Purchase
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => onMoreDetails(quote)}
            >
              <Info className="h-3.5 w-3.5 shrink-0" />
              More details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

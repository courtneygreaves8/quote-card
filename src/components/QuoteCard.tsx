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
}

function ColumnDivider() {
  return (
    <div
      className="w-px shrink-0 self-stretch bg-neutral-200"
      aria-hidden
    />
  )
}

export function QuoteCard({
  quote,
  legalCover,
  homeEmergency,
  onLegalCoverChange,
  onHomeEmergencyChange,
  onMoreDetails,
}: QuoteCardProps) {
  const totalPrice =
    quote.standardPrice +
    quote.piklPrice +
    (legalCover ? quote.familyLegalAddOnPrice : 0) +
    (homeEmergency ? quote.homeEmergencyAddOnPrice : 0)

  return (
    <Card className="overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex min-h-[5rem] items-stretch justify-between gap-0 overflow-x-auto px-0 py-4">
        {/* Logo */}
        <div className="flex shrink-0 items-center px-4">
          <div className="flex size-[4.8rem] items-center justify-center rounded-lg bg-neutral-100 p-2">
            <span className="text-sm font-bold text-muted-foreground">
              LOGO
            </span>
          </div>
        </div>

        <ColumnDivider />

        {/* Standard cover price */}
        <div className="flex min-w-0 shrink flex-col justify-center px-4">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
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

        <ColumnDivider />

        {/* Pikl cover price */}
        <div className="flex min-w-0 shrink flex-col justify-center px-4">
          <p className="flex items-center align-top gap-1.5 text-sm text-muted-foreground">
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

        <ColumnDivider />

        {/* Family legal add-on */}
        <div className="flex min-w-0 shrink items-center gap-3 px-4">
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

        <ColumnDivider />

        {/* Home emergency cover */}
        <div className="flex min-w-0 shrink items-center gap-3 px-4">
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

        {/* Total price + excess */}
        <div className="flex min-w-0 shrink flex-col items-center justify-center rounded-[8px] bg-neutral-100 px-4 py-2 text-center">
          <p className="text-sm whitespace-nowrap text-muted-foreground">Total price</p>
          <p className="text-base font-semibold text-foreground">
            £{totalPrice}
          </p>
          <p className="mt-0.5 whitespace-nowrap text-xs text-muted-foreground">
            Excess {quote.policyDetails.excess}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex shrink-0 flex-col items-center gap-2 px-4">
          <Button size="sm" className="w-full text-xs">
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
    </Card>
  )
}

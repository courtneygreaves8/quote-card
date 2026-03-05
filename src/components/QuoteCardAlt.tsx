import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Quote } from "@/types/quote"
import type { PaymentOption } from "@/types/quote"
import { HelpCircle } from "lucide-react"

interface QuoteCardAltProps {
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

export function QuoteCardAlt({
  quote,
  paymentOption,
  onPaymentOptionChange,
  legalCover,
  homeEmergency,
  onLegalCoverChange,
  onHomeEmergencyChange,
  onMoreDetails,
  onPurchase,
}: QuoteCardAltProps) {
  const pricingMode = paymentOption

  const totalPriceRaw =
    quote.standardPrice +
    quote.piklPrice +
    (legalCover ? quote.familyLegalAddOnPrice : 0) +
    (homeEmergency ? quote.homeEmergencyAddOnPrice : 0)

  // Reuse the same monthly logic as QuoteCardLg
  const MONTHLY_DIVISOR = 11
  const monthlyAmount = totalPriceRaw / MONTHLY_DIVISOR

  const formatPounds = (n: number) => `£${n.toFixed(2)}`

  const x1Amount = monthlyAmount + 5
  const depositAmount = monthlyAmount + 20

  return (
    // Only show this alternative layout from 1339px+ (qc breakpoint and above)
    <div className="hidden qc:flex">
      <Card className="flex w-[1200px] flex-col items-start gap-6 rounded-[20px] border-none bg-white p-3">
        {/* Header */}
        <div className="flex w-full max-w-[1176px] items-center justify-between">
          {/* Logo + insurer name */}
          <div className="flex items-center gap-3">
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[10px] bg-[#D9D9D9]">
              <span className="text-xs font-semibold text-slate-600">LOGO</span>
            </div>
            <div className="text-[16px] font-medium text-[#1E1E1E]">
              {quote.providerName || "Insurer name"}
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-3">
            {/* Annual toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={pricingMode === "monthly"}
                onCheckedChange={(checked) =>
                  onPaymentOptionChange(checked ? "monthly" : "annual")
                }
                aria-label="Toggle annual or monthly"
              />
              <span className="text-[14px] font-medium leading-[14px] text-[#1E1E1E]">
                Annual
              </span>
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
        <div className="flex w-full items-stretch gap-6 rounded-[16px] border border-[#E2E8F0] bg-white p-3">
          {/* Home column */}
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
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
              {formatPounds(quote.standardPrice)}
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
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
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
              {formatPounds(quote.piklPrice)}
            </div>
            <div className="text-[14px] font-medium text-[#1E1E1E]">
              Excess: <span className="font-semibold">£50.00</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-auto w-px self-stretch bg-[#E2E8F0]" />

          {/* Family legal column */}
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap text-[14px] font-medium text-[#1E1E1E]">
                Family legal protection
              </span>
              <HelpCircle className="h-4 w-4 text-slate-500" aria-hidden />
            </div>
            <div className="text-[18px] font-semibold text-[#1E1E1E]">
              {formatPounds(quote.familyLegalAddOnPrice)}
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
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
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
              {formatPounds(quote.homeEmergencyAddOnPrice)}
            </div>
            <Switch
              checked={homeEmergency}
              onCheckedChange={onHomeEmergencyChange}
              aria-label="Home emergency cover"
            />
          </div>

          {/* Divider */}
          <div className="h-auto w-px self-stretch bg-[#E2E8F0]" />

          {/* Monthly breakdown */}
          <div className="flex w-[121px] min-w-[121px] flex-none flex-col items-stretch justify-between gap-3">
            {/* Monthly top row: Deposit */}
            <div className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] pb-2">
              <span className="text-[14px] font-medium text-[#1E1E1E]">Deposit:</span>
              <span className="text-[14px] font-semibold text-[#1E1E1E]">
                {formatPounds(depositAmount)}
              </span>
            </div>

            {/* Middle row: ×1 with tooltip */}
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

            {/* Bottom row: ×9 */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <span className="text-[14px] font-medium text-[#1E1E1E]">×9</span>
              <span className="text-[14px] font-semibold text-[#1E1E1E]">
                {formatPounds(monthlyAmount)}
              </span>
            </div>
          </div>

          {/* Total price block (no divider between monthly breakdown and price) */}
          <div className="flex h-[120px] w-[120px] flex-none flex-col items-center justify-center gap-4 rounded-[12px] border border-[#E2E8F0] bg-white p-2 text-center">
            <div className="text-[14px] font-medium text-[#1E1E1E]">Total price</div>
            <div className="text-[14px] font-semibold text-[#1E1E1E]">
              {pricingMode === "annual"
                ? formatPounds(totalPriceRaw)
                : formatPounds(monthlyAmount)}
            </div>
            {pricingMode === "monthly" && (
              <div className="text-[14px] font-medium text-[#1E1E1E]">
                {formatPounds(monthlyAmount)}
                <span className="text-xs font-normal">/mo.</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}


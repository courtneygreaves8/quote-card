import {
  AlertCircle,
  Building2,
  Check,
  ChevronDown,
  Copy,
  Download,
  Lock,
  Mail,
  Save,
  Shield,
  X,
} from "lucide-react"
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { COMPULSORY_EXCESS } from "@/lib/constants"
import { cn, parseExcessNum } from "@/lib/utils"
import { PolicyDetails as PolicyDetailsType, Quote } from "@/types/quote"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const MOCK_PROPERTY_ADDRESS = "123 Example Street, London, SW1A 1AA"
const MOCK_PROPOSER_NAME = "John Smith"

const POLICY_INCLUDES_LIST: { title: string; description: string }[] = [
  { title: "Buildings", description: "£1,000,000" },
  {
    title: "Fire, smoke, explosion, storm, flood, lightning or earthquake",
    description:
      "Loss or damage caused by fire, smoke, explosion, storm, flood, lightning or earthquake.",
  },
  {
    title: "Escape of water or oil",
    description: "Loss or damage caused by escape of water, or oil.",
  },
  {
    title: "Malicious acts, theft or attempted theft",
    description:
      "Loss or damage caused by malicious acts, theft or attempted theft.",
  },
  {
    title: "Collision by aircraft, road or rail vehicles, or animals",
    description:
      "Loss or damage caused by collision by an aircraft, road or rail vehicle, or animal.",
  },
  {
    title: "Subsidence, Ground Heave or Landslip",
    description:
      "Loss or damaged caused by subsidence, ground heave or landslip.",
  },
  {
    title: "Falling trees, collapse of aerials or satellite dishes.",
    description:
      "Loss or damage caused by falling trees, collapse of aerials or satellite dishes.",
  },
  {
    title: "Keys and Locks",
    description:
      "Cost of replacement keys and/or locks after the keys are lost or stolen.",
  },
  {
    title: "Alternative accommodation",
    description:
      "Up to £200,000 for alternative accommodation, or loss of rent following a claim under the policy.",
  },
  {
    title: "Trace and Access",
    description:
      "Up to £10,000 for trace and access costs to source the cause of damage to your property.",
  },
  {
    title: "Property Owner Liability",
    description:
      "Cover for legal liabilities for compensation for injury, illness or death of another person.",
  },
  {
    title: "Accidental Damage to cables and drains",
    description:
      "Accidental damage to cables, drain inspection covers and underground drains, pipes or tanks providing services to or from the home and for which you are responsible.",
  },
  {
    title: "Accidental Damage to fixed glass",
    description:
      "Accidental breakage of fixed glass in windows, fixed ceramic hobs and fixed sanitary ware and bathroom fittings.",
  },
]

interface PolicySheetProps {
  quote: Quote | null
  quoteReference: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchase?: () => void
}

function SheetSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left max-[767px]:py-2"
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="pb-4 pt-0 max-[767px]:pb-3">
          {children}
        </div>
      )}
    </div>
  )
}

function ExcessTable({
  policyDetails,
}: {
  policyDetails: PolicyDetailsType
}) {
  const total = parseExcessNum(policyDetails.excess)
  const voluntary = Math.max(0, total - COMPULSORY_EXCESS)
  const displayTotal = COMPULSORY_EXCESS + voluntary

  return (
    <div className="space-y-0 text-sm">
      <div className="flex justify-between gap-4 border-b border-border py-3">
        <span className="text-muted-foreground">Compulsory excess</span>
        <span className="font-medium text-foreground">£{COMPULSORY_EXCESS}.00</span>
      </div>
      <div className="flex justify-between gap-4 border-b border-border py-3">
        <span className="text-muted-foreground">Voluntary excess</span>
        <span className="font-medium text-foreground">£{voluntary}.00</span>
      </div>
      <div className="flex justify-between gap-4 py-3">
        <span className="font-medium text-foreground">Total excess</span>
        <span className="font-medium text-foreground">£{displayTotal}.00</span>
      </div>
    </div>
  )
}

export function PolicySheetRight({
  policyDetails,
  propertyAddress,
  proposerName,
  providerName,
}: {
  policyDetails: PolicyDetailsType
  propertyAddress: string
  proposerName: string
  providerName: string
}) {
  const [openOverview, setOpenOverview] = useState(false)
  const [openIncluded, setOpenIncluded] = useState(false)
  const [openExcluded, setOpenExcluded] = useState(false)
  const [openFees, setOpenFees] = useState(false)
  const [openExcess, setOpenExcess] = useState(false)
  const [openEndorsements, setOpenEndorsements] = useState(false)
  const [openDocuments, setOpenDocuments] = useState(false)
  const [openAboutInsurer, setOpenAboutInsurer] = useState(false)

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto p-6 pt-[5.5rem] max-[767px]:pt-4">
      <SheetSection
        title="Overview"
        open={openOverview}
        onToggle={() => setOpenOverview((v) => !v)}
      >
        <div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between gap-4 border-b border-border pb-2">
              <span className="text-muted-foreground">Property address</span>
              <span className="text-right font-medium text-foreground">
                {propertyAddress}
              </span>
            </li>
            <li className="flex justify-between gap-4 border-b border-border pb-2">
              <span className="text-muted-foreground">Policyholder name</span>
              <span className="text-right font-medium text-foreground">
                {proposerName}
              </span>
            </li>
            <li className="flex justify-between gap-4 pb-2">
              <span className="text-muted-foreground">Cover type</span>
              <span className="text-right font-medium text-foreground">
                {policyDetails.policyType}
              </span>
            </li>
          </ul>
        </div>
      </SheetSection>

      <SheetSection
        title="What's included"
        open={openIncluded}
        onToggle={() => setOpenIncluded((v) => !v)}
      >
        <p className="mb-3 text-sm font-medium text-foreground">
          Policy includes:
        </p>
        <ul className="space-y-2 text-sm">
          {POLICY_INCLUDES_LIST.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-[8px] px-3 py-2 transition-colors hover:bg-neutral-50"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-0.5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </SheetSection>

      <SheetSection
        title="What's not included"
        open={openExcluded}
        onToggle={() => setOpenExcluded((v) => !v)}
      >
        <ul className="space-y-2 text-sm">
          {policyDetails.exclusions.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground">
              <X className="mt-0.5 h-4 w-4 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </SheetSection>

      <SheetSection
        title="Fees"
        open={openFees}
        onToggle={() => setOpenFees((v) => !v)}
      >
        <p className="text-sm text-muted-foreground">
          No additional fees apply to this policy. Your premium includes all
          standard administration and policy fees.
        </p>
      </SheetSection>

      <SheetSection
        title="Excess"
        open={openExcess}
        onToggle={() => setOpenExcess((v) => !v)}
      >
        <p className="mb-4 text-sm text-muted-foreground">
          The total excess is comprised of two parts — a compulsory excess set by
          the insurer, and a voluntary excess which you agree to pay towards a
          claim in addition to the compulsory excess.
        </p>
        <ExcessTable policyDetails={policyDetails} />
      </SheetSection>

      <SheetSection
        title="Endorsements"
        open={openEndorsements}
        onToggle={() => setOpenEndorsements((v) => !v)}
      >
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Guest Property Coverage
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Loss of Rental Income
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Increased Liability
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Short-term Rental Liability
          </Button>
        </div>
      </SheetSection>

      <SheetSection
        title="Documents"
        open={openDocuments}
        onToggle={() => setOpenDocuments((v) => !v)}
      >
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Policy document
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Policy summary
          </Button>
        </div>
      </SheetSection>

      <SheetSection
        title="About the insurer"
        open={openAboutInsurer}
        onToggle={() => setOpenAboutInsurer((v) => !v)}
      >
        <Card className="overflow-hidden rounded-[8px] border border-border">
          <CardContent className="p-4">
            <span
              className="mb-2 inline-flex items-center justify-center rounded-md border border-border bg-muted p-1.5 text-muted-foreground"
              aria-hidden
            >
              <Building2 className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm text-muted-foreground">
              {providerName} is a regulated insurance provider. This policy is
              underwritten in accordance with UK insurance regulations. For
              questions about your cover or to make a claim, contact the insurer
              using the details in your policy documents.
            </p>
          </CardContent>
        </Card>
      </SheetSection>
    </div>
  )
}

export function PolicySheet({
  quote,
  quoteReference,
  open,
  onOpenChange,
  onPurchase,
}: PolicySheetProps) {
  const [showStickyBar, setShowStickyBar] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const handleCopyRef = useCallback(() => {
    navigator.clipboard.writeText(quoteReference)
  }, [quoteReference])

  const handleEmailQuote = useCallback(() => {
    const subject = encodeURIComponent(`Insurance quote: ${quoteReference}`)
    const body = encodeURIComponent(
      `Quote reference: ${quoteReference}\n\nI'd like to share this quote with you.`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }, [quoteReference])

  useEffect(() => {
    if (!open) return

    let container: HTMLDivElement | null = null
    const handleScroll = () => {
      if (!container) return
      const shouldShow = container.scrollTop > 120
      setShowStickyBar(shouldShow)
    }

    const frameId = requestAnimationFrame(() => {
      container = scrollRef.current
      if (!container) return
      handleScroll()
      container.addEventListener("scroll", handleScroll)
    })

    return () => {
      cancelAnimationFrame(frameId)
      const el = scrollRef.current
      if (el) el.removeEventListener("scroll", handleScroll)
    }
  }, [open])

  if (!quote) return null

  const { policyDetails, providerName } = quote
  const monthlyPrice = quote.piklPrice
  const annualPrice = monthlyPrice * 12
  const deposit = monthlyPrice
  const instalment = monthlyPrice

  const handlePrimaryAction = () => {
    onPurchase?.()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-none flex-col bg-white p-0 sm:max-w-3xl"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{providerName} – Policy details</SheetTitle>
        </SheetHeader>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-4 z-10 border-border"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>

        <div
          ref={scrollRef}
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto max-[767px]:gap-0 md:flex-row md:overflow-auto md:gap-0"
        >
          {/* Mobile sticky price + primary CTA + close button when scrolling */}
          <div
            className={cn(
              "sticky top-0 z-20 -mt-px border-b border-border bg-white/95 px-4 py-2 backdrop-blur md:hidden",
              "transition-[transform,opacity] duration-200 ease-out",
              showStickyBar
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0 pointer-events-none"
            )}
          >
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 border-border"
                onClick={() => onOpenChange(false)}
                aria-label="Close policy details"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex flex-1 flex-wrap items-center justify-start gap-1.5 pl-1 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-muted px-2 py-1.5 text-xs">
                  <Shield className="h-3.5 w-3.5 shrink-0 text-muted-foreground max-[767px]:hidden" aria-hidden />
                  <span className="font-semibold tabular-nums text-foreground">
                    £{annualPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">Annual</span>
                </span>
                <span className="text-muted-foreground">or</span>
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-muted px-2 py-1.5 text-xs">
                  <Shield className="h-3.5 w-3.5 shrink-0 text-muted-foreground max-[767px]:hidden" aria-hidden />
                  <span className="font-semibold tabular-nums text-foreground">
                    £{monthlyPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">/mo.</span>
                </span>
              </div>
              <Button
                className="h-9 shrink-0 whitespace-nowrap px-3 text-xs"
                onClick={handlePrimaryAction}
              >
                Purchase
              </Button>
            </div>
          </div>

          {/* Left: pricing column – stacks on top for small screens, fixed 1/3 width on md+ */}
          <div className="flex w-full shrink-0 flex-col border-b border-border bg-white px-7 py-6 max-[767px]:px-5 max-[767px]:pt-4 max-[767px]:pb-0 max-[767px]:border-b-0 md:w-1/3 md:border-b-0 md:border-r md:pb-6">
            <div className="flex flex-col items-center text-center">
              <span
                className="mb-2 inline-flex items-center justify-center rounded-md border border-border bg-muted p-1.5 text-muted-foreground max-[767px]:p-2"
                aria-hidden
              >
                <Building2 className="h-3.5 w-3.5 max-[767px]:h-4 max-[767px]:w-4" />
              </span>
              <p className="text-sm font-medium text-foreground max-[767px]:text-base max-[767px]:font-semibold">
                {providerName}
              </p>
            </div>

            <div className="mt-[22px] flex flex-col items-center max-[767px]:mt-[14px]">
              <p className="text-sm text-muted-foreground">Pay annually</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                £{annualPrice.toFixed(2)}
              </p>
            </div>

            <div className="mt-[22px] flex flex-col max-[767px]:mt-[14px]">
              <p className="mb-[10px] text-sm text-muted-foreground">
                Or pay monthly
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Deposit</span>
                  <span className="tabular-nums">£{deposit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>11 x</span>
                  <span className="tabular-nums">£{instalment.toFixed(2)}</span>
                </div>
                <div className="my-1 border-t border-border" />
                <div className="flex justify-between text-sm font-semibold text-foreground">
                  <span>Total</span>
                  <span className="tabular-nums">£{annualPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-[18px] flex flex-col gap-2 rounded-lg border border-border bg-muted/50 px-3 py-3 max-[767px]:mt-[10px]">
              <AlertCircle className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <p className="text-sm text-muted-foreground">
                Your quote will be saved for the next 1 day. After that, you&apos;ll
                need to refresh your results to get the latest price.
              </p>
            </div>

            <Button
              className="mt-[22px] w-full max-[767px]:mt-[14px]"
              onClick={handlePrimaryAction}
            >
              Purchase
            </Button>

            <Separator className="my-[22px] max-[767px]:my-[14px]" />

            <div className="flex flex-col gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5"
                    onClick={handleEmailQuote}
                  >
                    <Mail className="h-4 w-4" />
                    Email quote
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Send this quote by email
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full gap-1.5">
                    <Save className="h-4 w-4" />
                    Save quote
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Save this quote for later
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="mt-[22px] flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 max-[767px]:mt-[14px]">
              <span className="flex-1 truncate font-mono text-sm">
                {quoteReference}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={handleCopyRef}
                    aria-label="Copy quote reference"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Copy quote reference to clipboard
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="mt-[18px] max-[767px]:mt-[10px] flex flex-col gap-2 rounded-md border border-border bg-neutral-50 p-3">
              <div className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-[11px] font-semibold tracking-wide text-neutral-900 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
                <Lock className="h-3 w-3 text-neutral-800" aria-hidden />
                <span>256-bit SSL</span>
              </div>
              <div className="mt-2 flex w-full flex-nowrap items-center gap-1.5">
                <span className="inline-flex min-h-[28px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-md bg-white px-1.5 py-1 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
                  <img src="/assets/mastercard.png" alt="Mastercard" className="h-4 w-auto max-w-full object-contain" />
                </span>
                <span className="inline-flex min-h-[28px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-md bg-white px-1.5 py-1 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
                  <img src="/assets/visa.png" alt="Visa" className="h-4 w-auto max-w-full object-contain" />
                </span>
                <span className="inline-flex min-h-[28px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-md bg-white px-1.5 py-1 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
                  <img src="/assets/applepay.png" alt="Apple Pay" className="h-4 w-auto max-w-full object-contain" />
                </span>
                <span className="inline-flex min-h-[28px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-md bg-white px-1.5 py-1 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
                  <img src="/assets/googlepay.png" alt="Google Pay" className="h-4 w-auto max-w-full object-contain" />
                </span>
              </div>
              <div className="mt-1 flex w-full items-center justify-between text-[11px] text-muted-foreground">
                <span>Powered by:</span>
                <img src="/assets/stripe.png" alt="Stripe" className="h-4 w-auto object-contain" />
              </div>
            </div>
          </div>

          {/* Right: details – full width on small screens, 2/3 on md+; scrolls only on md+ */}
          <div className="w-full min-h-0 md:flex-1 md:overflow-y-auto md:w-2/3">
            <PolicySheetRight
              policyDetails={policyDetails}
              propertyAddress={MOCK_PROPERTY_ADDRESS}
              proposerName={MOCK_PROPOSER_NAME}
              providerName={providerName}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

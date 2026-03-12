import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ResponsiveTooltip } from "@/components/ResponsiveTooltip"
import {
  COVER_TYPES,
  EXCESS_BTN_CLASS,
  EXCESS_OPTIONS,
  LAYOUT_PADDING_X,
  PAYMENT_ACTIVE_CLASS,
  PAYMENT_INACTIVE_CLASS,
} from "@/lib/constants"
import { QuoteFilters as QuoteFiltersType } from "@/types/quote"
import { Calendar, Copy, Mail, Minus, Pencil, Plus, X } from "lucide-react"
import { useCallback, useRef } from "react"

const SIDEBAR_ICON_BTN_CLASS = "h-8 w-8 shrink-0"
const ADDON_ROW_CLASS = "flex items-center justify-between gap-4"
const ADDON_LABEL_CLASS = "font-normal text-muted-foreground"
const COVER_DATE_INPUT_CLASS =
  "flex h-full flex-1 rounded-md border-0 bg-transparent py-2.5 pl-3.5 pr-2 text-sm text-foreground placeholder:text-neutral-400 transition-colors [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/25 focus-visible:ring-offset-2 focus-visible:bg-white [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer"

interface QuoteSidebarProps {
  quoteReference: string
  filters: QuoteFiltersType
  onFiltersChange: (f: QuoteFiltersType) => void
  onEditAnswers: () => void
  isSheet?: boolean
  onCloseSheet?: () => void
}

export function QuoteSidebar({
  quoteReference,
  filters,
  onFiltersChange,
  onEditAnswers,
  isSheet = false,
  onCloseSheet,
}: QuoteSidebarProps) {
  const excessIndex = EXCESS_OPTIONS.indexOf(filters.excess)
  const safeExcessIndex = excessIndex >= 0 ? excessIndex : 0

  const handleCopyRef = useCallback(() => {
    navigator.clipboard.writeText(quoteReference)
  }, [quoteReference])

  const handleEmailRef = useCallback(() => {
    const subject = encodeURIComponent(`Quote reference: ${quoteReference}`)
    const body = encodeURIComponent(
      `Please find my quote reference below:\n\n${quoteReference}`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }, [quoteReference])

  const dateInputRef = useRef<HTMLInputElement>(null)
  const handleOpenDatePicker = useCallback(() => {
    dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()
  }, [])

  const containerClass = [
    "flex min-h-0 shrink-0 flex-col gap-4 overflow-y-auto bg-white py-6",
    isSheet ? "w-full" : "w-80 border-r border-border",
    LAYOUT_PADDING_X,
  ].join(" ")

  return (
    <aside className={containerClass}>
      {isSheet && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-md font-semibold text-foreground">
            You can adjust your quote below.
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border"
            onClick={onCloseSheet}
            aria-label="Close options"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <Button
        variant="outline"
        className="h-10 w-full justify-center gap-2 px-4 py-2"
        onClick={onEditAnswers}
      >
        <Pencil className="h-4 w-4" />
        Edit answers
      </Button>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-semibold tracking-wide text-[#1E1E1E]">
          Quote reference
        </Label>
        <div className="flex items-center gap-2">
          <div className="flex h-10 min-w-0 flex-1 items-center rounded-lg border border-input bg-muted/30 pl-3.5 pr-3.5">
            <span className="truncate font-mono text-sm font-medium">
              {quoteReference}
            </span>
          </div>
          <ResponsiveTooltip
            side="right"
            content="Copy quote reference to clipboard"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={EXCESS_BTN_CLASS}
              onClick={handleCopyRef}
              aria-label="Copy quote reference"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </ResponsiveTooltip>
          <ResponsiveTooltip
            side="right"
            content="Email this quote reference to someone"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={EXCESS_BTN_CLASS}
              onClick={handleEmailRef}
              aria-label="Email quote reference"
            >
              <Mail className="h-4 w-4" />
            </Button>
          </ResponsiveTooltip>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label
          htmlFor="cover-start-date"
          className="text-sm font-semibold tracking-wide text-[#1E1E1E]"
        >
          Cover start date
        </Label>
        <div className="relative flex h-10 w-full items-center rounded-lg border border-neutral-200 bg-neutral-50/80 pr-1">
          <input
            ref={dateInputRef}
            id="cover-start-date"
            type="date"
            value={filters.coverStartDate}
            onChange={(e) =>
              onFiltersChange({ ...filters, coverStartDate: e.target.value })
            }
            className={COVER_DATE_INPUT_CLASS}
          />
          <ResponsiveTooltip
            side="right"
            content="Change when your cover begins."
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={SIDEBAR_ICON_BTN_CLASS}
              onClick={handleOpenDatePicker}
              aria-label="Open calendar"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </ResponsiveTooltip>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-semibold tracking-wide text-[#1E1E1E]">
          Cover type
        </Label>
        <Select
          value={filters.policyType}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, policyType: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select cover type" />
          </SelectTrigger>
          <SelectContent>
            {COVER_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Excess moved above add-ons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Excess</Label>
          <span className="text-sm font-medium text-muted-foreground">
            {filters.excess}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ResponsiveTooltip side="right" content="Decrease excess">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={EXCESS_BTN_CLASS}
              disabled={safeExcessIndex <= 0}
              onClick={() => {
                if (safeExcessIndex > 0) {
                  onFiltersChange({
                    ...filters,
                    excess: EXCESS_OPTIONS[safeExcessIndex - 1],
                  })
                }
              }}
              aria-label="Decrease excess"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </ResponsiveTooltip>
          <Slider
            className="min-w-0 flex-1"
            min={0}
            max={20}
            step={1}
            value={[safeExcessIndex]}
            onValueChange={([v]) =>
              onFiltersChange({ ...filters, excess: EXCESS_OPTIONS[v ?? 0] })
            }
          />
          <ResponsiveTooltip side="right" content="Increase excess">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={EXCESS_BTN_CLASS}
              disabled={safeExcessIndex >= 20}
              onClick={() => {
                if (safeExcessIndex < 20) {
                  onFiltersChange({
                    ...filters,
                    excess: EXCESS_OPTIONS[safeExcessIndex + 1],
                  })
                }
              }}
              aria-label="Increase excess"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </ResponsiveTooltip>
        </div>
      </div>

      <Separator />

      {/* Add-ons now follow excess */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold tracking-wide text-[#1E1E1E]">
          Add-ons
        </Label>
        <div className="space-y-5">
          <div className={ADDON_ROW_CLASS}>
            <Label htmlFor="buildings-accidental" className={ADDON_LABEL_CLASS}>
              Accidental Damage (Buildings)
            </Label>
            <Switch
              id="buildings-accidental"
              checked={filters.buildingsAccidentalDamage}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, buildingsAccidentalDamage: checked })
              }
            />
          </div>
          <div className={ADDON_ROW_CLASS}>
            <Label htmlFor="contents-accidental" className={ADDON_LABEL_CLASS}>
              Accidental Damage (Contents)
            </Label>
            <Switch
              id="contents-accidental"
              checked={filters.contentsAccidentalDamage}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, contentsAccidentalDamage: checked })
              }
            />
          </div>
          <div className={ADDON_ROW_CLASS}>
            <Label htmlFor="home-emergency" className={ADDON_LABEL_CLASS}>
              Home Emergency Cover
            </Label>
            <Switch
              id="home-emergency"
              checked={filters.homeEmergency}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, homeEmergency: checked })
              }
            />
          </div>
          <div className={ADDON_ROW_CLASS}>
            <Label htmlFor="legal-cover" className={ADDON_LABEL_CLASS}>
              Family Legal Protection
            </Label>
            <Switch
              id="legal-cover"
              checked={filters.legalCover}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, legalCover: checked })
              }
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-semibold tracking-wide text-[#1E1E1E]">
          Payment
        </Label>
        <div className="flex w-full items-center rounded-full border border-input bg-muted/30 gap-1 px-1 py-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={
              filters.paymentOption === "annual"
                ? PAYMENT_ACTIVE_CLASS
                : PAYMENT_INACTIVE_CLASS
            }
            onClick={() =>
              onFiltersChange({ ...filters, paymentOption: "annual" })
            }
          >
            Annual
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={
              filters.paymentOption === "monthly"
                ? PAYMENT_ACTIVE_CLASS
                : PAYMENT_INACTIVE_CLASS
            }
            onClick={() =>
              onFiltersChange({ ...filters, paymentOption: "monthly" })
            }
          >
            Monthly
          </Button>
        </div>
        {filters.paymentOption === "monthly" && (
          <div className="mt-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
            <div className="flex flex-col gap-1">
              <p>
                Paying monthly is usually a little more expensive as you'll pay interest.
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex w-fit items-center justify-start text-xs font-semibold text-[#1D4ED8] underline-offset-2 hover:underline"
                  >
                    Find out more
                  </button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Paying monthly vs annually</SheetTitle>
                    <SheetDescription>
                      When you spread your payments over the year, the insurer usually adds
                      interest or a credit charge. This means the total you pay across 12
                      instalments is often higher than if you pay the full annual premium
                      upfront.
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        )}
      </div>

      {isSheet && (
        <div className="mt-4 mb-3 block card3:hidden">
          <Button
            className="h-10 w-full justify-center gap-2"
            onClick={onCloseSheet}
          >
            Apply changes
          </Button>
        </div>
      )}
    </aside>
  )
}

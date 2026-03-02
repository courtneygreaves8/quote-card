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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { QuoteFilters as QuoteFiltersType } from "@/types/quote"
import { Calendar, Copy, Mail, Minus, Pencil, Plus } from "lucide-react"
import { useCallback, useRef } from "react"

const COVER_TYPES = [
  "Buildings only",
  "Contents only",
  "Buildings & Contents",
]

const EXCESS_OPTIONS = Array.from(
  { length: 21 },
  (_, i) => (i === 20 ? "£1,000" : `£${i * 50}`)
)

interface QuoteSidebarProps {
  quoteReference: string
  filters: QuoteFiltersType
  onFiltersChange: (f: QuoteFiltersType) => void
  onEditAnswers: () => void
}

export function QuoteSidebar({
  quoteReference,
  filters,
  onFiltersChange,
  onEditAnswers,
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

  return (
    <aside className="flex w-[380px] shrink-0 flex-col gap-4 border-r border-border bg-white p-6">
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-center gap-2"
        onClick={onEditAnswers}
      >
        <Pencil className="h-4 w-4" />
        Edit answers
      </Button>

      <Separator />

      <div className="space-y-2">
        <Label className="text-muted-foreground">Quote reference</Label>
        <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-input bg-muted/30 pl-3.5 pr-1">
          <span className="flex-1 truncate font-mono text-sm font-medium">
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleEmailRef}
                aria-label="Email quote reference"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Email this quote reference to someone
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="cover-start-date" className="text-muted-foreground font-normal">
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
            className="flex h-full flex-1 rounded-md border-0 bg-transparent py-2.5 pl-3.5 pr-2 text-sm text-foreground placeholder:text-neutral-400 transition-colors [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE2A7B]/25 focus-visible:ring-offset-2 focus-visible:bg-white [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleOpenDatePicker}
                aria-label="Open calendar"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Change when your cover begins.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Cover type</Label>
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

      <div className="space-y-4">
        <Label>Add-ons</Label>
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="home-emergency" className="font-normal text-muted-foreground">
              Home emergency
            </Label>
            <Switch
              id="home-emergency"
              checked={filters.homeEmergency}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, homeEmergency: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between gap-4 pl-2">
            <Label htmlFor="buildings-accidental" className="font-normal text-muted-foreground text-sm">
              Buildings accidental damage
            </Label>
            <Switch
              id="buildings-accidental"
              checked={filters.buildingsAccidentalDamage}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, buildingsAccidentalDamage: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="legal-cover" className="font-normal text-muted-foreground">
              Legal cover
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
        <div className="flex items-center justify-between">
          <Label>Excess</Label>
          <span className="text-sm font-medium text-muted-foreground">
            {filters.excess}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 shrink-0 rounded-md border-neutral-200 p-0"
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
            </TooltipTrigger>
            <TooltipContent side="right">Decrease excess</TooltipContent>
          </Tooltip>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 shrink-0 rounded-md border-neutral-200 p-0"
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
            </TooltipTrigger>
            <TooltipContent side="right">Increase excess</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Payment</Label>
        <div className="flex h-10 w-full items-center rounded-[8px] border border-input bg-muted/30 p-0.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={
              filters.paymentOption === "monthly"
                ? "flex-1 rounded-[8px] bg-gradient-to-r from-[#EE2A7B] to-[#C91F6A] text-white hover:opacity-90 hover:bg-gradient-to-r hover:from-[#EE2A7B] hover:to-[#C91F6A] hover:text-white"
                : "flex-1 rounded-[8px] hover:bg-neutral-200"
            }
            onClick={() =>
              onFiltersChange({ ...filters, paymentOption: "monthly" })
            }
          >
            Monthly
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={
              filters.paymentOption === "annual"
                ? "flex-1 rounded-[8px] bg-gradient-to-r from-[#EE2A7B] to-[#C91F6A] text-white hover:opacity-90 hover:bg-gradient-to-r hover:from-[#EE2A7B] hover:to-[#C91F6A] hover:text-white"
                : "flex-1 rounded-[8px] hover:bg-neutral-200"
            }
            onClick={() =>
              onFiltersChange({ ...filters, paymentOption: "annual" })
            }
          >
            Annual
          </Button>
        </div>
      </div>
    </aside>
  )
}

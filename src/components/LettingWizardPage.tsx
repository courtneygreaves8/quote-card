import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { ArrowLeft, ArrowRight, CalendarDays, Check, Image as ImageIcon, Info, LogIn, Mailbox, Menu, ShieldCheck, ShieldPlus, UserPlus } from "lucide-react"

import { CreateAccountModal } from "@/components/CreateAccountModal"
import { HelpFloatingButton } from "@/components/HelpFloatingButton"
import { LoginModal } from "@/components/LoginModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type LettingFormValues = {
  propertyToInsure?: "primary" | "second" | "investment"
  shortTermBasis?: "yes" | "no"
  activity?: "letting" | "swapping"
  sharing?: "single-bedroom" | "entire-property" | "annex" | "none"

  title?: "mr" | "mrs" | "miss" | "ms" | "mx" | "dr"
  firstName?: string
  lastName?: string
  email?: string
  mobileCountry?: string
  mobile?: string
  landlineCountry?: string
  landline?: string
  dobDay?: string
  dobMonth?: string
  dobYear?: string
  maritalStatus?:
    | "divorced"
    | "married"
    | "married-common-law"
    | "widowed"
    | "partnered-civil"
    | "separated"
    | "single"
    | "partnered"
  marketingOptIn?: "yes" | "no"
  postcode?: string
  employmentStatus?: "employed" | "self-employed" | "retired" | "other"
  mainOccupation?: string
  businessType?: string
  workPattern?: "full-time" | "part-time"
  hasAdditionalOccupation?: "yes" | "no"
  additionalOccupation?: string
  additionalOccupationBusinessType?: string
  expectedAdults?: string
  claimsLast5Years?: "yes" | "no"
  claimType?: string
  claimSettled?: "yes" | "no"
  additionalPolicyholders?: "yes" | "no"

  // Step 3: products
  selectedProduct?: "all-in-one" | "top-up"
  shortTermLettingDays?: "more-than-90" | "90-or-fewer" | "30-or-fewer"

  // Step 4: assumptions
  assumptionUkResident?: boolean
  assumptionPropertyOwnerResponsibility?: boolean
  assumptionSixMonthAst?: boolean
  assumptionNoCancelledInsurance?: boolean
  assumptionNoBankruptcy?: boolean
  assumptionNoExcessClaims?: boolean
  assumptionNoCriminalOffences?: boolean
  assumptionPropertyGoodRepair?: boolean
  assumptionNoThatchedRoof?: boolean
  assumptionNoFlooding?: boolean
  assumptionNoSubsidenceHeaveLandslip?: boolean
  assumptionLessThan20People?: boolean
  assumptionCompliesWithLocalAuthority?: boolean
  assumptionPermissionToAccessHistory?: boolean
  assumptionNoFalseStatements?: boolean

  // Step 5: property details
  propertyType?: "flat" | "house" | "townhouse" | "bungalow" | "other"
  propertyDescription?: string
  propertyListed?: "yes" | "no"
  propertyFirePrecautions?: string[]
  propertyUnoccupied?: "never" | "up-to-30" | "up-to-60" | "over-60"
  propertyOwnLockableFinalDoors?: "yes" | "no"
  propertyApprovedLocksFinalDoors?: "yes" | "no"
  propertyHasPatioOrFrenchDoors?: "yes" | "no"
  propertyPatioOrFrenchDoorsApprovedLocks?: "yes" | "no"
  propertyHasKeyOperatedWindowLocks?: "yes" | "no"
  propertyHasIntruderAlarm?: "yes" | "no"
  propertyIntruderAlarmType?:
    | "audible-only"
    | "bt-abc"
    | "bt-redcare"
    | "central-station-direct-line"
    | "nacoss-ssaib"
    | "packnet"
    | "not-covered"
  propertyBedrooms?: string
  propertyBathrooms?: string
  propertyTotalRooms?: string
  propertyFloors?: string
  propertyYearBuilt?: string
  propertyRoofMaterial?: "tile" | "slate" | "concrete" | "other"
  propertyRoofFlatPercentage?:
    | "0"
    | "10"
    | "20"
    | "30"
    | "40"
    | "50"
    | "60"
    | "70"
    | "80"
    | "90"
    | "100"
  propertyWallMaterial?: "brick" | "stone" | "concrete" | "other"
  propertyOccupiedNightHours?: "yes" | "no"

  // Step 6: cover
  coverStartDate?: string
  coverType?: "buildings" | "contents" | "buildings-contents"
  buildingsRebuildBand?: "163000" | "292000" | "500000" | "custom"
  buildingsCustomAmount?: string
  buildingsAccidentalDamage?: "yes-add" | "decide-later"
  buildingsYearsInsured?: string
  buildingsNoClaimsDiscount?: string
  contentsItemsOver1500?: "yes" | "no"
  contentsItemCategory?: string
  contentsItemDescription?: string
  contentsItemValue?: string
  contentsItemCoverType?: "inside-home-only" | "inside-and-outside-home"
  contentsBicyclesOver300?: "yes" | "no"
  bicycleValue?: string
  bicycleMake?: string
  bicycleModel?: string
  bicycleRidingArea?: "uk-only" | "worldwide"
  contentsOtherValue?: string
  contentsAccidentalDamage?: "yes-add" | "decide-later"
  contentsYearsInsured?: string
  contentsNoClaimsDiscount?: string
  contentsAwayFromHome?: "yes" | "no"
  addonFamilyLegalProtection?: "yes-add" | "decide-later"
}

type HelpTopic =
  | "propertyToInsure"
  | "shortTermBasis"
  | "activity"
  | "sharing"

const STEPS = ["Your letting", "About you", "Our products", "Assumptions", "Property details", "Cover", "Quotes"] as const
const CREATE_ACCOUNT_PREFILL_STORAGE_KEY = "quote-card:create-account-prefill"

function DonutProgress({
  value,
  size = 44,
  strokeWidth = 5,
  className,
}: {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const clamped = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - clamped / 100)

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--purchase))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dashoffset] duration-300 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-semibold tabular-nums text-foreground">
          {Math.round(clamped)}%
        </span>
      </div>
    </div>
  )
}

function QuestionHeader({
  label,
  onHelp,
}: {
  label: string
  onHelp: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-foreground font-medium">
        {label}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label={`More info: ${label}`}
            onClick={onHelp}
          >
            <Info className="h-4 w-4" aria-hidden />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">More info</TooltipContent>
      </Tooltip>
    </div>
  )
}

function InlineLabelWithInfo({
  label,
}: {
  label: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label={`More info: ${label}`}
          >
            <Info className="h-4 w-4" aria-hidden />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">More info</TooltipContent>
      </Tooltip>
    </div>
  )
}

function TrueFalseToggle({
  value,
  onChange,
  trueLabel = "True",
  falseLabel = "False",
  defaultToTrue = false,
}: {
  value: boolean | undefined
  onChange: (v: boolean) => void
  trueLabel?: string
  falseLabel?: string
  defaultToTrue?: boolean
}) {
  // For the Assumptions step we default each statement to "True" visually/behaviourally.
  const isFalse = value === false
  const isTrue = value === true || (defaultToTrue && value === undefined)

  return (
    <div className="flex h-9 min-w-[120px] w-[120px] flex-none shrink-0 items-stretch gap-1 overflow-hidden rounded-lg border border-border bg-white px-[2px] py-[2px]">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={cn(
          "flex flex-1 items-center justify-center rounded-md px-2 py-0 text-sm font-semibold transition-colors",
          isTrue ? "bg-button text-white hover:bg-button" : "bg-white text-foreground hover:bg-muted/40"
        )}
        aria-pressed={isTrue}
      >
        {trueLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={cn(
          "flex flex-1 items-center justify-center rounded-lg px-2 py-0 text-sm font-semibold transition-colors",
          isFalse ? "bg-button text-white hover:bg-button" : "bg-white text-foreground hover:bg-muted/40"
        )}
        aria-pressed={isFalse}
      >
        {falseLabel}
      </button>
    </div>
  )
}

export function LettingWizardPage() {
  const [helpOpen, setHelpOpen] = useState(false)
  const [helpTopic, setHelpTopic] = useState<HelpTopic | null>(null)
  const [wizardMenuOpen, setWizardMenuOpen] = useState(false)
  const [createAccountOpen, setCreateAccountOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [createAccountPrefill, setCreateAccountPrefill] = useState<{
    name?: string
    email?: string
    mobile?: string
  }>({})
  const [additionalItems, setAdditionalItems] = useState<
    Array<{ category: string; description: string; value: string; coverType: string }>
  >([])
  const [additionalBikes, setAdditionalBikes] = useState<
    Array<{ value: string; make: string; model: string; ridingArea: string }>
  >([])
  const [stepIndex, setStepIndex] = useState<0 | 1 | 2 | 3 | 4 | 5>(() => {
    if (typeof window === "undefined") return 0
    return window.location.hash === "#letting-about" ? 1 : 0
  })

  const openCreateAccountModal = () => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(CREATE_ACCOUNT_PREFILL_STORAGE_KEY)
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { name?: string; email?: string; mobile?: string }
          setCreateAccountPrefill(parsed ?? {})
        } catch {
          setCreateAccountPrefill({})
        }
      } else {
        setCreateAccountPrefill({})
      }
    }

    setCreateAccountOpen(true)
  }

  const updateAdditionalItem = (
    index: number,
    patch: Partial<{ category: string; description: string; value: string; coverType: string }>
  ) => {
    setAdditionalItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)))
  }

  const updateAdditionalBike = (
    index: number,
    patch: Partial<{ value: string; make: string; model: string; ridingArea: string }>
  ) => {
    setAdditionalBikes((prev) => prev.map((bike, idx) => (idx === index ? { ...bike, ...patch } : bike)))
  }

  const formatMoneyInput = (raw: string) => {
    const digitsOnly = raw.replace(/[^\d]/g, "")
    if (!digitsOnly) return ""

    const n = Number.parseInt(digitsOnly, 10)
    if (Number.isNaN(n)) return ""

    const formatted = new Intl.NumberFormat("en-GB").format(n)
    return `£${formatted}`
  }

  const mainScrollRef = useRef<HTMLElement | null>(null)

  const dobDayRef = useRef<HTMLInputElement | null>(null)
  const dobMonthRef = useRef<HTMLInputElement | null>(null)
  const dobYearRef = useRef<HTMLInputElement | null>(null)
  const coverDateInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<LettingFormValues>({
    defaultValues: {
      // Step 4: assumptions default to "True" active (user can flip any to "False")
      assumptionUkResident: true,
      assumptionPropertyOwnerResponsibility: true,
      assumptionSixMonthAst: true,
      assumptionNoCancelledInsurance: true,
      assumptionNoBankruptcy: true,
      assumptionNoExcessClaims: true,
      assumptionNoCriminalOffences: true,
      assumptionPropertyGoodRepair: true,
      assumptionNoThatchedRoof: true,
      assumptionNoFlooding: true,
      assumptionNoSubsidenceHeaveLandslip: true,
      assumptionLessThan20People: true,
      assumptionCompliesWithLocalAuthority: true,
      assumptionPermissionToAccessHistory: true,
      assumptionNoFalseStatements: false,
    },
    mode: "onChange",
  })

  const values = form.watch()

  useEffect(() => {
    if (typeof window === "undefined") return

    const first = values.firstName?.trim() ?? ""
    const last = values.lastName?.trim() ?? ""
    const fullName = [first, last].filter(Boolean).join(" ").trim()
    const email = values.email?.trim() ?? ""
    const mobile = values.mobile?.trim() ?? ""

    window.localStorage.setItem(
      CREATE_ACCOUNT_PREFILL_STORAGE_KEY,
      JSON.stringify({
        name: fullName,
        email,
        mobile,
      })
    )
  }, [values.firstName, values.lastName, values.email, values.mobile])
  const showShortTerm = stepIndex === 0 && values.propertyToInsure != null
  const showActivity = stepIndex === 0 && showShortTerm && values.shortTermBasis != null
  const showSharing = stepIndex === 0 && showActivity && values.activity != null
  const showStep5PropertyDescription = stepIndex === 4 && values.propertyType != null
  const showStep5PropertyListed =
    showStep5PropertyDescription && (values.propertyDescription?.trim()?.length ?? 0) > 0
  const showStep5RoofFlatPercentage = showStep5PropertyListed && values.propertyListed != null
  const showStep5WallMaterial = showStep5RoofFlatPercentage && values.propertyRoofFlatPercentage != null
  const showStep5RoofMaterial = showStep5WallMaterial && values.propertyWallMaterial != null
  const showStep5Bedrooms = showStep5RoofMaterial && values.propertyRoofMaterial != null
  const showStep5Bathrooms = showStep5Bedrooms && (values.propertyBedrooms?.trim()?.length ?? 0) > 0
  const showStep5TotalRooms = showStep5Bathrooms && (values.propertyBathrooms?.trim()?.length ?? 0) > 0
  const showStep5Floors = showStep5TotalRooms && (values.propertyTotalRooms?.trim()?.length ?? 0) > 0
  const showStep5YearBuilt = showStep5Floors && (values.propertyFloors?.trim()?.length ?? 0) > 0
  const showStep5OwnLockableDoors = showStep5YearBuilt && (values.propertyYearBuilt?.trim()?.length ?? 0) > 0
  const showStep5ApprovedLocksFinalDoors =
    showStep5OwnLockableDoors && values.propertyOwnLockableFinalDoors != null
  const showStep5PatioFrenchDoors =
    showStep5ApprovedLocksFinalDoors && values.propertyApprovedLocksFinalDoors != null
  const showStep5PatioFrenchDoorsApprovedLocks =
    showStep5PatioFrenchDoors && values.propertyHasPatioOrFrenchDoors != null
  const showStep5KeyOperatedWindowLocks =
    showStep5PatioFrenchDoorsApprovedLocks &&
    values.propertyPatioOrFrenchDoorsApprovedLocks != null
  const showStep5IntruderAlarm =
    showStep5KeyOperatedWindowLocks && values.propertyHasKeyOperatedWindowLocks != null
  const showStep5IntruderAlarmType =
    showStep5IntruderAlarm && values.propertyHasIntruderAlarm === "yes"
  const showStep5FirePrecautions =
    showStep5IntruderAlarm &&
    (values.propertyHasIntruderAlarm === "no" ||
      (values.propertyHasIntruderAlarm === "yes" && values.propertyIntruderAlarmType != null))
  const showStep5OccupiedNightHours =
    showStep5FirePrecautions && (values.propertyFirePrecautions?.length ?? 0) > 0
  const showStep5Unoccupied =
    showStep5OccupiedNightHours && values.propertyOccupiedNightHours != null

  const showStep6CoverType = stepIndex === 5 && (values.coverStartDate?.trim()?.length ?? 0) > 0
  const showStep6BuildingsSection =
    showStep6CoverType && (values.coverType === "buildings" || values.coverType === "buildings-contents")
  const showStep6BuildingsAccidentalDamage =
    showStep6BuildingsSection &&
    values.buildingsRebuildBand != null &&
    (values.buildingsRebuildBand !== "custom" ||
      (values.buildingsCustomAmount?.trim()?.length ?? 0) > 0)
  const showStep6BuildingsNoClaims =
    showStep6BuildingsAccidentalDamage && values.buildingsAccidentalDamage != null

  const showStep6ContentsSection =
    showStep6CoverType &&
    (values.coverType === "contents" ||
      (values.coverType === "buildings-contents" &&
        showStep6BuildingsNoClaims &&
        (values.buildingsNoClaimsDiscount?.trim()?.length ?? 0) > 0))
  const isStep6ContentsItemDetailsComplete =
    values.contentsItemsOver1500 === "no" ||
    (values.contentsItemsOver1500 === "yes" &&
      (values.contentsItemCategory?.trim()?.length ?? 0) > 0 &&
      (values.contentsItemDescription?.trim()?.length ?? 0) > 0 &&
      (values.contentsItemValue?.trim()?.length ?? 0) > 0 &&
      values.contentsItemCoverType != null)
  const showStep6ContentsBicycles =
    showStep6ContentsSection &&
    values.contentsItemsOver1500 != null &&
    isStep6ContentsItemDetailsComplete
  const isStep6BicycleDetailsComplete =
    values.contentsBicyclesOver300 === "no" ||
    (values.contentsBicyclesOver300 === "yes" &&
      (values.bicycleValue?.trim()?.length ?? 0) > 0 &&
      (values.bicycleMake?.trim()?.length ?? 0) > 0 &&
      (values.bicycleModel?.trim()?.length ?? 0) > 0 &&
      values.bicycleRidingArea != null)
  const showStep6ContentsOtherValue =
    showStep6ContentsBicycles &&
    values.contentsBicyclesOver300 != null &&
    isStep6BicycleDetailsComplete
  const showStep6ContentsAccidentalDamage =
    showStep6ContentsOtherValue && (values.contentsOtherValue?.trim()?.length ?? 0) > 0
  const showStep6ContentsYearsInsured =
    showStep6ContentsAccidentalDamage && values.contentsAccidentalDamage != null
  const showStep6ContentsNoClaims =
    showStep6ContentsYearsInsured && (values.contentsYearsInsured?.trim()?.length ?? 0) > 0
  const showStep6ContentsAwayFromHome =
    showStep6ContentsNoClaims && (values.contentsNoClaimsDiscount?.trim()?.length ?? 0) > 0

  const showStep6Addons =
    showStep6CoverType &&
    ((values.coverType === "buildings" &&
      showStep6BuildingsNoClaims &&
      (values.buildingsNoClaimsDiscount?.trim()?.length ?? 0) > 0) ||
      ((values.coverType === "contents" || values.coverType === "buildings-contents") &&
        showStep6ContentsAwayFromHome &&
        values.contentsAwayFromHome != null))

  const propertyTypeDescriptionSuffix =
    values.propertyType === "house"
      ? "house"
      : values.propertyType === "bungalow"
        ? "bungalow"
        : values.propertyType === "townhouse"
          ? "townhouse"
          : values.propertyType === "flat"
            ? "flat"
            : values.propertyType === "other"
              ? "property"
              : "property"

  useEffect(() => {
    if (values.workPattern !== "part-time") {
      form.setValue("hasAdditionalOccupation", undefined, { shouldDirty: false, shouldTouch: false })
      form.setValue("additionalOccupation", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("additionalOccupationBusinessType", "", { shouldDirty: false, shouldTouch: false })
      return
    }

    if (values.hasAdditionalOccupation !== "yes") {
      form.setValue("additionalOccupation", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("additionalOccupationBusinessType", "", { shouldDirty: false, shouldTouch: false })
    }
  }, [form, values.hasAdditionalOccupation, values.workPattern])

  useEffect(() => {
    if (values.claimsLast5Years !== "yes") {
      form.setValue("claimType", undefined, { shouldDirty: false, shouldTouch: false })
      form.setValue("claimSettled", undefined, { shouldDirty: false, shouldTouch: false })
    }
  }, [form, values.claimsLast5Years])

  useEffect(() => {
    if (values.propertyHasIntruderAlarm !== "yes") {
      form.setValue("propertyIntruderAlarmType", undefined, { shouldDirty: false, shouldTouch: false })
    }
  }, [form, values.propertyHasIntruderAlarm])

  useEffect(() => {
    if (values.buildingsRebuildBand !== "custom") {
      form.setValue("buildingsCustomAmount", "", { shouldDirty: false, shouldTouch: false })
    }
  }, [form, values.buildingsRebuildBand])

  useEffect(() => {
    if (values.coverType === "buildings") {
      form.setValue("contentsItemsOver1500", undefined, { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsItemCategory", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsItemDescription", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsItemValue", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsItemCoverType", undefined, { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsBicyclesOver300", undefined, { shouldDirty: false, shouldTouch: false })
      form.setValue("bicycleValue", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("bicycleMake", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("bicycleModel", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("bicycleRidingArea", undefined, { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsOtherValue", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsAccidentalDamage", undefined, { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsYearsInsured", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsNoClaimsDiscount", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsAwayFromHome", undefined, { shouldDirty: false, shouldTouch: false })
    }
    if (values.coverType === "contents") {
      form.setValue("buildingsRebuildBand", undefined, { shouldDirty: false, shouldTouch: false })
      form.setValue("buildingsCustomAmount", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("buildingsAccidentalDamage", undefined, { shouldDirty: false, shouldTouch: false })
      form.setValue("buildingsYearsInsured", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("buildingsNoClaimsDiscount", "", { shouldDirty: false, shouldTouch: false })
    }
  }, [form, values.coverType])

  useEffect(() => {
    if (values.contentsItemsOver1500 !== "yes") {
      form.setValue("contentsItemCategory", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsItemDescription", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsItemValue", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("contentsItemCoverType", undefined, { shouldDirty: false, shouldTouch: false })
      setAdditionalItems([])
    }
  }, [form, values.contentsItemsOver1500])

  useEffect(() => {
    if (values.contentsBicyclesOver300 !== "yes") {
      form.setValue("bicycleValue", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("bicycleMake", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("bicycleModel", "", { shouldDirty: false, shouldTouch: false })
      form.setValue("bicycleRidingArea", undefined, { shouldDirty: false, shouldTouch: false })
      setAdditionalBikes([])
    }
  }, [form, values.contentsBicyclesOver300])

  // Ensure Step 4 statements are defaulted to "True" as soon as the UI appears.
  useEffect(() => {
    if (stepIndex !== 3) return

    const statementKeys: Array<
      | "assumptionUkResident"
      | "assumptionPropertyOwnerResponsibility"
      | "assumptionSixMonthAst"
      | "assumptionNoCancelledInsurance"
      | "assumptionNoBankruptcy"
      | "assumptionNoExcessClaims"
      | "assumptionNoCriminalOffences"
      | "assumptionPropertyGoodRepair"
      | "assumptionNoThatchedRoof"
      | "assumptionNoFlooding"
      | "assumptionNoSubsidenceHeaveLandslip"
      | "assumptionLessThan20People"
      | "assumptionCompliesWithLocalAuthority"
      | "assumptionPermissionToAccessHistory"
    > = [
      "assumptionUkResident",
      "assumptionPropertyOwnerResponsibility",
      "assumptionSixMonthAst",
      "assumptionNoCancelledInsurance",
      "assumptionNoBankruptcy",
      "assumptionNoExcessClaims",
      "assumptionNoCriminalOffences",
      "assumptionPropertyGoodRepair",
      "assumptionNoThatchedRoof",
      "assumptionNoFlooding",
      "assumptionNoSubsidenceHeaveLandslip",
      "assumptionLessThan20People",
      "assumptionCompliesWithLocalAuthority",
      "assumptionPermissionToAccessHistory",
    ]

    const current = form.getValues()
    const missingAny = statementKeys.some((k) => typeof (current as any)[k] !== "boolean")
    const tickMissing = typeof (current as any).assumptionNoFalseStatements !== "boolean"

    if (!missingAny && !tickMissing) return

    statementKeys.forEach((k) => {
      if (typeof (current as any)[k] !== "boolean") {
        form.setValue(k as any, true, { shouldDirty: false, shouldTouch: false })
      }
    })

    if (tickMissing) {
      form.setValue("assumptionNoFalseStatements", false, { shouldDirty: false, shouldTouch: false })
    }
  }, [form, stepIndex])

  const step1Complete = useMemo(() => {
    return (
      values.propertyToInsure != null &&
      values.shortTermBasis != null &&
      values.activity != null &&
      values.sharing != null
    )
  }, [values.activity, values.propertyToInsure, values.sharing, values.shortTermBasis])

  const step2Complete = useMemo(() => {
    return (
      values.title != null &&
      (values.firstName?.trim()?.length ?? 0) > 0 &&
      (values.lastName?.trim()?.length ?? 0) > 0 &&
      (values.email?.trim()?.length ?? 0) > 0 &&
      (values.mobile?.trim()?.length ?? 0) > 0 &&
      (values.dobDay?.trim()?.length ?? 0) > 0 &&
      (values.dobMonth?.trim()?.length ?? 0) > 0 &&
      (values.dobYear?.trim()?.length ?? 0) > 0 &&
      values.maritalStatus != null &&
      values.marketingOptIn != null &&
      (values.postcode?.trim()?.length ?? 0) > 0 &&
      values.employmentStatus != null &&
      (values.mainOccupation?.trim()?.length ?? 0) > 0 &&
      (values.businessType?.trim()?.length ?? 0) > 0 &&
      values.workPattern != null &&
      (values.workPattern !== "part-time" ||
        (values.hasAdditionalOccupation != null &&
          (values.hasAdditionalOccupation === "no" ||
            ((values.additionalOccupation?.trim()?.length ?? 0) > 0 &&
              (values.additionalOccupationBusinessType?.trim()?.length ?? 0) > 0)))) &&
      (values.expectedAdults?.trim()?.length ?? 0) > 0 &&
      values.claimsLast5Years != null &&
      (values.claimsLast5Years !== "yes" ||
        ((values.claimType?.trim()?.length ?? 0) > 0 && values.claimSettled != null)) &&
      values.additionalPolicyholders != null
    )
  }, [
    values.additionalPolicyholders,
    values.claimSettled,
    values.claimType,
    values.claimsLast5Years,
    values.dobDay,
    values.dobMonth,
    values.dobYear,
    values.email,
    values.employmentStatus,
    values.mainOccupation,
    values.businessType,
    values.additionalOccupation,
    values.additionalOccupationBusinessType,
    values.workPattern,
    values.hasAdditionalOccupation,
    values.expectedAdults,
    values.firstName,
    values.lastName,
    values.maritalStatus,
    values.marketingOptIn,
    values.mobile,
    values.postcode,
    values.title,
  ])

  const step3Complete = useMemo(() => {
    return values.selectedProduct != null && values.shortTermLettingDays != null
  }, [values.selectedProduct, values.shortTermLettingDays])

  const step4Complete = useMemo(() => {
    const statementKeys: Array<
      | "assumptionUkResident"
      | "assumptionPropertyOwnerResponsibility"
      | "assumptionSixMonthAst"
      | "assumptionNoCancelledInsurance"
      | "assumptionNoBankruptcy"
      | "assumptionNoExcessClaims"
      | "assumptionNoCriminalOffences"
      | "assumptionPropertyGoodRepair"
      | "assumptionNoThatchedRoof"
      | "assumptionNoFlooding"
      | "assumptionNoSubsidenceHeaveLandslip"
      | "assumptionLessThan20People"
      | "assumptionCompliesWithLocalAuthority"
      | "assumptionPermissionToAccessHistory"
    > = [
      "assumptionUkResident",
      "assumptionPropertyOwnerResponsibility",
      "assumptionSixMonthAst",
      "assumptionNoCancelledInsurance",
      "assumptionNoBankruptcy",
      "assumptionNoExcessClaims",
      "assumptionNoCriminalOffences",
      "assumptionPropertyGoodRepair",
      "assumptionNoThatchedRoof",
      "assumptionNoFlooding",
      "assumptionNoSubsidenceHeaveLandslip",
      "assumptionLessThan20People",
      "assumptionCompliesWithLocalAuthority",
      "assumptionPermissionToAccessHistory",
    ]

    // Default "True" when a statement value is currently unset/undefined.
    const allTrue = statementKeys.every((k) => (values as any)[k] !== false)

    // If everything is still "True", require the confirmation tick.
    if (allTrue) return values.assumptionNoFalseStatements === true
    // If any statement was changed to "False", the tick must be left unticked.
    return values.assumptionNoFalseStatements === false
  }, [values])

  const step5Complete = useMemo(() => {
    return (
      values.propertyType != null &&
      values.propertyDescription != null &&
      values.propertyListed != null &&
      (values.propertyFirePrecautions?.length ?? 0) > 0 &&
      values.propertyOccupiedNightHours != null &&
      values.propertyUnoccupied != null &&
      values.propertyOwnLockableFinalDoors != null &&
      values.propertyApprovedLocksFinalDoors != null &&
      values.propertyHasPatioOrFrenchDoors != null &&
      values.propertyPatioOrFrenchDoorsApprovedLocks != null &&
      values.propertyHasKeyOperatedWindowLocks != null &&
      values.propertyHasIntruderAlarm != null &&
      (values.propertyHasIntruderAlarm !== "yes" || values.propertyIntruderAlarmType != null) &&
      (values.propertyBedrooms?.trim()?.length ?? 0) > 0 &&
      (values.propertyBathrooms?.trim()?.length ?? 0) > 0 &&
      (values.propertyTotalRooms?.trim()?.length ?? 0) > 0 &&
      (values.propertyFloors?.trim()?.length ?? 0) > 0 &&
      (values.propertyYearBuilt?.trim()?.length ?? 0) > 0 &&
      values.propertyRoofMaterial != null &&
      values.propertyRoofFlatPercentage != null &&
      values.propertyWallMaterial != null
    )
  }, [values])

  const step6Complete = useMemo(() => {
    const hasCoverStartDate = (values.coverStartDate?.trim()?.length ?? 0) > 0
    if (!hasCoverStartDate || values.coverType == null) return false

    const buildingsComplete =
      values.buildingsRebuildBand != null &&
      (values.buildingsRebuildBand !== "custom" ||
        (values.buildingsCustomAmount?.trim()?.length ?? 0) > 0) &&
      values.buildingsAccidentalDamage != null &&
      (values.buildingsNoClaimsDiscount?.trim()?.length ?? 0) > 0

    const contentsComplete =
      values.contentsItemsOver1500 != null &&
      (values.contentsItemsOver1500 === "no" ||
        ((values.contentsItemCategory?.trim()?.length ?? 0) > 0 &&
          (values.contentsItemDescription?.trim()?.length ?? 0) > 0 &&
          (values.contentsItemValue?.trim()?.length ?? 0) > 0 &&
          values.contentsItemCoverType != null)) &&
      values.contentsBicyclesOver300 != null &&
      (values.contentsBicyclesOver300 === "no" ||
        ((values.bicycleValue?.trim()?.length ?? 0) > 0 &&
          (values.bicycleMake?.trim()?.length ?? 0) > 0 &&
          (values.bicycleModel?.trim()?.length ?? 0) > 0 &&
          values.bicycleRidingArea != null)) &&
      (values.contentsOtherValue?.trim()?.length ?? 0) > 0 &&
      values.contentsAccidentalDamage != null &&
      (values.contentsYearsInsured?.trim()?.length ?? 0) > 0 &&
      (values.contentsNoClaimsDiscount?.trim()?.length ?? 0) > 0 &&
      values.contentsAwayFromHome != null

    const addonsComplete = values.addonFamilyLegalProtection != null

    if (values.coverType === "buildings") return buildingsComplete && addonsComplete
    if (values.coverType === "contents") return contentsComplete && addonsComplete
    return buildingsComplete && contentsComplete && addonsComplete
  }, [values])

  const personalSectionComplete = useMemo(() => {
    return (
      values.title &&
      (values.firstName?.trim()?.length ?? 0) > 0 &&
      (values.lastName?.trim()?.length ?? 0) > 0 &&
      (values.email?.trim()?.length ?? 0) > 0 &&
      (values.mobile?.trim()?.length ?? 0) > 0 &&
      (values.dobDay?.trim()?.length ?? 0) > 0 &&
      (values.dobMonth?.trim()?.length ?? 0) > 0 &&
      (values.dobYear?.trim()?.length ?? 0) > 0 &&
      values.maritalStatus
    )
  }, [
    values.dobDay,
    values.dobMonth,
    values.dobYear,
    values.email,
    values.firstName,
    values.lastName,
    values.maritalStatus,
    values.mobile,
    values.title,
  ])

  const marketingSectionComplete = useMemo(
    () => !!values.marketingOptIn,
    [values.marketingOptIn]
  )

  const addressSectionComplete = useMemo(
    () => (values.postcode?.trim()?.length ?? 0) > 0,
    [values.postcode]
  )

  const employmentSectionComplete = useMemo(
    () =>
      !!values.employmentStatus &&
      (values.mainOccupation?.trim()?.length ?? 0) > 0 &&
      (values.businessType?.trim()?.length ?? 0) > 0 &&
      !!values.workPattern &&
      (values.workPattern !== "part-time" ||
        (values.hasAdditionalOccupation != null &&
          (values.hasAdditionalOccupation === "no" ||
            ((values.additionalOccupation?.trim()?.length ?? 0) > 0 &&
              (values.additionalOccupationBusinessType?.trim()?.length ?? 0) > 0)))),
    [
      values.additionalOccupation,
      values.additionalOccupationBusinessType,
      values.businessType,
      values.employmentStatus,
      values.hasAdditionalOccupation,
      values.mainOccupation,
      values.workPattern,
    ]
  )

  const guestsSectionComplete = useMemo(
    () => (values.expectedAdults?.trim()?.length ?? 0) > 0,
    [values.expectedAdults]
  )

  const claimsSectionComplete = useMemo(
    () =>
      !!values.claimsLast5Years &&
      (values.claimsLast5Years !== "yes" ||
        ((values.claimType?.trim()?.length ?? 0) > 0 && !!values.claimSettled)),
    [values.claimSettled, values.claimType, values.claimsLast5Years]
  )

  const completedSteps = useMemo(() => {
    return (
      (step1Complete ? 1 : 0) +
      (step2Complete ? 1 : 0) +
      (step3Complete ? 1 : 0) +
      (step4Complete ? 1 : 0) +
      (step5Complete ? 1 : 0) +
      (step6Complete ? 1 : 0)
    )
  }, [step1Complete, step2Complete, step3Complete, step4Complete, step5Complete, step6Complete])

  const overallProgress = useMemo(() => {
    return (completedSteps / 7) * 100
  }, [completedSteps])

  const pageProgress = useMemo(() => {
    if (stepIndex === 0) {
      const total = 4
      const answered =
        (values.propertyToInsure ? 1 : 0) +
        (values.shortTermBasis ? 1 : 0) +
        (values.activity ? 1 : 0) +
        (values.sharing ? 1 : 0)
      return (answered / total) * 100
    }

    if (stepIndex === 2) {
      const total = 2
      const answered =
        (values.selectedProduct ? 1 : 0) +
        (values.shortTermLettingDays ? 1 : 0)
      return (answered / total) * 100
    }

    if (stepIndex === 3) {
      if (step4Complete) return 100

      const statementKeys: Array<
        | "assumptionUkResident"
        | "assumptionPropertyOwnerResponsibility"
        | "assumptionSixMonthAst"
        | "assumptionNoCancelledInsurance"
        | "assumptionNoBankruptcy"
        | "assumptionNoExcessClaims"
        | "assumptionNoCriminalOffences"
        | "assumptionPropertyGoodRepair"
        | "assumptionNoThatchedRoof"
        | "assumptionNoFlooding"
        | "assumptionNoSubsidenceHeaveLandslip"
        | "assumptionLessThan20People"
        | "assumptionCompliesWithLocalAuthority"
        | "assumptionPermissionToAccessHistory"
      > = [
        "assumptionUkResident",
        "assumptionPropertyOwnerResponsibility",
        "assumptionSixMonthAst",
        "assumptionNoCancelledInsurance",
        "assumptionNoBankruptcy",
        "assumptionNoExcessClaims",
        "assumptionNoCriminalOffences",
        "assumptionPropertyGoodRepair",
        "assumptionNoThatchedRoof",
        "assumptionNoFlooding",
        "assumptionNoSubsidenceHeaveLandslip",
        "assumptionLessThan20People",
        "assumptionCompliesWithLocalAuthority",
        "assumptionPermissionToAccessHistory",
      ]

      const answeredStatements = statementKeys.filter((k) => typeof (values as any)[k] === "boolean").length
      const answeredTick = values.assumptionNoFalseStatements === true ? 1 : 0

      const total = statementKeys.length + 1
      const answered = answeredStatements + answeredTick
      return (answered / total) * 100
    }

    if (stepIndex === 4) {
      const intruderAlarmTypeTotal = values.propertyHasIntruderAlarm === "yes" ? 1 : 0
      const total = 20 + intruderAlarmTypeTotal
      const answered =
        (values.propertyType ? 1 : 0) +
        (values.propertyDescription ? 1 : 0) +
        (values.propertyListed ? 1 : 0) +
        ((values.propertyFirePrecautions?.length ?? 0) > 0 ? 1 : 0) +
        (values.propertyOccupiedNightHours ? 1 : 0) +
        (values.propertyUnoccupied ? 1 : 0) +
        (values.propertyOwnLockableFinalDoors ? 1 : 0) +
        (values.propertyApprovedLocksFinalDoors ? 1 : 0) +
        (values.propertyHasPatioOrFrenchDoors ? 1 : 0) +
        (values.propertyPatioOrFrenchDoorsApprovedLocks ? 1 : 0) +
        (values.propertyHasKeyOperatedWindowLocks ? 1 : 0) +
        (values.propertyHasIntruderAlarm ? 1 : 0) +
        (values.propertyHasIntruderAlarm === "yes" && values.propertyIntruderAlarmType ? 1 : 0) +
        ((values.propertyBedrooms?.trim()?.length ?? 0) > 0 ? 1 : 0) +
        ((values.propertyBathrooms?.trim()?.length ?? 0) > 0 ? 1 : 0) +
        ((values.propertyTotalRooms?.trim()?.length ?? 0) > 0 ? 1 : 0) +
        ((values.propertyFloors?.trim()?.length ?? 0) > 0 ? 1 : 0) +
        ((values.propertyYearBuilt?.trim()?.length ?? 0) > 0 ? 1 : 0) +
        (values.propertyRoofMaterial ? 1 : 0) +
        (values.propertyRoofFlatPercentage ? 1 : 0) +
        (values.propertyWallMaterial ? 1 : 0)
      return (answered / total) * 100
    }

    if (stepIndex === 5) {
      const includeBuildings = values.coverType === "buildings" || values.coverType === "buildings-contents"
      const includeContents = values.coverType === "contents" || values.coverType === "buildings-contents"
      const buildingsTotal = includeBuildings ? 4 : 0
      const highValueItemExtraTotal = includeContents && values.contentsItemsOver1500 === "yes" ? 4 : 0
      const bicycleExtraTotal = includeContents && values.contentsBicyclesOver300 === "yes" ? 4 : 0
      const contentsTotal = includeContents ? 7 + highValueItemExtraTotal + bicycleExtraTotal : 0
      const total = 2 + buildingsTotal + contentsTotal + 1

      const answered =
        ((values.coverStartDate?.trim()?.length ?? 0) > 0 ? 1 : 0) +
        (values.coverType ? 1 : 0) +
        (includeBuildings
          ? (values.buildingsRebuildBand ? 1 : 0) +
            (values.buildingsAccidentalDamage ? 1 : 0) +
            ((values.buildingsNoClaimsDiscount?.trim()?.length ?? 0) > 0 ? 1 : 0) +
            (values.buildingsRebuildBand === "custom"
              ? ((values.buildingsCustomAmount?.trim()?.length ?? 0) > 0 ? 1 : 0)
              : 1)
          : 0) +
        (includeContents
          ? (values.contentsItemsOver1500 ? 1 : 0) +
            (values.contentsItemsOver1500 === "yes"
              ? ((values.contentsItemCategory?.trim()?.length ?? 0) > 0 ? 1 : 0)
              : 0) +
            (values.contentsItemsOver1500 === "yes"
              ? ((values.contentsItemDescription?.trim()?.length ?? 0) > 0 ? 1 : 0)
              : 0) +
            (values.contentsItemsOver1500 === "yes"
              ? ((values.contentsItemValue?.trim()?.length ?? 0) > 0 ? 1 : 0)
              : 0) +
            (values.contentsItemsOver1500 === "yes" ? (values.contentsItemCoverType ? 1 : 0) : 0) +
            (values.contentsBicyclesOver300 ? 1 : 0) +
            (values.contentsBicyclesOver300 === "yes"
              ? ((values.bicycleValue?.trim()?.length ?? 0) > 0 ? 1 : 0)
              : 0) +
            (values.contentsBicyclesOver300 === "yes"
              ? ((values.bicycleMake?.trim()?.length ?? 0) > 0 ? 1 : 0)
              : 0) +
            (values.contentsBicyclesOver300 === "yes"
              ? ((values.bicycleModel?.trim()?.length ?? 0) > 0 ? 1 : 0)
              : 0) +
            (values.contentsBicyclesOver300 === "yes" ? (values.bicycleRidingArea ? 1 : 0) : 0) +
            ((values.contentsOtherValue?.trim()?.length ?? 0) > 0 ? 1 : 0) +
            (values.contentsAccidentalDamage ? 1 : 0) +
            ((values.contentsYearsInsured?.trim()?.length ?? 0) > 0 ? 1 : 0) +
            ((values.contentsNoClaimsDiscount?.trim()?.length ?? 0) > 0 ? 1 : 0) +
            (values.contentsAwayFromHome ? 1 : 0)
          : 0) +
        (values.addonFamilyLegalProtection ? 1 : 0)

      return total > 0 ? (answered / total) * 100 : 0
    }

    if (stepIndex === 1 && step2Complete) {
      return 100
    }

    // Step 2: treat each required input/question as one unit of progress.
    const additionalOccupationTotal =
      values.workPattern === "part-time"
        ? values.hasAdditionalOccupation === "yes"
          ? 3
          : 1
        : 0
    const claimsFollowUpTotal = values.claimsLast5Years === "yes" ? 2 : 0
    const total = 18 + additionalOccupationTotal + claimsFollowUpTotal
    const answered =
      (values.title ? 1 : 0) +
      ((values.firstName?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      ((values.lastName?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      ((values.email?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      ((values.mobile?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      ((values.dobDay?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      ((values.dobMonth?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      ((values.dobYear?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      (values.maritalStatus ? 1 : 0) +
      (values.marketingOptIn ? 1 : 0) +
      ((values.postcode?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      (values.employmentStatus ? 1 : 0) +
      ((values.mainOccupation?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      ((values.businessType?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      (values.workPattern ? 1 : 0) +
      (values.workPattern === "part-time" ? (values.hasAdditionalOccupation ? 1 : 0) : 0) +
      (values.workPattern === "part-time" && values.hasAdditionalOccupation === "yes"
        ? ((values.additionalOccupation?.trim()?.length ?? 0) > 0 ? 1 : 0)
        : 0) +
      (values.workPattern === "part-time" && values.hasAdditionalOccupation === "yes"
        ? ((values.additionalOccupationBusinessType?.trim()?.length ?? 0) > 0 ? 1 : 0)
        : 0) +
      ((values.expectedAdults?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      (values.claimsLast5Years ? 1 : 0) +
      (values.claimsLast5Years === "yes" ? ((values.claimType?.trim()?.length ?? 0) > 0 ? 1 : 0) : 0) +
      (values.claimsLast5Years === "yes" ? (values.claimSettled ? 1 : 0) : 0) +
      (values.additionalPolicyholders ? 1 : 0)

    return (answered / total) * 100
  }, [
    stepIndex,
    values.activity,
    values.additionalPolicyholders,
    values.claimSettled,
    values.claimType,
    values.claimsLast5Years,
    values.dobDay,
    values.dobMonth,
    values.dobYear,
    values.email,
    values.employmentStatus,
    values.mainOccupation,
    values.businessType,
    values.additionalOccupation,
    values.additionalOccupationBusinessType,
    values.workPattern,
    values.hasAdditionalOccupation,
    values.expectedAdults,
    values.firstName,
    values.lastName,
    values.maritalStatus,
    values.marketingOptIn,
    values.mobile,
    values.postcode,
    values.propertyApprovedLocksFinalDoors,
    values.propertyBathrooms,
    values.propertyBedrooms,
    values.propertyDescription,
    values.propertyFloors,
    values.propertyHasIntruderAlarm,
    values.propertyHasKeyOperatedWindowLocks,
    values.propertyHasPatioOrFrenchDoors,
    values.propertyFirePrecautions,
    values.propertyOccupiedNightHours,
    values.propertyIntruderAlarmType,
    values.propertyListed,
    values.propertyOwnLockableFinalDoors,
    values.propertyPatioOrFrenchDoorsApprovedLocks,
    values.propertyRoofFlatPercentage,
    values.propertyRoofMaterial,
    values.propertyTotalRooms,
    values.propertyType,
    values.propertyUnoccupied,
    values.propertyWallMaterial,
    values.propertyYearBuilt,
    values.propertyToInsure,
    values.coverStartDate,
    values.coverType,
    values.buildingsRebuildBand,
    values.buildingsCustomAmount,
    values.buildingsAccidentalDamage,
    values.buildingsYearsInsured,
    values.buildingsNoClaimsDiscount,
    values.contentsItemsOver1500,
    values.contentsItemCategory,
    values.contentsItemDescription,
    values.contentsItemValue,
    values.contentsItemCoverType,
    values.contentsBicyclesOver300,
    values.bicycleValue,
    values.bicycleMake,
    values.bicycleModel,
    values.bicycleRidingArea,
    values.contentsOtherValue,
    values.contentsAccidentalDamage,
    values.contentsYearsInsured,
    values.contentsNoClaimsDiscount,
    values.contentsAwayFromHome,
    values.addonFamilyLegalProtection,
    values.selectedProduct,
    values.shortTermLettingDays,
    values.sharing,
    values.shortTermBasis,
    values.title,
    step4Complete,
  ])

  const canContinue = useMemo(() => {
    if (stepIndex === 0) return step1Complete
    if (stepIndex === 1) return step2Complete
    if (stepIndex === 2) return step3Complete
    if (stepIndex === 3) return step4Complete
    if (stepIndex === 4) return step5Complete
    if (stepIndex === 5) return step6Complete
    return false
  }, [step1Complete, step2Complete, step3Complete, step4Complete, step5Complete, step6Complete, stepIndex])

  useEffect(() => {
    if (!helpOpen) setHelpTopic(null)
  }, [helpOpen])

  const helpCopy = useMemo(() => {
    const title =
      helpTopic === "propertyToInsure"
        ? "Is the property you wish to insure"
        : helpTopic === "shortTermBasis"
          ? "Short-term basis"
          : helpTopic === "activity"
            ? "Activities you want cover for"
            : helpTopic === "sharing"
              ? "Are you sharing"
              : "Help"

    const body =
      helpTopic === "propertyToInsure"
        ? "Choose the option that best describes the property you want to insure."
        : helpTopic === "shortTermBasis"
          ? "Tell us if you'll be letting, sharing, or swapping your property on a short-term basis."
          : helpTopic === "activity"
            ? "Select the main activity you want to purchase insurance for."
            : helpTopic === "sharing"
              ? "Let us know what part of the property you’ll be sharing."
              : "Select an info icon on a question to see more details here."

    return { title, body }
  }, [helpTopic])

  const coverStartDateDisplay = useMemo(() => {
    if (!values.coverStartDate) return ""
    const [year, month, day] = values.coverStartDate.split("-")
    if (!year || !month || !day) return values.coverStartDate
    return `${day}/${month}/${year}`
  }, [values.coverStartDate])

  const openCoverDatePicker = () => {
    const input = coverDateInputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null
    if (!input) return
    if (typeof input.showPicker === "function") {
      input.showPicker()
      return
    }
    input.click()
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden overscroll-none bg-neutral-50">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside
          className={cn(
            "hidden w-72 shrink-0 border-r border-border bg-white lg:block",
            "px-4 sm:px-6",
            "sticky top-0 self-start h-full"
          )}
        >
          <div className="flex h-full flex-col pt-4 pb-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">Overall progress</div>
                <div className="text-xs text-muted-foreground">
                  {completedSteps}/7 steps complete
                </div>
              </div>
              <DonutProgress value={overallProgress} />
            </div>

            <Separator className="mb-4" />

            <nav className="flex w-full flex-1 flex-col gap-1 overflow-y-auto">
              {STEPS.map((step, idx) => {
                const active = idx === stepIndex
                const enabled = idx <= 5 || idx === 6
                const isComplete =
                  idx === 0
                    ? step1Complete
                    : idx === 1
                      ? step2Complete
                      : idx === 2
                        ? step3Complete
                        : idx === 3
                          ? step4Complete
                          : idx === 4
                            ? step5Complete
                            : idx === 5
                              ? step6Complete
                          : false

                return (
                  <Button
                    key={step}
                    type="button"
                    variant={active ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-muted-foreground",
                      active && "bg-neutral-100 text-foreground hover:bg-neutral-100"
                    )}
                    disabled={!enabled}
                    onClick={() => {
                      if (!enabled) return
                      if (idx === 6) {
                        window.location.hash = ""
                        return
                      }
                      setStepIndex(idx as 0 | 1 | 2 | 3 | 4 | 5)
                      mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                  >
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center text-[11px]">
                      {isComplete ? (
                        <Check className="h-3 w-3" aria-hidden />
                      ) : (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border">
                          {idx + 1}
                        </span>
                      )}
                    </span>
                    {step}
                  </Button>
                )
              })}
            </nav>

            <Button
              type="button"
              variant="outline"
              className="mt-auto h-9 w-full justify-center gap-2 border-border"
              onClick={() => {
                setHelpOpen(false)
                setStepIndex(0)
                window.location.hash = "#letting"
                mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
              }}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to Pikl.com
            </Button>
          </div>
        </aside>

        <main
          className="min-w-0 min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
          ref={mainScrollRef}
        >
          <div className="sticky top-0 z-10 border-b border-border py-1.5 bg-white/95 relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-4 top-[calc(50%-6px)] h-8 w-8 -translate-y-1/2 sm:right-6"
              aria-label="Wizard menu"
              onClick={() => setWizardMenuOpen(true)}
            >
              <Menu className="h-4 w-4" aria-hidden />
            </Button>
            <div className="mx-auto w-full max-w-[968px] px-4 py-2 sm:px-6">
              {/* Step title with prev/next arrows */}
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 pb-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={stepIndex === 0}
                  aria-label="Previous step"
                  onClick={() => {
                    if (stepIndex === 0) return
                    setStepIndex((stepIndex - 1) as 0 | 1 | 2 | 3 | 4)
                    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </Button>

                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center bg-white">
                    <span className="text-sm font-semibold text-foreground">
                      {stepIndex === 0
                        ? "Your letting"
                        : stepIndex === 1
                          ? "About you"
                          : stepIndex === 2
                            ? "Our products"
                            : stepIndex === 3
                              ? "Assumptions"
                              : stepIndex === 4
                                ? "Property details"
                                : stepIndex === 5
                                  ? "Cover"
                                : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={stepIndex === 5}
                    aria-label="Next step"
                    onClick={() => {
                      if (stepIndex >= 5) return
                      setStepIndex((stepIndex + 1) as 1 | 2 | 3 | 4 | 5)
                      mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-purchase transition-[width] duration-300 ease-out"
                  style={{ width: `${pageProgress}%` }}
                  aria-label="Step progress"
                />
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[968px] px-4 pb-8 pt-4 sm:px-6 sm:pt-6">
            {stepIndex === 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-4">
                  <p className="text-sm font-medium text-foreground">Quoted with us before?</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9"
                    onClick={() => {
                      window.location.hash = ""
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                    }}
                  >
                    Retrieve my quote
                  </Button>
                </div>
              </div>
            )}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle
                  className={cn(
                    "text-[18px] font-semibold"
                  )}
                >
                  {stepIndex === 0
                    ? "Tell us about your short-term letting"
                    : stepIndex === 1
                      ? "About you"
                      : stepIndex === 2
                        ? "Our products"
                        : stepIndex === 3
                          ? "Assumptions"
                          : stepIndex === 4
                            ? "Property details"
                            : stepIndex === 5
                              ? "Cover"
                              : "Cover"}
                </CardTitle>
                <CardDescription>
                  {stepIndex === 0
                    ? "Please take care to answer all questions honestly and to the best of your knowledge."
                    : stepIndex === 1
                      ? "Pikl will only contact you regarding your quote, new policy or policy renewal."
                      : stepIndex === 2
                        ? "We have two options for your cover needs, all-in-one covers you for home and host insurance, while top-up is added to your exisiting home insurance plan and covers you for host insurance:"
                        : stepIndex === 3
                          ? "Please check the following statement(s) and change any that are false."
                      : stepIndex === 4
                        ? "Tell us about your property and security details."
                        : "Choose your cover options to finish your quote."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(() => {
                      if (stepIndex === 0 && step1Complete) setStepIndex(1)
                      if (stepIndex === 1 && step2Complete) setStepIndex(2)
                      if (stepIndex === 2 && step3Complete) setStepIndex(3)
                      if (stepIndex === 3 && step4Complete) setStepIndex(4)
                      if (stepIndex === 4 && step5Complete) setStepIndex(5)
                      if (stepIndex === 5 && step6Complete) window.location.hash = ""
                    })}
                    className="space-y-6 text-[14px]"
                  >
                    {stepIndex === 0 && (
                      <>
                        <FormField
                          control={form.control}
                          name="propertyToInsure"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <QuestionHeader
                                label="Is the property you wish to insure:"
                                onHelp={() => {
                                  setHelpTopic("propertyToInsure")
                                  setHelpOpen(true)
                                }}
                              />
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="grid gap-2"
                                >
                                  <label
                                    className={cn(
                                      "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                      field.value === "primary" && "border-foreground bg-muted/40"
                                    )}
                                  >
                                    <RadioGroupItem value="primary" />
                                    <span className="text-sm">Your primary residence</span>
                                  </label>
                                  <label
                                    className={cn(
                                      "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                      field.value === "second" && "border-foreground bg-muted/40"
                                    )}
                                  >
                                    <RadioGroupItem value="second" />
                                    <span className="text-sm">Your second or holiday home</span>
                                  </label>
                                  <label
                                    className={cn(
                                      "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                      field.value === "investment" && "border-foreground bg-muted/40"
                                    )}
                                  >
                                    <RadioGroupItem value="investment" />
                                    <span className="text-sm">An investment property used for letting</span>
                                  </label>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {showShortTerm && (
                          <FormField
                            control={form.control}
                            name="shortTermBasis"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <QuestionHeader
                                  label="Will you be letting, sharing, or swapping your property on a short-term basis?"
                                  onHelp={() => {
                                    setHelpTopic("shortTermBasis")
                                    setHelpOpen(true)
                                  }}
                                />
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid grid-cols-2 gap-3"
                                  >
                                    <label
                                      className={cn(
                                        "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                        field.value === "yes" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="yes" />
                                      <span className="text-sm">Yes</span>
                                    </label>
                                    <label
                                      className={cn(
                                        "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                        field.value === "no" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="no" />
                                      <span className="text-sm">No</span>
                                    </label>
                                  </RadioGroup>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}

                        {showActivity && (
                          <FormField
                            control={form.control}
                            name="activity"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <QuestionHeader
                                  label="Which of the following activities do you want to purchase insurance for?"
                                  onHelp={() => {
                                    setHelpTopic("activity")
                                    setHelpOpen(true)
                                  }}
                                />
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                                  >
                                    <label
                                      className={cn(
                                        "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                        field.value === "letting" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="letting" />
                                      <span className="text-sm">Letting your property on a short-term basis</span>
                                    </label>
                                    <label
                                      className={cn(
                                        "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                        field.value === "swapping" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="swapping" />
                                      <span className="text-sm">Swapping</span>
                                    </label>
                                  </RadioGroup>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}

                        {showSharing && (
                          <FormField
                            control={form.control}
                            name="sharing"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <QuestionHeader
                                  label="Are you sharing:"
                                  onHelp={() => {
                                    setHelpTopic("sharing")
                                    setHelpOpen(true)
                                  }}
                                />
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid gap-2"
                                  >
                                    <label
                                      className={cn(
                                        "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                        field.value === "single-bedroom" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="single-bedroom" />
                                      <span className="text-sm">A single bedroom (while you are resident)</span>
                                    </label>
                                    <label
                                      className={cn(
                                        "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                        field.value === "entire-property" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="entire-property" />
                                      <span className="text-sm">Your entire property (or multiple bedrooms)</span>
                                    </label>
                                    <label
                                      className={cn(
                                        "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                        field.value === "annex" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="annex" />
                                      <span className="text-sm">An annex</span>
                                    </label>
                                    <label
                                      className={cn(
                                        "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                        field.value === "none" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="none" />
                                      <span className="text-sm">None of the above</span>
                                    </label>
                                  </RadioGroup>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                      </>
                    )}

                    {stepIndex === 1 && (
                      <div className="space-y-6">
                        <div className="rounded-xl border border-border bg-white p-4">
                          <div
                            className="text-sm font-semibold text-foreground"
                          >
                            Personal details
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Please enter your full first and last names (no nicknames) to ensure your quote is accurate.
                          </p>

                          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <div className="text-sm font-medium text-foreground">Title</div>
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="h-10">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="mr">Mr</SelectItem>
                                      <SelectItem value="mrs">Mrs</SelectItem>
                                      <SelectItem value="miss">Miss</SelectItem>
                                      <SelectItem value="ms">Ms</SelectItem>
                                      <SelectItem value="mx">Mx</SelectItem>
                                      <SelectItem value="dr">Dr</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <div className="text-sm font-medium text-foreground">First name</div>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <div className="text-sm font-medium text-foreground">Last name</div>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <div className="text-sm font-medium text-foreground">Email address</div>
                                  <FormControl>
                                    <Input type="email" autoComplete="email" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="mobile"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <div className="text-sm font-medium text-foreground">Mobile number</div>
                                  <div className="flex gap-2">
                                    <FormField
                                      control={form.control}
                                      name="mobileCountry"
                                      render={({ field: countryField }) => (
                                        <FormItem className="w-28">
                                          <FormControl>
                                            <Select
                                              value={countryField.value ?? "gb"}
                                              onValueChange={countryField.onChange}
                                            >
                                              <SelectTrigger className="h-10 justify-start">
                                                <SelectValue
                                                  placeholder="+44"
                                                  className="flex items-center gap-1"
                                                />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="gb">
                                                  <span className="mr-1">🇬🇧</span> +44
                                                </SelectItem>
                                                <SelectItem value="ie">
                                                  <span className="mr-1">🇮🇪</span> +353
                                                </SelectItem>
                                                <SelectItem value="us">
                                                  <span className="mr-1">🇺🇸</span> +1
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                    <FormControl>
                                      <Input
                                        type="tel"
                                        autoComplete="tel"
                                        className="flex-1"
                                        {...field}
                                      />
                                    </FormControl>
                                  </div>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="landline"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <div className="text-sm font-medium text-foreground">Landline number</div>
                                  <div className="flex gap-2">
                                    <FormField
                                      control={form.control}
                                      name="landlineCountry"
                                      render={({ field: countryField }) => (
                                        <FormItem className="w-28">
                                          <FormControl>
                                            <Select
                                              value={countryField.value ?? "gb"}
                                              onValueChange={countryField.onChange}
                                            >
                                              <SelectTrigger className="h-10 justify-start">
                                                <SelectValue
                                                  placeholder="+44"
                                                  className="flex items-center gap-1"
                                                />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="gb">
                                                  <span className="mr-1">🇬🇧</span> +44
                                                </SelectItem>
                                                <SelectItem value="ie">
                                                  <span className="mr-1">🇮🇪</span> +353
                                                </SelectItem>
                                                <SelectItem value="us">
                                                  <span className="mr-1">🇺🇸</span> +1
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                    <FormControl>
                                      <Input
                                        type="tel"
                                        autoComplete="tel-local"
                                        className="flex-1"
                                        {...field}
                                      />
                                    </FormControl>
                                  </div>
                                </FormItem>
                              )}
                            />

                            <div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-foreground">Date of birth</div>
                                <div className="grid grid-cols-3 gap-2">
                                  <FormField
                                    control={form.control}
                                    name="dobDay"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            ref={dobDayRef}
                                            inputMode="numeric"
                                            placeholder="DD"
                                            className="text-center placeholder:text-center"
                                            value={field.value ?? ""}
                                            onChange={(event) => {
                                              const raw = event.target.value.replace(/\D/g, "")
                                              const next = raw.slice(0, 2)
                                              field.onChange(next)
                                              if (next.length === 2) {
                                                dobMonthRef.current?.focus()
                                              }
                                            }}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="dobMonth"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            ref={dobMonthRef}
                                            inputMode="numeric"
                                            placeholder="MM"
                                            className="text-center placeholder:text-center"
                                            value={field.value ?? ""}
                                            onChange={(event) => {
                                              const raw = event.target.value.replace(/\D/g, "")
                                              const next = raw.slice(0, 2)
                                              field.onChange(next)
                                              if (next.length === 2) {
                                                dobYearRef.current?.focus()
                                              }
                                            }}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="dobYear"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            ref={dobYearRef}
                                            inputMode="numeric"
                                            placeholder="YYYY"
                                            className="text-center placeholder:text-center"
                                            value={field.value ?? ""}
                                            onChange={(event) => {
                                              const raw = event.target.value.replace(/\D/g, "")
                                              const next = raw.slice(0, 4)
                                              field.onChange(next)
                                            }}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>

                              <FormField
                                control={form.control}
                                name="maritalStatus"
                                render={({ field }) => (
                                  <FormItem className="space-y-2">
                                    <div className="text-sm font-medium text-foreground">Marital status</div>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                      <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="divorced">Divorced</SelectItem>
                                        <SelectItem value="married">Married</SelectItem>
                                        <SelectItem value="married-common-law">Married - Common Law</SelectItem>
                                        <SelectItem value="widowed">Widowed</SelectItem>
                                        <SelectItem value="partnered-civil">Partnered - Civil</SelectItem>
                                        <SelectItem value="separated">Separated</SelectItem>
                                        <SelectItem value="single">Single</SelectItem>
                                        <SelectItem value="partnered">Partnered</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {personalSectionComplete && (
                          <div className="rounded-xl border border-border bg-white p-4">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-[#FCFCFC]">
                                  <Mailbox className="h-4 w-4 text-foreground" aria-hidden />
                                </div>
                                <div
                                  className="text-sm font-semibold text-foreground"
                                >
                                  Stay in touch with Pikl
                                </div>
                              </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Would you like to receive updates from us?
                          </p>
                          <div className="mt-4">
                            <FormField
                              control={form.control}
                              name="marketingOptIn"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                                    >
                                      <label
                                        className={cn(
                                          "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                          field.value === "yes" && "border-foreground bg-muted/40"
                                        )}
                                      >
                                        <RadioGroupItem value="yes" />
                                        <span className="text-sm">Yes</span>
                                      </label>
                                      <label
                                        className={cn(
                                          "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                          field.value === "no" && "border-foreground bg-muted/40"
                                        )}
                                      >
                                        <RadioGroupItem value="no" />
                                        <span className="text-sm">No</span>
                                      </label>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        )}

                        {marketingSectionComplete && (
                          <div className="rounded-xl border border-border bg-white p-4">
                            <div
                              className="text-sm font-semibold text-foreground"
                            >
                              Correspondence address
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="postcode"
                                render={({ field }) => (
                                  <FormItem className="space-y-2">
                                    <div className="text-sm font-medium text-foreground">Postcode</div>
                                    <FormControl>
                                      <Input
                                        autoComplete="postal-code"
                                        className="uppercase"
                                        value={field.value ?? ""}
                                        onChange={(event) => {
                                          const next = event.target.value.toUpperCase()
                                          field.onChange(next)
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <div className="flex items-end">
                                <Button type="button" variant="outline" className="w-full border-border">
                                  Find Address
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {addressSectionComplete && (
                          <div className="rounded-xl border border-border bg-white p-4">
                            <div
                              className="text-sm font-semibold text-foreground"
                            >
                              Employment information
                            </div>
                            <div className="mt-4 space-y-4">
                              <FormField
                                control={form.control}
                                name="employmentStatus"
                                render={({ field }) => (
                                  <FormItem className="space-y-2">
                                    <div className="text-sm text-foreground font-medium">
                                      What is your employment status?
                                    </div>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid grid-cols-1 gap-2 md:grid-cols-2"
                                      >
                                        {[
                                          { value: "employed", label: "Employed" },
                                          { value: "self-employed", label: "Self-employed" },
                                          { value: "retired", label: "Retired" },
                                          { value: "other", label: "Other" },
                                        ].map((opt) => (
                                          <label
                                            key={opt.value}
                                            className={cn(
                                              "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                              field.value === opt.value && "border-foreground bg-muted/40"
                                            )}
                                          >
                                            <RadioGroupItem value={opt.value} />
                                            <span className="text-sm">{opt.label}</span>
                                          </label>
                                        ))}
                                      </RadioGroup>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              {values.employmentStatus && (
                                <>
                                  <FormField
                                    control={form.control}
                                    name="mainOccupation"
                                    render={({ field }) => (
                                      <FormItem className="space-y-2">
                                        <div className="text-sm text-foreground font-medium">
                                          What is your main occupation?
                                        </div>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="businessType"
                                    render={({ field }) => (
                                      <FormItem className="space-y-2">
                                        <div className="text-sm text-foreground font-medium">
                                          What is the type of business you work in?
                                        </div>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="workPattern"
                                    render={({ field }) => (
                                      <FormItem className="space-y-2">
                                        <div className="text-sm text-foreground font-medium">
                                          You work:
                                        </div>
                                        <FormControl>
                                          <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="grid grid-cols-1 gap-2 md:grid-cols-2"
                                          >
                                            {[
                                              { value: "full-time", label: "Full time" },
                                              { value: "part-time", label: "Part time" },
                                            ].map((opt) => (
                                              <label
                                                key={opt.value}
                                                className={cn(
                                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                                  field.value === opt.value && "border-foreground bg-muted/40"
                                                )}
                                              >
                                                <RadioGroupItem value={opt.value} />
                                                <span className="text-sm">{opt.label}</span>
                                              </label>
                                            ))}
                                          </RadioGroup>
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />

                                  {values.workPattern === "part-time" && (
                                    <FormField
                                      control={form.control}
                                      name="hasAdditionalOccupation"
                                      render={({ field }) => (
                                        <FormItem className="space-y-2">
                                          <div className="text-sm text-foreground font-medium">
                                            Do you have an additional occupation?
                                          </div>
                                          <FormControl>
                                            <RadioGroup
                                              onValueChange={field.onChange}
                                              value={field.value}
                                              className="grid grid-cols-1 gap-2 md:grid-cols-2"
                                            >
                                              {[
                                                { value: "yes", label: "Yes" },
                                                { value: "no", label: "No" },
                                              ].map((opt) => (
                                                <label
                                                  key={opt.value}
                                                  className={cn(
                                                    "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                                    field.value === opt.value && "border-foreground bg-muted/40"
                                                  )}
                                                >
                                                  <RadioGroupItem value={opt.value} />
                                                  <span className="text-sm">{opt.label}</span>
                                                </label>
                                              ))}
                                            </RadioGroup>
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  )}

                                  {values.workPattern === "part-time" && values.hasAdditionalOccupation === "yes" && (
                                    <>
                                      <FormField
                                        control={form.control}
                                        name="additionalOccupation"
                                        render={({ field }) => (
                                          <FormItem className="space-y-2">
                                            <div className="flex items-center justify-between gap-3">
                                              <div className="text-sm text-foreground font-medium">
                                                What is your additional occupation?
                                              </div>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                                                    aria-label="Additional occupation help"
                                                  >
                                                    <Info className="h-4 w-4" aria-hidden />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                                                  Please type the first few letters of the occupation and we will search for the closest match. Avoid using abbreviations, jargon, and slang. If your specific occupation is not listed, please choose the closest match.
                                                </TooltipContent>
                                              </Tooltip>
                                            </div>
                                            <FormControl>
                                              <Input {...field} />
                                            </FormControl>
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name="additionalOccupationBusinessType"
                                        render={({ field }) => (
                                          <FormItem className="space-y-2">
                                            <div className="text-sm text-foreground font-medium">
                                              What type of business is your additional occupation?
                                            </div>
                                            <FormControl>
                                              <Input {...field} />
                                            </FormControl>
                                          </FormItem>
                                        )}
                                      />
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {employmentSectionComplete && (
                          <div className="rounded-xl border border-border bg-white p-4">
                            <div
                              className="text-sm font-semibold text-foreground"
                            >
                              Residents
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              How many adults normally live at the property / What is the expected average number of adults who stay at the property at any one time?
                            </p>
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="expectedAdults"
                                render={({ field }) => (
                                  <FormItem className="space-y-2 md:col-span-2">
                                    <FormControl>
                                      <Input inputMode="numeric" {...field} />
                                    </FormControl>
                                    <div className="text-xs text-muted-foreground">
                                      Please enter a minimum of 1 person
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}

                        {guestsSectionComplete && (
                          <div className="rounded-xl border border-border bg-white p-4">
                            <div
                              className="text-sm font-semibold text-foreground"
                            >
                              Claims
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Have you or anyone who normally lives with you, suffered any loss, damage or liability anywhere during the last five years, whether insured or not?
                            </p>
                            <div className="mt-4">
                              <FormField
                                control={form.control}
                                name="claimsLast5Years"
                                render={({ field }) => (
                                  <FormItem className="space-y-2">
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                                      >
                                        <label
                                          className={cn(
                                            "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                            field.value === "yes" && "border-foreground bg-muted/40"
                                          )}
                                        >
                                          <RadioGroupItem value="yes" />
                                          <span className="text-sm">Yes</span>
                                        </label>
                                        <label
                                          className={cn(
                                            "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                            field.value === "no" && "border-foreground bg-muted/40"
                                          )}
                                        >
                                          <RadioGroupItem value="no" />
                                          <span className="text-sm">No</span>
                                        </label>
                                      </RadioGroup>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              {values.claimsLast5Years === "yes" && (
                                <div className="mt-4 space-y-4">
                                  <FormField
                                    control={form.control}
                                    name="claimType"
                                    render={({ field }) => (
                                      <FormItem className="space-y-2">
                                        <div className="text-sm font-medium text-foreground">Claim type</div>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                          <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select claim type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="accidental-damage">Accidental Damage</SelectItem>
                                            <SelectItem value="accidental-loss">Accidental Loss</SelectItem>
                                            <SelectItem value="aerials-and-masts">Aerials And Masts</SelectItem>
                                            <SelectItem value="aircraft-and-other-aerial-devices">Aircraft And Other Aerial Devices</SelectItem>
                                            <SelectItem value="burst-pipes">Burst Pipes</SelectItem>
                                            <SelectItem value="escape-of-oil">Escape Of Oil</SelectItem>
                                            <SelectItem value="escape-of-water">Escape Of Water</SelectItem>
                                            <SelectItem value="explosion">Explosion</SelectItem>
                                            <SelectItem value="falling-trees">Falling Trees</SelectItem>
                                            <SelectItem value="fire">Fire</SelectItem>
                                            <SelectItem value="fire-arson">Fire (Arson)</SelectItem>
                                            <SelectItem value="flood">Flood</SelectItem>
                                            <SelectItem value="freezer-contents">Freezer Contents</SelectItem>
                                            <SelectItem value="impact">Impact</SelectItem>
                                            <SelectItem value="liability">Liability</SelectItem>
                                            <SelectItem value="lightning">Lightning</SelectItem>
                                            <SelectItem value="loss-of-currency-credit-cards">Loss of Currency/Credit Cards</SelectItem>
                                            <SelectItem value="malicious-damage">Malicious Damage</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                            <SelectItem value="personal-injury">Personal Injury</SelectItem>
                                            <SelectItem value="replacement-of-locks">Replacement Of Locks</SelectItem>
                                            <SelectItem value="riot">Riot</SelectItem>
                                            <SelectItem value="sanitary-ware">Sanitary Ware</SelectItem>
                                            <SelectItem value="smoke">Smoke</SelectItem>
                                            <SelectItem value="storm">Storm</SelectItem>
                                            <SelectItem value="subsidence-ground-heave-landslip">Subsidence, Ground Heave, Landslip</SelectItem>
                                            <SelectItem value="subterranean-fire">Subterranean Fire</SelectItem>
                                            <SelectItem value="theft-or-attempted-theft">Theft Or Attempted Theft</SelectItem>
                                            <SelectItem value="trace-and-access">Trace and Access</SelectItem>
                                            <SelectItem value="underground-services">Underground Services</SelectItem>
                                            <SelectItem value="vandalism">Vandalism</SelectItem>
                                            <SelectItem value="weight-of-snow">Weight Of Snow</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </FormItem>
                                    )}
                                  />

                                  {values.claimType && (
                                    <FormField
                                      control={form.control}
                                      name="claimSettled"
                                      render={({ field }) => (
                                        <FormItem className="space-y-2">
                                          <div className="text-sm text-foreground font-medium">
                                            Has the claim been settled?
                                          </div>
                                          <FormControl>
                                            <RadioGroup
                                              onValueChange={field.onChange}
                                              value={field.value}
                                              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                                            >
                                              <label
                                                className={cn(
                                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                                  field.value === "yes" && "border-foreground bg-muted/40"
                                                )}
                                              >
                                                <RadioGroupItem value="yes" />
                                                <span className="text-sm">Yes</span>
                                              </label>
                                              <label
                                                className={cn(
                                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                                  field.value === "no" && "border-foreground bg-muted/40"
                                                )}
                                              >
                                                <RadioGroupItem value="no" />
                                                <span className="text-sm">No</span>
                                              </label>
                                            </RadioGroup>
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {claimsSectionComplete && (
                          <div className="rounded-xl border border-border bg-white p-4">
                            <div
                              className="text-sm font-semibold text-foreground"
                            >
                              Additional policyholders
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Do you wish to add an additional policyholder?
                            </p>
                            <div className="mt-4">
                              <FormField
                                control={form.control}
                                name="additionalPolicyholders"
                                render={({ field }) => (
                                  <FormItem className="space-y-2">
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                                      >
                                        <label
                                          className={cn(
                                            "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                            field.value === "yes" && "border-foreground bg-muted/40"
                                          )}
                                        >
                                          <RadioGroupItem value="yes" />
                                          <span className="text-sm">Yes</span>
                                        </label>
                                        <label
                                          className={cn(
                                            "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                            field.value === "no" && "border-foreground bg-muted/40"
                                          )}
                                        >
                                          <RadioGroupItem value="no" />
                                          <span className="text-sm">No</span>
                                        </label>
                                      </RadioGroup>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {stepIndex === 2 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 items-stretch lg:grid-cols-2">
                          <div className="lg:col-span-2 grid grid-cols-1 gap-4 items-stretch lg:grid-cols-2">
                              <label
                                className={cn(
                                "relative flex h-full cursor-pointer flex-col gap-3 rounded-xl border border-border bg-white px-4 pt-4 pb-4 transition-colors",
                                  values.selectedProduct === "all-in-one" &&
                                    "border-foreground bg-muted/40"
                                )}
                                onClick={() => form.setValue("selectedProduct", "all-in-one")}
                              >
                                {/* Ensure selecting the whole card updates RHF value */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex flex-col items-start gap-2">
                                    <div
                                      className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg border border-border",
                                        values.selectedProduct === "all-in-one"
                                          ? "bg-[#FFFFFF]"
                                          : "bg-[#FCFCFC]"
                                      )}
                                    >
                                      <ShieldCheck className="h-5 w-5 text-foreground" aria-hidden />
                                    </div>
                                    <div className="flex flex-col">
                                      <div
                                        className="text-[18px] font-semibold text-foreground"
                                      >
                                        All-in-one
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className={cn(
                                      "rounded-full border bg-white px-3 py-1 text-xs font-medium",
                                      values.selectedProduct === "all-in-one"
                                        ? "border-border text-foreground"
                                        : "border-border text-muted-foreground"
                                    )}
                                  >
                                    Home & Host
                                  </div>
                                </div>

                                <div className="px-0 py-0 border-0 bg-transparent">
                                  <p className="text-sm leading-relaxed text-muted-foreground">
                                    All-in-one is home and host insurance that cover your building and/or
                                    contents, plus guest-related incidents.
                                  </p>

                                  <Separator className="my-4" />

                                  <ul className="mt-0 w-full space-y-2">
                                    {[
                                      "Tailor your full home insurance package",
                                      "All the great benefits of our top-up cover",
                                      "Includes additional cover for damage and theft",
                                    ].map((text) => (
                                      <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#000000]">
                                          <Check className="h-3.5 w-3.5 text-white" aria-hidden />
                                        </span>
                                        <span>{text}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <Button
                                  type="button"
                                  className={cn("mt-auto mt-4 h-10 w-full rounded-xl text-sm font-medium", values.selectedProduct === "all-in-one" ? "bg-foreground text-background hover:bg-foreground" : "border border-border bg-white text-foreground hover:bg-muted/40")}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    form.setValue("selectedProduct", "all-in-one")
                                  }}
                                >
                                  {values.selectedProduct === "all-in-one" ? "Selected Plan" : "Select Plan"}
                                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                                </Button>

                                {/* Hidden radio for accessibility */}
                                <input
                                  className="sr-only"
                                  type="radio"
                                  name="selectedProduct"
                                  checked={values.selectedProduct === "all-in-one"}
                                  onChange={() =>
                                    form.setValue("selectedProduct", "all-in-one")
                                  }
                                />
                              </label>

                              <label
                                className={cn(
                                  "relative flex h-full cursor-pointer flex-col gap-3 rounded-xl border border-border bg-white px-4 pt-4 pb-4 transition-colors",
                                  values.selectedProduct === "top-up" &&
                                    "border-foreground bg-muted/40"
                                )}
                                onClick={() => form.setValue("selectedProduct", "top-up")}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex flex-col items-start gap-2">
                                    <div
                                      className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg border border-border",
                                        values.selectedProduct === "top-up"
                                          ? "bg-[#FFFFFF]"
                                          : "bg-[#FCFCFC]"
                                      )}
                                    >
                                      <ShieldPlus className="h-5 w-5 text-foreground" aria-hidden />
                                    </div>
                                    <div className="flex flex-col">
                                      <div
                                        className="text-[18px] font-semibold text-foreground"
                                      >
                                        Top-up
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className={cn(
                                      "rounded-full border bg-white px-3 py-1 text-xs font-semibold",
                                      values.selectedProduct === "top-up"
                                        ? "border-foreground text-foreground"
                                        : "border-border text-muted-foreground"
                                    )}
                                  >
                                    Host-only
                                  </div>
                                </div>

                                <div className="px-0 py-0 border-0 bg-transparent">
                                  <p className="text-sm leading-relaxed text-muted-foreground">
                                    Top-up is host insurance that's applied to your existing home
                                    insurance to cover guest-related incidents.
                                  </p>

                                  <Separator className="my-4" />

                                  <ul className="mt-0 w-full space-y-2">
                                    {[
                                      "Flexible cover to fit your sharing needs",
                                      "Bespoke cover for guest damage and theft",
                                      "Trusted by our customers and on hand to help",
                                    ].map((text) => (
                                      <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#000000]">
                                          <Check className="h-3.5 w-3.5 text-white" aria-hidden />
                                        </span>
                                        <span>{text}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <Button
                                  type="button"
                                  className={cn("mt-auto mt-4 h-10 w-full rounded-xl text-sm font-medium", values.selectedProduct === "top-up" ? "bg-foreground text-background hover:bg-foreground" : "border border-border bg-white text-foreground hover:bg-muted/40")}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    form.setValue("selectedProduct", "top-up")
                                  }}
                                >
                                  {values.selectedProduct === "top-up" ? "Selected Plan" : "Select Plan"}
                                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                                </Button>

                                <input
                                  className="sr-only"
                                  type="radio"
                                  name="selectedProduct"
                                  checked={values.selectedProduct === "top-up"}
                                  onChange={() => form.setValue("selectedProduct", "top-up")}
                                />
                              </label>
                          </div>
                        </div>

                        {values.selectedProduct && (
                          <div className="rounded-xl border border-border bg-white p-4">
                            <div className="text-sm font-semibold text-foreground">
                              Short-term hosting
                            </div>
                            <div className="mt-3 text-sm text-muted-foreground">
                              How much short-term letting do you intend to do over the next year?
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3">
                              {[
                                { value: "more-than-90", label: "More than 90 days", price: "£99.99" },
                                { value: "90-or-fewer", label: "90 days of fewer", price: "£49.99" },
                                { value: "30-or-fewer", label: "30 days or fewer", price: "£39.99" },
                              ].map((opt) => (
                                <label
                                  key={opt.value}
                                  className={cn(
                                    "flex min-h-[46px] cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                    values.shortTermLettingDays === opt.value &&
                                      "border-foreground bg-muted/40"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <input
                                      className="h-4 w-4"
                                      type="radio"
                                      name="shortTermLettingDays"
                                      checked={values.shortTermLettingDays === opt.value}
                                      onChange={() =>
                                        form.setValue(
                                          "shortTermLettingDays",
                                          opt.value as any
                                        )
                                      }
                                      style={{ accentColor: "hsl(var(--foreground))" }}
                                    />
                                    <span className="text-sm">{opt.label}</span>
                                  </div>
                                  <span className="rounded-full border border-border bg-white px-2.5 py-1 text-xs font-medium text-foreground">
                                    {opt.price}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {stepIndex === 3 && (
                      <div className="space-y-4">
                        {/* About You */}
                        <div className="rounded-xl border border-border bg-white p-4">
                          <div className="mb-3 text-sm font-semibold text-foreground">About You</div>
                          <div className="space-y-3">
                            {[
                              {
                                key: "assumptionUkResident",
                                text: "You are a UK or Isle of Man resident (this does not include the Channel Islands)",
                              },
                              {
                                key: "assumptionPropertyOwnerResponsibility",
                                text: "You are the property owner or have a legal responsibility for the property",
                              },
                              {
                                key: "assumptionSixMonthAst",
                                text: "You already have a 6-month AST or will within the next 30 days",
                              },
                              {
                                key: "assumptionNoCancelledInsurance",
                                text: "You, or anyone that permanently resides with you have never had insurance cancelled, refused, declined, voided or conditions imposed",
                              },
                              {
                                key: "assumptionNoBankruptcy",
                                text: "You have never been bankrupt, or been subject to bankruptcy proceedings, CCJ, IVA's, or had arrangements with creditors",
                              },
                              {
                                key: "assumptionNoExcessClaims",
                                text: "You, or anyone that permanently resides with you have not had more than 2 property insurance or host insurance claims in the last 12 months or over 3 in the last 5 years",
                              },
                              {
                                key: "assumptionNoCriminalOffences",
                                text: "You or anyone that permanently resides with you have never been cautioned for, convicted of, charged with but not yet tried for any criminal offences other than spent convictions and motoring offences",
                              },
                            ].map((q) => (
                              <div
                                key={q.key}
                                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-white px-4 py-3"
                              >
                                <p className="text-sm text-muted-foreground">{q.text}</p>
                                <TrueFalseToggle
                                  value={(values as any)[q.key] as boolean | undefined}
                                  onChange={(v) => form.setValue(q.key as any, v)}
                                  defaultToTrue
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* About your Property */}
                        <div className="rounded-xl border border-border bg-white p-4">
                          <div className="mb-3 text-sm font-semibold text-foreground">
                            About Your Property
                          </div>
                          <div className="space-y-3">
                            {[
                              {
                                key: "assumptionPropertyGoodRepair",
                                text: "The property is a residential property, is in a good state of repair and is not undergoing renovation",
                              },
                              {
                                key: "assumptionNoThatchedRoof",
                                text: "The property does not have a thatched (or part thatched) roof",
                              },
                              {
                                key: "assumptionNoFlooding",
                                text: "The property is FREE from signs of flooding and has no history of damage from flooding (from sea, river, or rain)",
                              },
                              {
                                key: "assumptionNoSubsidenceHeaveLandslip",
                                text: "The property is FREE from signs of damage and has no history of damage from subsidence, heave or landslip",
                              },
                            ].map((q) => (
                              <div
                                key={q.key}
                                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-white px-4 py-3"
                              >
                                <p className="text-sm text-muted-foreground">{q.text}</p>
                                <TrueFalseToggle
                                  value={(values as any)[q.key] as boolean | undefined}
                                  onChange={(v) => form.setValue(q.key as any, v)}
                                  defaultToTrue
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* About your Hosting / Short term letting */}
                        <div className="rounded-xl border border-border bg-white p-4">
                          <div className="mb-3 text-sm font-semibold text-foreground">
                            About your Hosting / Short term Letting
                          </div>
                          <div className="space-y-3">
                            {[
                              {
                                key: "assumptionLessThan20People",
                                text: "You have less than 20 people (10 adults / 10 children) staying in your property at any one time",
                              },
                              {
                                key: "assumptionCompliesWithLocalAuthority",
                                text: "You are operating your let in compliance with any local authority regulations, laws and within any relevant permissions or statutory conditions that may exist",
                              },
                              {
                                key: "assumptionPermissionToAccessHistory",
                                text: "You agree to provide and/or give us permission to access your letting history including with the sharing platform(s) if applicable",
                              },
                            ].map((q) => (
                              <div
                                key={q.key}
                                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-white px-4 py-3"
                              >
                                <p className="text-sm text-muted-foreground">{q.text}</p>
                                <TrueFalseToggle
                                  value={(values as any)[q.key] as boolean | undefined}
                                  onChange={(v) => form.setValue(q.key as any, v)}
                                  defaultToTrue
                                />
                              </div>
                            ))}
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-3">
                              <input
                                type="checkbox"
                                checked={values.assumptionNoFalseStatements === true}
                                onChange={(e) =>
                                  form.setValue(
                                    "assumptionNoFalseStatements",
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 rounded-xl border-border"
                                aria-label="Tick to confirm there are no false statements"
                                style={{ accentColor: "hsl(var(--purchase))" }}
                              />
                              <span className="text-sm text-muted-foreground">
                                Tick here to confirm there are no false statements
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {stepIndex === 4 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">Property type</div>
                          <div className="grid grid-cols-1 gap-3">
                            {[
                              { value: "flat", label: "Flat" },
                              { value: "house", label: "House" },
                              { value: "townhouse", label: "Townhouse" },
                              { value: "bungalow", label: "Bungalow" },
                              { value: "other", label: "Other" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                  values.propertyType === opt.value && "border-foreground bg-muted/40"
                                )}
                              >
                                <input
                                  className="h-4 w-4"
                                  type="radio"
                                  name="propertyType"
                                  checked={values.propertyType === opt.value}
                                    onChange={() => {
                                      form.setValue("propertyType", opt.value as any)
                                      form.setValue("propertyDescription", undefined)
                                      form.setValue("propertyListed", undefined)
                                      form.setValue("propertyRoofFlatPercentage", undefined)
                                      form.setValue("propertyWallMaterial", undefined)
                                      form.setValue("propertyRoofMaterial", undefined)
                                      form.setValue("propertyBedrooms", "")
                                      form.setValue("propertyBathrooms", "")
                                      form.setValue("propertyTotalRooms", "")
                                      form.setValue("propertyFloors", "")
                                      form.setValue("propertyYearBuilt", "")
                                      form.setValue("propertyOwnLockableFinalDoors", undefined)
                                      form.setValue("propertyApprovedLocksFinalDoors", undefined)
                                      form.setValue("propertyHasPatioOrFrenchDoors", undefined)
                                      form.setValue("propertyPatioOrFrenchDoorsApprovedLocks", undefined)
                                      form.setValue("propertyHasKeyOperatedWindowLocks", undefined)
                                      form.setValue("propertyHasIntruderAlarm", undefined)
                                      form.setValue("propertyIntruderAlarmType", undefined)
                                      form.setValue("propertyFirePrecautions", [])
                                      form.setValue("propertyOccupiedNightHours", undefined)
                                      form.setValue("propertyUnoccupied", undefined)
                                    }}
                                  style={{ accentColor: "hsl(var(--foreground))" }}
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {showStep5PropertyDescription && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">
                            Select the best description of your property:
                          </div>
                          <Select
                            value={values.propertyDescription}
                            onValueChange={(v) => form.setValue("propertyDescription", v as any)}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select property description" />
                            </SelectTrigger>
                            <SelectContent>
                              {values.propertyType === "flat" ? (
                                <>
                                  <SelectItem value="flat">Flat</SelectItem>
                                  <SelectItem value="apartment">Apartment</SelectItem>
                                </>
                              ) : values.propertyType === "other" ? (
                                <SelectItem value="other">Other</SelectItem>
                              ) : (
                                <>
                                  <SelectItem value={`detached-${propertyTypeDescriptionSuffix}`}>
                                    Detached {propertyTypeDescriptionSuffix}
                                  </SelectItem>
                                  <SelectItem value={`semi-detached-${propertyTypeDescriptionSuffix}`}>
                                    Semi-detached {propertyTypeDescriptionSuffix}
                                  </SelectItem>
                                  <SelectItem value={`mid-terraced-${propertyTypeDescriptionSuffix}`}>
                                    Mid-terraced {propertyTypeDescriptionSuffix}
                                  </SelectItem>
                                  <SelectItem value={`end-terraced-${propertyTypeDescriptionSuffix}`}>
                                    End-terraced {propertyTypeDescriptionSuffix}
                                  </SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        )}

                        {showStep5PropertyListed && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">Is your property listed?</div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                  values.propertyListed === opt.value && "border-foreground bg-muted/40"
                                )}
                              >
                                <input
                                  className="h-4 w-4"
                                  type="radio"
                                  name="propertyListed"
                                  checked={values.propertyListed === opt.value}
                                  onChange={() => form.setValue("propertyListed", opt.value as any)}
                                  style={{ accentColor: "hsl(var(--foreground))" }}
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}

                        {showStep5RoofFlatPercentage && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="What percentage of your roof is flat?" />
                          <Select
                            value={values.propertyRoofFlatPercentage}
                            onValueChange={(v) => form.setValue("propertyRoofFlatPercentage", v as any)}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select roof flat percentage" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="10">10%</SelectItem>
                              <SelectItem value="20">20%</SelectItem>
                              <SelectItem value="30">30%</SelectItem>
                              <SelectItem value="40">40%</SelectItem>
                              <SelectItem value="50">50%</SelectItem>
                              <SelectItem value="60">60%</SelectItem>
                              <SelectItem value="70">70%</SelectItem>
                              <SelectItem value="80">80%</SelectItem>
                              <SelectItem value="90">90%</SelectItem>
                              <SelectItem value="100">100%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        )}

                        {showStep5WallMaterial && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="What material are the walls mainly built of?" />
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              { value: "brick", label: "Brick" },
                              { value: "stone", label: "Stone" },
                              { value: "concrete", label: "Concrete" },
                              { value: "other", label: "Other" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "overflow-hidden rounded-xl border border-border bg-white hover:bg-muted/40",
                                  values.propertyWallMaterial === opt.value && "border-foreground bg-muted/40"
                                )}
                              >
                                <div className="flex h-36 items-center justify-center border-b border-border bg-[#E5E7EB]">
                                  <ImageIcon className="h-7 w-7 text-muted-foreground" aria-hidden />
                                </div>
                                <div className="flex cursor-pointer items-center gap-3 px-4 py-3">
                                  <input
                                    className="h-4 w-4"
                                    type="radio"
                                    name="propertyWallMaterial"
                                    checked={values.propertyWallMaterial === opt.value}
                                    onChange={() => form.setValue("propertyWallMaterial", opt.value as any)}
                                    style={{ accentColor: "hsl(var(--foreground))" }}
                                  />
                                  <span className="text-sm">{opt.label}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}

                        {showStep5RoofMaterial && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="What material is the roof mainly built of?" />
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              { value: "tile", label: "Tile" },
                              { value: "slate", label: "Slate" },
                              { value: "concrete", label: "Concrete" },
                              { value: "other", label: "Other" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "overflow-hidden rounded-xl border border-border bg-white hover:bg-muted/40",
                                  values.propertyRoofMaterial === opt.value && "border-foreground bg-muted/40"
                                )}
                              >
                                <div className="flex h-36 items-center justify-center border-b border-border bg-[#E5E7EB]">
                                  <ImageIcon className="h-7 w-7 text-muted-foreground" aria-hidden />
                                </div>
                                <div className="flex cursor-pointer items-center gap-3 px-4 py-3">
                                  <input
                                    className="h-4 w-4"
                                    type="radio"
                                    name="propertyRoofMaterial"
                                    checked={values.propertyRoofMaterial === opt.value}
                                    onChange={() => form.setValue("propertyRoofMaterial", opt.value as any)}
                                    style={{ accentColor: "hsl(var(--foreground))" }}
                                  />
                                  <span className="text-sm">{opt.label}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}

                        {showStep5Bedrooms && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="Number of bedrooms" />
                          <Input
                            value={values.propertyBedrooms ?? ""}
                            onChange={(e) => form.setValue("propertyBedrooms", e.target.value)}
                            className="h-10"
                            inputMode="numeric"
                            placeholder="e.g. 2"
                          />
                        </div>
                        )}

                        {showStep5Bathrooms && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="Number of bathrooms" />
                          <Input
                            value={values.propertyBathrooms ?? ""}
                            onChange={(e) => form.setValue("propertyBathrooms", e.target.value)}
                            className="h-10"
                            inputMode="numeric"
                            placeholder="e.g. 1"
                          />
                        </div>
                        )}

                        {showStep5TotalRooms && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="Total number of rooms" />
                          <Input
                            value={values.propertyTotalRooms ?? ""}
                            onChange={(e) => form.setValue("propertyTotalRooms", e.target.value)}
                            className="h-10"
                            inputMode="numeric"
                            placeholder="e.g. 5"
                          />
                        </div>
                        )}

                        {showStep5Floors && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">Number of floors</div>
                          <Input
                            value={values.propertyFloors ?? ""}
                            onChange={(e) => form.setValue("propertyFloors", e.target.value)}
                            className="h-10"
                            inputMode="numeric"
                            placeholder="e.g. 1"
                          />
                        </div>
                        )}

                        {showStep5YearBuilt && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="To the best of your knowledge, in what year was the property built?" />
                          <Input
                            value={values.propertyYearBuilt ?? ""}
                            onChange={(e) => form.setValue("propertyYearBuilt", e.target.value)}
                            className="h-10"
                            inputMode="numeric"
                            placeholder="e.g. 2025"
                          />
                        </div>
                        )}

                        {showStep5OwnLockableDoors && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">
                            Does the property have its own lockable front, back, and any other final exit doors?
                          </div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                  values.propertyOwnLockableFinalDoors === opt.value && "border-foreground bg-muted/40"
                                )}
                              >
                                <input
                                  className="h-4 w-4"
                                  type="radio"
                                  name="propertyOwnLockableFinalDoors"
                                  checked={values.propertyOwnLockableFinalDoors === opt.value}
                                  onChange={() => form.setValue("propertyOwnLockableFinalDoors", opt.value as any)}
                                  style={{ accentColor: "hsl(var(--foreground))" }}
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}

                        {showStep5ApprovedLocksFinalDoors && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="Does the property have approved locks on all final exit doors?" />
                          <p className="text-xs italic text-muted-foreground">
                            What do we mean by approved locks? Click on the info button to learn more.
                          </p>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                  values.propertyApprovedLocksFinalDoors === opt.value && "border-foreground bg-muted/40"
                                )}
                              >
                                <input
                                  className="h-4 w-4"
                                  type="radio"
                                  name="propertyApprovedLocksFinalDoors"
                                  checked={values.propertyApprovedLocksFinalDoors === opt.value}
                                  onChange={() => form.setValue("propertyApprovedLocksFinalDoors", opt.value as any)}
                                  style={{ accentColor: "hsl(var(--foreground))" }}
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}

                        {showStep5PatioFrenchDoors && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="Does the property have patio or french doors?" />
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                  values.propertyHasPatioOrFrenchDoors === opt.value && "border-foreground bg-muted/40"
                                )}
                              >
                                <input
                                  className="h-4 w-4"
                                  type="radio"
                                  name="propertyHasPatioOrFrenchDoors"
                                  checked={values.propertyHasPatioOrFrenchDoors === opt.value}
                                  onChange={() => form.setValue("propertyHasPatioOrFrenchDoors", opt.value as any)}
                                  style={{ accentColor: "hsl(var(--foreground))" }}
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}

                        {showStep5PatioFrenchDoorsApprovedLocks && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="Do the patio or french doors have approved locks?" />
                          <p className="text-xs italic text-muted-foreground">
                            What do we mean by approved locks? Click on the info button to learn more.
                          </p>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                  values.propertyPatioOrFrenchDoorsApprovedLocks === opt.value &&
                                    "border-foreground bg-muted/40"
                                )}
                              >
                                <input
                                  className="h-4 w-4"
                                  type="radio"
                                  name="propertyPatioOrFrenchDoorsApprovedLocks"
                                  checked={values.propertyPatioOrFrenchDoorsApprovedLocks === opt.value}
                                  onChange={() =>
                                    form.setValue("propertyPatioOrFrenchDoorsApprovedLocks", opt.value as any)
                                  }
                                  style={{ accentColor: "hsl(var(--foreground))" }}
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}

                        {showStep5KeyOperatedWindowLocks && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="Are there key operated locks on all accessible windows?" />
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                  values.propertyHasKeyOperatedWindowLocks === opt.value &&
                                    "border-foreground bg-muted/40"
                                )}
                              >
                                <input
                                  className="h-4 w-4"
                                  type="radio"
                                  name="propertyHasKeyOperatedWindowLocks"
                                  checked={values.propertyHasKeyOperatedWindowLocks === opt.value}
                                  onChange={() => form.setValue("propertyHasKeyOperatedWindowLocks", opt.value as any)}
                                  style={{ accentColor: "hsl(var(--foreground))" }}
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}

                        {showStep5IntruderAlarm && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">Is the property fitted with an intruder alarm?</div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                  values.propertyHasIntruderAlarm === opt.value && "border-foreground bg-muted/40"
                                )}
                              >
                                <input
                                  className="h-4 w-4"
                                  type="radio"
                                  name="propertyHasIntruderAlarm"
                                  checked={values.propertyHasIntruderAlarm === opt.value}
                                  onChange={() => form.setValue("propertyHasIntruderAlarm", opt.value as any)}
                                  style={{ accentColor: "hsl(var(--foreground))" }}
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}

                        {showStep5IntruderAlarmType && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">What type of intruder alarm is fitted?</div>
                          <Select
                            value={values.propertyIntruderAlarmType}
                            onValueChange={(v) => form.setValue("propertyIntruderAlarmType", v as any)}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select alarm type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="audible-only">Audible Only</SelectItem>
                              <SelectItem value="bt-abc">BT ABC</SelectItem>
                              <SelectItem value="bt-redcare">BT Redcare</SelectItem>
                              <SelectItem value="central-station-direct-line">Central Station Direct Line</SelectItem>
                              <SelectItem value="nacoss-ssaib">NACOSS/SSAIB</SelectItem>
                              <SelectItem value="packnet">Packnet</SelectItem>
                              <SelectItem value="not-covered">Not Covered By Any Other Item On The List</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        )}

                        {showStep5FirePrecautions && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">What fire precautions do you have in place?</div>
                          <p className="text-xs italic text-muted-foreground">Please select all that apply</p>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              { value: "smoke-alarm", label: "Smoke Alarm" },
                              { value: "automatic-fire-alarm", label: "Automatic Fire Alarm" },
                              { value: "fire-blanket", label: "Fire Blanket" },
                              { value: "fire-extinguisher", label: "Fire Extinguisher" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                  (values.propertyFirePrecautions ?? []).includes(opt.value) &&
                                    "border-foreground bg-muted/40"
                                )}
                              >
                                <input
                                  className="h-4 w-4"
                                  type="checkbox"
                                  name="propertyFirePrecautions"
                                  checked={(values.propertyFirePrecautions ?? []).includes(opt.value)}
                                  onChange={(e) => {
                                    const current = values.propertyFirePrecautions ?? []
                                    const next = e.target.checked
                                      ? [...current, opt.value]
                                      : current.filter((v) => v !== opt.value)
                                    form.setValue("propertyFirePrecautions", next)
                                  }}
                                  style={{ accentColor: "hsl(var(--foreground))" }}
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}

                        {showStep5OccupiedNightHours && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">Is the property occupied during night hours?</div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                  values.propertyOccupiedNightHours === opt.value && "border-foreground bg-muted/40"
                                )}
                              >
                                <input
                                  className="h-4 w-4"
                                  type="radio"
                                  name="propertyOccupiedNightHours"
                                  checked={values.propertyOccupiedNightHours === opt.value}
                                  onChange={() => form.setValue("propertyOccupiedNightHours", opt.value as any)}
                                  style={{ accentColor: "hsl(var(--foreground))" }}
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}

                        {showStep5Unoccupied && (
                        <div className="space-y-2">
                          <InlineLabelWithInfo label="Is the property left unoccupied at any time?" />
                          <div className="grid grid-cols-1 gap-3">
                            {[
                              { value: "never", label: "Never" },
                              { value: "up-to-30", label: "Up to 30 days in a row each year" },
                              { value: "up-to-60", label: "Up to 60 days in a row each year" },
                              { value: "over-60", label: "Over 60 days in a row each year" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                  values.propertyUnoccupied === opt.value && "border-foreground bg-muted/40"
                                )}
                              >
                                <input
                                  className="h-4 w-4"
                                  type="radio"
                                  name="propertyUnoccupied"
                                  checked={values.propertyUnoccupied === opt.value}
                                  onChange={() => form.setValue("propertyUnoccupied", opt.value as any)}
                                  style={{ accentColor: "hsl(var(--foreground))" }}
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        )}
                      </div>
                    )}

                    {stepIndex === 5 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">What date would you like your cover to start?</div>
                          <div className="relative">
                            <input
                              ref={coverDateInputRef}
                              type="date"
                              value={values.coverStartDate ?? ""}
                              onChange={(e) => form.setValue("coverStartDate", e.target.value)}
                              className="sr-only"
                              aria-hidden
                              tabIndex={-1}
                            />
                            <Input
                              type="text"
                              readOnly
                              value={coverStartDateDisplay}
                              onClick={openCoverDatePicker}
                              placeholder="dd/mm/yyyy"
                              className="h-10 cursor-pointer pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              onClick={openCoverDatePicker}
                              aria-label="Choose cover start date"
                            >
                              <CalendarDays className="h-5 w-5" aria-hidden />
                            </Button>
                          </div>
                        </div>

                        {showStep6CoverType && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-foreground">What type of cover do you require?</div>
                            <div className="grid grid-cols-1 gap-3">
                              {[
                                { value: "buildings", label: "Buildings" },
                                { value: "buildings-contents", label: "Buildings & contents" },
                                { value: "contents", label: "Contents" },
                              ].map((opt) => (
                                <label
                                  key={opt.value}
                                  className={cn(
                                    "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                    values.coverType === opt.value && "border-foreground bg-muted/40"
                                  )}
                                >
                                  <input
                                    className="h-4 w-4"
                                    type="radio"
                                    name="coverType"
                                    checked={values.coverType === opt.value}
                                    onChange={() => form.setValue("coverType", opt.value as any)}
                                    style={{ accentColor: "hsl(var(--foreground))" }}
                                  />
                                  <span className="text-sm">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {showStep6BuildingsSection && (
                          <div className="space-y-4 border-t border-border pt-6">
                            <div className="text-[18px] font-semibold text-foreground">Buildings</div>
                            <div className="space-y-3">
                              <InlineLabelWithInfo label="What is the rebuild cost of your property?" />
                              <p className="text-sm text-muted-foreground">
                                With the help of RICS (Royal Institution of Chartered Surveyors), based on your property&apos;s size and location, we have estimated the rebuild cost to be approximately 292,000. Rebuild costs do not include the value of the land and are generally lower than the property&apos;s market value.
                              </p>
                              <div className="grid grid-cols-1 gap-3">
                                {[
                                  { value: "163000", label: "£163,000", badge: "Lower" },
                                  { value: "292000", label: "£292,000", badge: "Estimated" },
                                  { value: "500000", label: "£500,000", badge: "Higher" },
                                  { value: "custom", label: "Enter custom amount", badge: "" },
                                ].map((opt) => (
                                  <label
                                    key={opt.value}
                                    className={cn(
                                      "flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40",
                                      values.buildingsRebuildBand === opt.value && "border-foreground bg-muted/40"
                                    )}
                                  >
                                    <input
                                      className="h-4 w-4"
                                      type="radio"
                                      name="buildingsRebuildBand"
                                      checked={values.buildingsRebuildBand === opt.value}
                                      onChange={() => form.setValue("buildingsRebuildBand", opt.value as any)}
                                      style={{ accentColor: "hsl(var(--foreground))" }}
                                    />
                                    <span className="text-sm">{opt.label}</span>
                                    {opt.badge && (
                                      <span className="rounded-full border border-border bg-white px-2 py-0.5 text-[11px] text-muted-foreground">
                                        {opt.badge}
                                      </span>
                                    )}
                                  </label>
                                ))}
                              </div>
                              {values.buildingsRebuildBand === "custom" && (
                                <Input
                                  value={values.buildingsCustomAmount ?? ""}
                                  onChange={(e) => form.setValue("buildingsCustomAmount", e.target.value)}
                                  className="h-10"
                                  placeholder="£ Enter custom amount"
                                />
                              )}
                            </div>

                            {showStep6BuildingsAccidentalDamage && (
                              <div className="space-y-2">
                                <InlineLabelWithInfo label="Would you like to add cover for your buildings for accidental damage caused by you or any family members permanently living with you?" />
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  {[
                                    { value: "yes-add", label: "Yes, add" },
                                    { value: "decide-later", label: "No, I'll decide later" },
                                  ].map((opt) => (
                                    <label key={opt.value} className={cn("flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40", values.buildingsAccidentalDamage === opt.value && "border-foreground bg-muted/40")}>
                                      <input className="h-4 w-4" type="radio" name="buildingsAccidentalDamage" checked={values.buildingsAccidentalDamage === opt.value} onChange={() => form.setValue("buildingsAccidentalDamage", opt.value as any)} style={{ accentColor: "hsl(var(--foreground))" }} />
                                      <span className="text-sm">{opt.label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}

                        

                            {showStep6BuildingsNoClaims && (
                              <div className="space-y-2">
                                <InlineLabelWithInfo label="How many years no claims discount do you currently have on your buildings?" />
                                <Input value={values.buildingsNoClaimsDiscount ?? ""} onChange={(e) => form.setValue("buildingsNoClaimsDiscount", e.target.value)} className="h-10" />
                              </div>
                            )}
                          </div>
                        )}

                        {showStep6ContentsSection && (
                          <div className="space-y-4 border-t border-border pt-6">
                            <div className="text-[18px] font-semibold text-foreground">Contents</div>

                            <div className="space-y-2">
                              <InlineLabelWithInfo label="Do you have any items over £1,500 that you need to specify - to cover inside or when temporarily away from the home?" />
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {["yes", "no"].map((opt) => (
                                  <label key={opt} className={cn("flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40", values.contentsItemsOver1500 === opt && "border-foreground bg-muted/40")}>
                                    <input className="h-4 w-4" type="radio" name="contentsItemsOver1500" checked={values.contentsItemsOver1500 === opt} onChange={() => form.setValue("contentsItemsOver1500", opt as any)} style={{ accentColor: "hsl(var(--foreground))" }} />
                                    <span className="text-sm">{opt === "yes" ? "Yes" : "No"}</span>
                                  </label>
                                ))}
                              </div>
                              {values.contentsItemsOver1500 === "yes" && (
                                <div className="space-y-3">
                                  <div className="overflow-hidden rounded-xl border border-border">
                                    <div className="border-b border-border bg-muted/50 px-4 py-2 text-sm font-semibold text-foreground">Item 1</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                      <div className="space-y-2 border-b border-border bg-white p-4 md:border-r">
                                        <div className="text-sm font-medium text-foreground">Category</div>
                                        <Select
                                          value={values.contentsItemCategory}
                                          onValueChange={(v) => form.setValue("contentsItemCategory", v)}
                                        >
                                          <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="jewellery">Jewellery</SelectItem>
                                            <SelectItem value="electronics">Electronics</SelectItem>
                                            <SelectItem value="art">Art</SelectItem>
                                            <SelectItem value="collectables">Collectables</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2 border-b border-border bg-[#FFFFFF] p-4">
                                        <div className="text-sm font-medium text-foreground">Item Description</div>
                                        <Input
                                          value={values.contentsItemDescription ?? ""}
                                          onChange={(e) => form.setValue("contentsItemDescription", e.target.value)}
                                          className="h-10"
                                        />
                                      </div>
                                      <div className="space-y-2 border-b border-border bg-white p-4 md:border-b-0 md:border-r">
                                        <div className="text-sm font-medium text-foreground">Item Value</div>
                                        <Input
                                          value={values.contentsItemValue ?? ""}
                                          onChange={(e) =>
                                            form.setValue("contentsItemValue", formatMoneyInput(e.target.value))
                                          }
                                          className="h-10"
                                          placeholder="£"
                                        />
                                      </div>
                                      <div className="space-y-2 bg-[#FFFFFF] p-4">
                                        <div className="text-sm font-medium text-foreground">Cover Type</div>
                                        <Select
                                          value={values.contentsItemCoverType}
                                          onValueChange={(v) => form.setValue("contentsItemCoverType", v as any)}
                                        >
                                          <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select cover type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="inside-home-only">Inside home only</SelectItem>
                                            <SelectItem value="inside-and-outside-home">Inside and outside of home</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                  {additionalItems.map((item, idx) => (
                                    <div key={`extra-item-${idx}`} className="overflow-hidden rounded-xl border border-border">
                                      <div className="border-b border-border bg-muted/50 px-4 py-2 text-sm font-semibold text-foreground">
                                        Item {idx + 2}
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="space-y-2 border-b border-border bg-white p-4 md:border-r">
                                          <div className="text-sm font-medium text-foreground">Category</div>
                                          <Input value={item.category} onChange={(e) => updateAdditionalItem(idx, { category: e.target.value })} className="h-10" />
                                        </div>
                                        <div className="space-y-2 border-b border-border bg-[#FFFFFF] p-4">
                                          <div className="text-sm font-medium text-foreground">Item Description</div>
                                          <Input value={item.description} onChange={(e) => updateAdditionalItem(idx, { description: e.target.value })} className="h-10" />
                                        </div>
                                        <div className="space-y-2 border-b border-border bg-white p-4 md:border-b-0 md:border-r">
                                          <div className="text-sm font-medium text-foreground">Item Value</div>
                                          <Input
                                            value={item.value}
                                            onChange={(e) =>
                                              updateAdditionalItem(idx, { value: formatMoneyInput(e.target.value) })
                                            }
                                            className="h-10"
                                            placeholder="£"
                                          />
                                        </div>
                                        <div className="space-y-2 bg-[#FFFFFF] p-4">
                                          <div className="text-sm font-medium text-foreground">Cover Type</div>
                                          <Select
                                            value={item.coverType}
                                            onValueChange={(v) => updateAdditionalItem(idx, { coverType: v })}
                                          >
                                            <SelectTrigger className="h-10">
                                              <SelectValue placeholder="Select cover type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="inside-home-only">Inside home only</SelectItem>
                                              <SelectItem value="inside-and-outside-home">Inside and outside of home</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-9"
                                    onClick={() =>
                                      setAdditionalItems((prev) => [
                                        ...prev,
                                        { category: "", description: "", value: "", coverType: "" },
                                      ])
                                    }
                                  >
                                    Add another item
                                  </Button>
                                </div>
                              )}
                            </div>

                            {showStep6ContentsBicycles && (
                              <div className="space-y-2">
                                <InlineLabelWithInfo label="Would you like to cover any bicycles worth over £300?" />
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  {["yes", "no"].map((opt) => (
                                    <label key={opt} className={cn("flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40", values.contentsBicyclesOver300 === opt && "border-foreground bg-muted/40")}>
                                      <input className="h-4 w-4" type="radio" name="contentsBicyclesOver300" checked={values.contentsBicyclesOver300 === opt} onChange={() => form.setValue("contentsBicyclesOver300", opt as any)} style={{ accentColor: "hsl(var(--foreground))" }} />
                                      <span className="text-sm">{opt === "yes" ? "Yes" : "No"}</span>
                                    </label>
                                  ))}
                                </div>
                                {values.contentsBicyclesOver300 === "yes" && (
                                  <div className="space-y-3">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                      <div className="border-b border-border bg-muted/50 px-4 py-2 text-sm font-semibold text-foreground">Bike 1</div>
                                      <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="space-y-2 border-b border-border bg-white p-4 md:border-r">
                                          <div className="text-sm font-medium text-foreground">Bicycle Value</div>
                                          <Input
                                            value={values.bicycleValue ?? ""}
                                            onChange={(e) =>
                                              form.setValue("bicycleValue", formatMoneyInput(e.target.value))
                                            }
                                            className="h-10"
                                            placeholder="£"
                                          />
                                        </div>
                                        <div className="space-y-2 border-b border-border bg-[#FFFFFF] p-4">
                                          <div className="text-sm font-medium text-foreground">Bicycle Make</div>
                                          <Input
                                            value={values.bicycleMake ?? ""}
                                            onChange={(e) => form.setValue("bicycleMake", e.target.value)}
                                            className="h-10"
                                          />
                                        </div>
                                        <div className="space-y-2 border-b border-border bg-white p-4 md:border-b-0 md:border-r">
                                          <div className="text-sm font-medium text-foreground">Bicycle Model</div>
                                          <Input
                                            value={values.bicycleModel ?? ""}
                                            onChange={(e) => form.setValue("bicycleModel", e.target.value)}
                                            className="h-10"
                                          />
                                        </div>
                                        <div className="space-y-2 bg-[#FFFFFF] p-4">
                                          <div className="text-sm font-medium text-foreground">Where will you be riding?</div>
                                          <Select
                                            value={values.bicycleRidingArea}
                                            onValueChange={(v) => form.setValue("bicycleRidingArea", v as any)}
                                          >
                                            <SelectTrigger className="h-10">
                                              <SelectValue placeholder="Select where" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="uk-only">UK only</SelectItem>
                                              <SelectItem value="worldwide">Worldwide</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </div>
                                    {additionalBikes.map((bike, idx) => (
                                      <div key={`extra-bike-${idx}`} className="overflow-hidden rounded-xl border border-border">
                                        <div className="border-b border-border bg-muted/50 px-4 py-2 text-sm font-semibold text-foreground">
                                          Bike {idx + 2}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2">
                                          <div className="space-y-2 border-b border-border bg-white p-4 md:border-r">
                                            <div className="text-sm font-medium text-foreground">Bicycle Value</div>
                                            <Input
                                              value={bike.value}
                                              onChange={(e) =>
                                                updateAdditionalBike(idx, {
                                                  value: formatMoneyInput(e.target.value),
                                                })
                                              }
                                              className="h-10"
                                              placeholder="£"
                                            />
                                          </div>
                                          <div className="space-y-2 border-b border-border bg-[#FFFFFF] p-4">
                                            <div className="text-sm font-medium text-foreground">Bicycle Make</div>
                                            <Input value={bike.make} onChange={(e) => updateAdditionalBike(idx, { make: e.target.value })} className="h-10" />
                                          </div>
                                          <div className="space-y-2 border-b border-border bg-white p-4 md:border-b-0 md:border-r">
                                            <div className="text-sm font-medium text-foreground">Bicycle Model</div>
                                            <Input value={bike.model} onChange={(e) => updateAdditionalBike(idx, { model: e.target.value })} className="h-10" />
                                          </div>
                                          <div className="space-y-2 bg-[#FFFFFF] p-4">
                                            <div className="text-sm font-medium text-foreground">Where will you be riding?</div>
                                            <Select
                                              value={bike.ridingArea}
                                              onValueChange={(v) => updateAdditionalBike(idx, { ridingArea: v })}
                                            >
                                              <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Select where" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="uk-only">UK only</SelectItem>
                                                <SelectItem value="worldwide">Worldwide</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="h-9"
                                      onClick={() =>
                                        setAdditionalBikes((prev) => [
                                          ...prev,
                                          { value: "", make: "", model: "", ridingArea: "" },
                                        ])
                                      }
                                    >
                                      Add another bike
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}

                            {showStep6ContentsOtherValue && (
                              <div className="space-y-2">
                                <InlineLabelWithInfo label="What is the value of all the other contents in your property that you haven't already told us about?" />
                                <Input
                                  value={values.contentsOtherValue ?? ""}
                                  onChange={(e) =>
                                    form.setValue("contentsOtherValue", formatMoneyInput(e.target.value))
                                  }
                                  className="h-10"
                                  placeholder="£ 7000"
                                />
                              </div>
                            )}

                            {showStep6ContentsAccidentalDamage && (
                              <div className="space-y-2">
                                <InlineLabelWithInfo label="Would you like to add cover for your contents for accidental damage caused by you or any family members permanently living with you?" />
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  {[
                                    { value: "yes-add", label: "Yes, add" },
                                    { value: "decide-later", label: "No, I'll decide later" },
                                  ].map((opt) => (
                                    <label key={opt.value} className={cn("flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40", values.contentsAccidentalDamage === opt.value && "border-foreground bg-muted/40")}>
                                      <input className="h-4 w-4" type="radio" name="contentsAccidentalDamage" checked={values.contentsAccidentalDamage === opt.value} onChange={() => form.setValue("contentsAccidentalDamage", opt.value as any)} style={{ accentColor: "hsl(var(--foreground))" }} />
                                      <span className="text-sm">{opt.label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}

                            {showStep6ContentsYearsInsured && (
                              <div className="space-y-2">
                                <InlineLabelWithInfo label="How many years have you continuously held home contents insurance in your name?" />
                                <Input value={values.contentsYearsInsured ?? ""} onChange={(e) => form.setValue("contentsYearsInsured", e.target.value)} className="h-10" />
                              </div>
                            )}

                            {showStep6ContentsNoClaims && (
                              <div className="space-y-2">
                                <InlineLabelWithInfo label="How many years no claims discount do you have on contents?" />
                                <Input value={values.contentsNoClaimsDiscount ?? ""} onChange={(e) => form.setValue("contentsNoClaimsDiscount", e.target.value)} className="h-10" />
                              </div>
                            )}

                            {showStep6ContentsAwayFromHome && (
                              <div className="space-y-2">
                                <InlineLabelWithInfo label="Would you like cover for your belongings when you are away from your home?" />
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  {["yes", "no"].map((opt) => (
                                    <label key={opt} className={cn("flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40", values.contentsAwayFromHome === opt && "border-foreground bg-muted/40")}>
                                      <input className="h-4 w-4" type="radio" name="contentsAwayFromHome" checked={values.contentsAwayFromHome === opt} onChange={() => form.setValue("contentsAwayFromHome", opt as any)} style={{ accentColor: "hsl(var(--foreground))" }} />
                                      <span className="text-sm">{opt === "yes" ? "Yes" : "No"}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {showStep6Addons && (
                          <div className="space-y-4 border-t border-border pt-6">
                            <div className="text-[18px] font-semibold text-foreground">Addons</div>
                            <div className="space-y-2">
                              <InlineLabelWithInfo label="Family legal protection (£17.99 per year)" />
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {[
                                  { value: "yes-add", label: "Yes, add" },
                                  { value: "decide-later", label: "No, I'll decide later" },
                                ].map((opt) => (
                                  <label key={opt.value} className={cn("flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-0 hover:bg-muted/40", values.addonFamilyLegalProtection === opt.value && "border-foreground bg-muted/40")}>
                                    <input className="h-4 w-4" type="radio" name="addonFamilyLegalProtection" checked={values.addonFamilyLegalProtection === opt.value} onChange={() => form.setValue("addonFamilyLegalProtection", opt.value as any)} style={{ accentColor: "hsl(var(--foreground))" }} />
                                    <span className="text-sm">{opt.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {stepIndex === 0 && step1Complete && (
                      <div className="space-y-3 rounded-xl border border-border bg-white p-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          Pikl Insurance Services may use or share your information or any named person on the quote
                          or policy with insurers and lenders including at quotation, renewal and for certain policy
                          amendments.
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          This sharing is done to assess your insurance application, perform checks with external
                          databases for fraud prevention and provide you with their best premium, payment options and to
                          assess whether credit is affordable.
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          Please note that any search via a credit reference agency (CRA) will appear on your credit
                          report but will be clearly marked as a quotation rather than a credit application for monthly
                          instalments.
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          The way in which CRAs use and share your information is explained in more detail in the Credit
                          Reference Agency Information Notice
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          By pressing next you confirm that you agree with Pikl&apos;s{" "}
                          <a
                            href="/terms-of-business"
                            className="text-blue-600 hover:underline underline-offset-4"
                          >
                            Terms of Business
                          </a>
                          ,{" "}
                          <a
                            href="/website-terms-of-use"
                            className="text-blue-600 hover:underline underline-offset-4"
                          >
                            Website Terms of Use
                          </a>{" "}
                          and that you have read our{" "}
                          <a
                            href="/privacy-policy"
                            className="text-blue-600 hover:underline underline-offset-4"
                          >
                            Privacy Policy
                          </a>
                          .
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-end pt-2">
                      <div className="flex w-full items-center justify-between gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 border-border"
                          disabled={stepIndex === 0}
                          onClick={() => setStepIndex(0)}
                        >
                          Back
                        </Button>
                        <Button type="submit" disabled={!canContinue} className="h-9 min-w-24">
                          Next
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <HelpFloatingButton />

      <Sheet open={wizardMenuOpen} onOpenChange={setWizardMenuOpen}>
        <SheetContent side="right" className="w-full max-w-xs bg-white p-0">
          <div className="p-6">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-3">
              <Button
                variant="outline"
                className="h-9 w-full justify-center gap-2 border-border"
                onClick={() => {
                  setWizardMenuOpen(false)
                  setLoginOpen(true)
                }}
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
              <Button
                variant="outline"
                className="h-9 w-full justify-center gap-2 border-border"
                onClick={() => {
                  setWizardMenuOpen(false)
                  openCreateAccountModal()
                }}
              >
                <UserPlus className="h-4 w-4" />
                Create account
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onCreateAccount={openCreateAccountModal}
      />
      <CreateAccountModal
        open={createAccountOpen}
        onOpenChange={setCreateAccountOpen}
        prefill={createAccountPrefill}
      />

      <Sheet open={helpOpen} onOpenChange={setHelpOpen}>
        <SheetContent side="right" className="flex h-full w-full max-w-md flex-col bg-white p-0">
          <div className="p-6">
            <SheetHeader>
              <SheetTitle>{helpCopy.title}</SheetTitle>
            </SheetHeader>
            <p className="mt-3 text-sm text-muted-foreground">{helpCopy.body}</p>
          </div>
          <Separator />
          <div className="flex-1 overflow-y-auto p-6">
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              Add contextual guidance content here (rules, examples, definitions, etc.).
            </div>
          </div>
          <div className="border-t border-border p-4">
            <Button className="w-full" variant="outline" onClick={() => setHelpOpen(false)}>
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}


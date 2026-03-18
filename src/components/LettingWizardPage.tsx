import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { ArrowLeft, ArrowRight, Check, Info, Mail, ShieldCheck, ShieldPlus } from "lucide-react"

import { Navbar } from "@/components/Navbar"
import { HelpFloatingButton } from "@/components/HelpFloatingButton"
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
  maritalStatus?: "single" | "married" | "civil" | "cohabiting" | "divorced" | "widowed" | "separated"
  marketingOptIn?: "yes" | "no"
  postcode?: string
  employmentStatus?: "employed" | "self-employed" | "retired" | "other"
  mainOccupation?: string
  businessType?: string
  workPattern?: "full-time" | "part-time"
  expectedAdults?: string
  claimsLast5Years?: "yes" | "no"
  additionalPolicyholders?: "yes" | "no"

  // Step 3: products
  selectedProduct?: "all-in-one" | "top-up"
  shortTermLettingDays?: "more-than-90" | "90-or-fewer" | "30-or-fewer"

  // Step 4: assumptions
  assumptionUkResident?: boolean
  assumptionPropertyOwnerResponsibility?: boolean
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
}

type HelpTopic =
  | "propertyToInsure"
  | "shortTermBasis"
  | "activity"
  | "sharing"

const STEPS = [
  "Your letting",
  "About you",
  "Our products",
  "Assumptions",
  "Property details",
  "Cover",
] as const

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
  const [stepIndex, setStepIndex] = useState<0 | 1 | 2 | 3 | 4>(() => {
    if (typeof window === "undefined") return 0
    return window.location.hash === "#letting-about" ? 1 : 0
  })

  const mainScrollRef = useRef<HTMLElement | null>(null)

  const dobDayRef = useRef<HTMLInputElement | null>(null)
  const dobMonthRef = useRef<HTMLInputElement | null>(null)
  const dobYearRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<LettingFormValues>({
    defaultValues: {
      // Step 4: assumptions default to "True" active (user can flip any to "False")
      assumptionUkResident: true,
      assumptionPropertyOwnerResponsibility: true,
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
  const showShortTerm = stepIndex === 0 && values.propertyToInsure != null
  const showActivity = stepIndex === 0 && showShortTerm && values.shortTermBasis != null
  const showSharing = stepIndex === 0 && showActivity && values.activity != null

  // Ensure Step 4 statements are defaulted to "True" as soon as the UI appears.
  useEffect(() => {
    if (stepIndex !== 3) return

    const statementKeys: Array<
      | "assumptionUkResident"
      | "assumptionPropertyOwnerResponsibility"
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
      (values.expectedAdults?.trim()?.length ?? 0) > 0 &&
      values.claimsLast5Years != null &&
      values.additionalPolicyholders != null
    )
  }, [
    values.additionalPolicyholders,
    values.claimsLast5Years,
    values.dobDay,
    values.dobMonth,
    values.dobYear,
    values.email,
    values.employmentStatus,
    values.mainOccupation,
    values.businessType,
    values.workPattern,
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
      !!values.workPattern,
    [
      values.businessType,
      values.employmentStatus,
      values.mainOccupation,
      values.workPattern,
    ]
  )

  const guestsSectionComplete = useMemo(
    () => (values.expectedAdults?.trim()?.length ?? 0) > 0,
    [values.expectedAdults]
  )

  const claimsSectionComplete = useMemo(
    () => !!values.claimsLast5Years,
    [values.claimsLast5Years]
  )

  const completedSteps = useMemo(() => {
    return (
      (step1Complete ? 1 : 0) +
      (step2Complete ? 1 : 0) +
      (step3Complete ? 1 : 0) +
      (step4Complete ? 1 : 0)
    )
  }, [step1Complete, step2Complete, step3Complete, step4Complete])

  const overallProgress = useMemo(() => {
    return (completedSteps / 6) * 100
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
      return 0
    }

    if (stepIndex === 1 && step2Complete) {
      return 100
    }

    // Step 2: treat each required input/question as one unit of progress.
    const total = 19
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
      ((values.expectedAdults?.trim()?.length ?? 0) > 0 ? 1 : 0) +
      (values.claimsLast5Years ? 1 : 0) +
      (values.additionalPolicyholders ? 1 : 0)

    return (answered / total) * 100
  }, [
    stepIndex,
    values.activity,
    values.additionalPolicyholders,
    values.claimsLast5Years,
    values.dobDay,
    values.dobMonth,
    values.dobYear,
    values.email,
    values.employmentStatus,
    values.mainOccupation,
    values.businessType,
    values.workPattern,
    values.expectedAdults,
    values.firstName,
    values.lastName,
    values.maritalStatus,
    values.marketingOptIn,
    values.mobile,
    values.postcode,
    values.propertyToInsure,
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
    return false
  }, [step1Complete, step2Complete, step3Complete, step4Complete, stepIndex])

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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50">
      <Navbar
        activeLayout="alt"
        onBrandClick={() => {
          setHelpOpen(false)
          setStepIndex(0)
          window.location.hash = "#letting"
          mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
        }}
      />
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
                  {completedSteps}/6 steps complete
                </div>
              </div>
              <DonutProgress value={overallProgress} />
            </div>
            <Separator className="mb-4" />
            <nav className="flex w-full flex-1 flex-col gap-1 overflow-y-auto">
              {STEPS.map((step, idx) => {
                const active = idx === stepIndex
                const enabled = idx <= 4 || idx === 5
                const isComplete =
                  idx === 0
                    ? step1Complete
                    : idx === 1
                      ? step2Complete
                      : idx === 2
                        ? step3Complete
                        : idx === 3
                          ? step4Complete
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
                      if (idx === 5) {
                        window.location.hash = ""
                        return
                      }
                      setStepIndex(idx as 0 | 1 | 2 | 3 | 4)
                    }}
                  >
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-[11px]">
                      {isComplete ? (
                        <Check className="h-[4px] w-[4px]" aria-hidden />
                      ) : (
                        idx + 1
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
              className="mt-auto w-full justify-center gap-2 border-border"
              onClick={() => {
                setHelpOpen(false)
                setStepIndex(0)
                window.location.hash = "#letting"
                mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
              }}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to Pikl
            </Button>
          </div>
        </aside>

        <main
          className="min-w-0 min-h-0 flex-1 overflow-y-auto"
          ref={mainScrollRef}
        >
          <div className="sticky top-0 z-10 border-b border-border bg-white/95">
            <div className="mx-auto w-full max-w-[968px] px-4 py-2 sm:px-6">
              {/* Step title with prev/next arrows */}
              <div className="flex items-center gap-2 pb-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={stepIndex === 0}
                  aria-label="Previous step"
                  onClick={() => {
                    if (stepIndex === 0) return
                    setStepIndex((stepIndex - 1) as 0 | 1 | 2 | 3)
                    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </Button>

                <div className="flex flex-1 items-center justify-center">
                  <div className="inline-flex items-center gap-2 bg-white">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-border text-xs font-semibold text-foreground">
                      {stepIndex + 1}
                    </span>
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
                                : ""}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={stepIndex === 4}
                  aria-label="Next step"
                  onClick={() => {
                    if (stepIndex >= 4) return
                    setStepIndex((stepIndex + 1) as 1 | 2 | 3 | 4)
                    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
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
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle
                  className={cn(
                    "text-xl font-semibold"
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
                            : "Cover"}
                </CardTitle>
                <CardDescription>
                  {stepIndex === 0
                    ? "Please take care to answer all questions honestly and to the best of your knowledge."
                    : stepIndex === 1
                      ? "Pikl will only contact you regarding your quote, new policy or policy renewal."
                      : stepIndex === 2
                        ? "Select a product and tell us how much short-term letting you plan to do."
                        : stepIndex === 3
                          ? "Please check the following statement(s) and change any that are false."
                          : "Property details coming soon."}
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
                    })}
                    className="space-y-6 text-[14px]"
                  >
                    {stepIndex === 0 && (
                      <>
                        <FormField
                          control={form.control}
                          name="propertyToInsure"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
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
                                      "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
                                      field.value === "primary" && "border-foreground bg-muted/40"
                                    )}
                                  >
                                    <RadioGroupItem value="primary" />
                                    <span className="text-sm">Your primary residence</span>
                                  </label>
                                  <label
                                    className={cn(
                                      "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
                                      field.value === "second" && "border-foreground bg-muted/40"
                                    )}
                                  >
                                    <RadioGroupItem value="second" />
                                    <span className="text-sm">Your second or holiday home</span>
                                  </label>
                                  <label
                                    className={cn(
                                      "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
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
                              <FormItem className="space-y-3">
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
                                        "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
                                        field.value === "yes" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="yes" />
                                      <span className="text-sm">Yes</span>
                                    </label>
                                    <label
                                      className={cn(
                                        "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
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
                              <FormItem className="space-y-3">
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
                                        "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
                                        field.value === "letting" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="letting" />
                                      <span className="text-sm">Letting your property on a short-term basis</span>
                                    </label>
                                    <label
                                      className={cn(
                                        "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
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
                              <FormItem className="space-y-3">
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
                                        "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
                                        field.value === "single-bedroom" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="single-bedroom" />
                                      <span className="text-sm">A single bedroom (while you are resident)</span>
                                    </label>
                                    <label
                                      className={cn(
                                        "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
                                        field.value === "entire-property" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="entire-property" />
                                      <span className="text-sm">Your entire property (or multiple bedrooms)</span>
                                    </label>
                                    <label
                                      className={cn(
                                        "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
                                        field.value === "annex" && "border-foreground bg-muted/40"
                                      )}
                                    >
                                      <RadioGroupItem value="annex" />
                                      <span className="text-sm">An annex</span>
                                    </label>
                                    <label
                                      className={cn(
                                        "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
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
                                        <SelectItem value="single">Single</SelectItem>
                                        <SelectItem value="married">Married</SelectItem>
                                        <SelectItem value="civil">Civil partnership</SelectItem>
                                        <SelectItem value="cohabiting">Cohabiting</SelectItem>
                                        <SelectItem value="separated">Separated</SelectItem>
                                        <SelectItem value="divorced">Divorced</SelectItem>
                                        <SelectItem value="widowed">Widowed</SelectItem>
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
                                <Mail className="h-4 w-4 text-foreground" aria-hidden />
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
                                          "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
                                          field.value === "yes" && "border-foreground bg-muted/40"
                                        )}
                                      >
                                        <RadioGroupItem value="yes" />
                                        <span className="text-sm">Yes</span>
                                      </label>
                                      <label
                                        className={cn(
                                          "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
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
                                              "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
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
                                                  "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
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
                              Guests
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="expectedAdults"
                                render={({ field }) => (
                                  <FormItem className="space-y-2 md:col-span-2">
                                    <div className="text-sm font-medium text-foreground">
                                      What is the expected average number of adults who stay at the property at any one
                                      time?
                                    </div>
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
                              Have you, or any additional policyholders, had any claims in the last 5 years?
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
                                            "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
                                            field.value === "yes" && "border-foreground bg-muted/40"
                                          )}
                                        >
                                          <RadioGroupItem value="yes" />
                                          <span className="text-sm">Yes</span>
                                        </label>
                                        <label
                                          className={cn(
                                            "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
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

                        {claimsSectionComplete && (
                          <div className="rounded-xl border border-border bg-white p-4">
                            <div
                              className="text-sm font-semibold text-foreground"
                            >
                              Additional policyholders
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Do you wish to add any additional policyholders?
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
                                            "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
                                            field.value === "yes" && "border-foreground bg-muted/40"
                                          )}
                                        >
                                          <RadioGroupItem value="yes" />
                                          <span className="text-sm">Yes</span>
                                        </label>
                                        <label
                                          className={cn(
                                            "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
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
                        <div className="rounded-xl border border-border bg-white p-4">
                          <div className="text-sm font-semibold text-foreground">
                            Our Products
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            We have two options for your cover needs, all-in-one covers you for home and host insurance, while top-up is added to your exisiting home insurance plan and covers you for host insurance:
                          </p>

                          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="lg:col-span-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                              <label
                                className={cn(
                                  "relative flex cursor-pointer flex-col gap-3 rounded-xl border border-border bg-white px-4 py-4 transition-colors hover:bg-muted/40",
                                  values.selectedProduct === "all-in-one" &&
                                    "border-foreground bg-muted/40"
                                )}
                                onClick={() => form.setValue("selectedProduct", "all-in-one")}
                              >
                                {/* Ensure selecting the whole card updates RHF value */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3">
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
                                      <div className="text-sm font-medium text-muted-foreground">
                                        All-in-one
                                      </div>
                                      <div
                                        className="text-sm font-semibold text-foreground"
                                      >
                                        Home & Host Cover
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
                                    Full cover
                                  </div>
                                </div>

                                <div
                                  className={cn(
                                    "rounded-2xl border border-border px-4 py-3",
                                    values.selectedProduct === "all-in-one"
                                      ? "bg-[#FFFFFF]"
                                      : "bg-[#FCFCFC]"
                                  )}
                                >
                                  <p className="text-sm text-muted-foreground">
                                    All-in-one is home and host insurance that cover your building and/or
                                    contents, plus guest-related incidents.
                                  </p>

                                  <ul className="mt-2 w-full list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                                    <li>Tailor your full home insurance package your way</li>
                                    <li>All the great benefits of our top-up cover</li>
                                    <li>Includes additional cover for damage and theft</li>
                                  </ul>
                                </div>

                                <button
                                  type="button"
                                  className={cn(
                                    "mt-3 flex h-10 w-full items-center justify-center rounded-xl border text-sm font-medium",
                                    values.selectedProduct === "all-in-one"
                                      ? "border-foreground bg-foreground text-background hover:bg-foreground"
                                      : "border-border bg-white text-foreground hover:bg-muted/40"
                                  )}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    form.setValue("selectedProduct", "all-in-one")
                                  }}
                                >
                                  {values.selectedProduct === "all-in-one" ? "Selected" : "Select"}
                                </button>

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
                                  "relative flex cursor-pointer flex-col gap-3 rounded-xl border border-border bg-white px-4 py-4 transition-colors hover:bg-muted/40",
                                  values.selectedProduct === "top-up" &&
                                    "border-foreground bg-muted/40"
                                )}
                                onClick={() => form.setValue("selectedProduct", "top-up")}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3">
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
                                      <div className="text-sm font-medium text-muted-foreground">
                                        Top-up
                                      </div>
                                      <div
                                        className="text-sm font-semibold text-foreground"
                                      >
                                        Host Cover
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className={cn(
                                      "rounded-full border bg-white px-3 py-1 text-xs font-medium",
                                      values.selectedProduct === "top-up"
                                        ? "border-border text-foreground"
                                        : "border-border text-muted-foreground"
                                    )}
                                  >
                                    Top-up cover
                                  </div>
                                </div>

                                <div
                                  className={cn(
                                    "rounded-2xl border border-border px-4 py-3",
                                    values.selectedProduct === "top-up"
                                      ? "bg-[#FFFFFF]"
                                      : "bg-[#FCFCFC]"
                                  )}
                                >
                                  <p className="text-sm text-muted-foreground">
                                    Top-up is host insurance that supplies alongside your existing home
                                    insurance to cover guest-related incidents.
                                  </p>

                                  <ul className="mt-2 w-full list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                                    <li>Flexible cover to fit your sharing needs</li>
                                    <li>Bespoke cover for guest damage and theft</li>
                                    <li>Trusted by our customers and on hand to help</li>
                                  </ul>
                                </div>

                                <button
                                  type="button"
                                  className={cn(
                                    "mt-3 flex h-10 w-full items-center justify-center rounded-xl border text-sm font-medium",
                                    values.selectedProduct === "top-up"
                                      ? "border-foreground bg-foreground text-background hover:bg-foreground"
                                      : "border-border bg-white text-foreground hover:bg-muted/40"
                                  )}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    form.setValue("selectedProduct", "top-up")
                                  }}
                                >
                                  {values.selectedProduct === "top-up" ? "Selected" : "Select"}
                                </button>

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
                                { value: "more-than-90", label: "More than 90 days" },
                                { value: "90-or-fewer", label: "90 days of fewer" },
                                { value: "30-or-fewer", label: "30 days or fewer" },
                              ].map((opt) => (
                                <label
                                  key={opt.value}
                                  className={cn(
                                    "flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:bg-muted/40",
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
                                  <span className="text-xs text-muted-foreground" />
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
                                className="h-4 w-4 rounded border-border"
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
                      <div className="rounded-xl border border-border bg-white p-4">
                        <div className="text-sm font-semibold text-foreground">
                          Property details
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          This step is coming soon.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-end pt-2">
                      <div className="flex w-full items-center justify-between gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-border"
                          disabled={stepIndex === 0}
                          onClick={() => setStepIndex(0)}
                        >
                          Back
                        </Button>
                        <Button type="submit" size="lg" disabled={!canContinue} className="min-w-24">
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


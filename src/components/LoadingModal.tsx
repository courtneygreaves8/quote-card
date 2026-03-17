import { Button } from "@/components/ui/button"
import { CheckCircle2, Home, PiggyBank } from "lucide-react"
import { useEffect, useState } from "react"

const POLL_INTERVAL_MS = 70
const PROGRESS_STEP = 1

interface LoadingModalProps {
  open: boolean
  onClose: () => void
}

export function LoadingModal({ open, onClose }: LoadingModalProps) {
  const [progress, setProgress] = useState(0)
  const FACT_CARDS = [
    {
      label: "Average guest-related savings",
      icon: PiggyBank,
      prefix: "£",
      target: 7000,
      suffix: "",
      description:
        "The average amount our customers saved on guest-related claims when they Pikl'd their property.",
    },
    {
      label: "Landlords protected last year",
      icon: Home,
      prefix: "",
      target: 27407,
      suffix: "",
      description: "The number of landlords we helped make hosting safer in the last year.",
    },
    {
      label: "Major partners",
      icon: CheckCircle2,
      prefix: "",
      target: 98,
      suffix: "%",
      description: "Of claims accepted for our customers, helping to keep them protected when it matters most.",
    },
  ] as const

  const [factValues, setFactValues] = useState(() =>
    FACT_CARDS.map(() => 0)
  )

  useEffect(() => {
    if (!open) return
    setProgress(0)
    setFactValues(FACT_CARDS.map(() => 0))
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + PROGRESS_STEP
        if (next >= 100) {
          clearInterval(id)
          return 100
        }
        return next
      })
    }, POLL_INTERVAL_MS)
    const progressId = id

    const duration = 1200
    const start = performance.now()

    const animateFacts = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)

      setFactValues(
        FACT_CARDS.map((card) => Math.round(card.target * eased))
      )

      if (t < 1) {
        requestAnimationFrame(animateFacts)
      }
    }

    requestAnimationFrame(animateFacts)

    return () => {
      clearInterval(progressId)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-50"
      role="dialog"
      aria-modal="true"
      aria-label="Loading quotes"
    >
      <div className="flex w-full max-w-3xl flex-col items-center gap-8 rounded-2xl border border-neutral-200 bg-white px-6 py-10">
        <div className="relative h-32 w-32">
          {/* Ripple / pulsing rings – same center as logo */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-foreground/25"
              style={{
                animation: "loading-ripple 3s ease-out infinite",
                animationDelay: `${i * 0.7}s`,
              }}
            />
          ))}
          {/* PIKL logo: circle with thick stroke + text – same center */}
          <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-foreground bg-white">
            <span className="text-lg font-semibold tracking-tight text-foreground">PIKL</span>
          </div>
        </div>

        <div className="w-full max-w-3xl space-y-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-purchase transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {progress < 100 ? "Finding your best quotes…" : "Ready"}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {FACT_CARDS.map((card, index) => (
              <div
                key={card.label}
                className="flex h-[216px] w-full max-w-[216px] flex-1 flex-col items-start gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500">
                  {(() => {
                    const Icon = card.icon
                    return <Icon className="h-4 w-4" aria-hidden />
                  })()}
                </span>
                <div className="text-base font-semibold tracking-tight text-foreground">
                  {card.prefix}
                  {factValues[index].toLocaleString("en-GB")}
                  {card.suffix}
                </div>
                <p className="text-[11px] leading-snug text-muted-foreground">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
            >
              Back to answers
            </Button>
            <Button
              className="w-full"
              size="lg"
              disabled={progress < 100}
              onClick={onClose}
            >
              View quotes
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}

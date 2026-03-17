import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"

const POLL_INTERVAL_MS = 70
const PROGRESS_STEP = 1

interface LoadingModalProps {
  open: boolean
  onClose: () => void
}

export function LoadingModal({ open, onClose }: LoadingModalProps) {
  const [progress, setProgress] = useState(0)
  const FACTS = [
    "People who Pikl'd their property last year saved on average £7,000 in guest-related claims.",
    "Last year we made hosting safer for 27,407 landlords.",
    "We also offer B2B solutions for some of the major hosting companies like Business name, Business name and Business name.",
  ]
  const [factIndex, setFactIndex] = useState(0)

  const handlePrevFact = () => {
    setFactIndex((prev) => (prev - 1 + FACTS.length) % FACTS.length)
  }

  const handleNextFact = () => {
    setFactIndex((prev) => (prev + 1) % FACTS.length)
  }

  useEffect(() => {
    if (!open) return
    setProgress(0)
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
    return () => clearInterval(id)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-50"
      role="dialog"
      aria-modal="true"
      aria-label="Loading quotes"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-8 px-6 py-10">
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

        <div className="w-full max-w-md space-y-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-purchase transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {progress < 100 ? "Finding your best quotes…" : "Ready"}
          </p>
          <Button
            className="w-full"
            size="lg"
            disabled={progress < 100}
            onClick={onClose}
          >
            View quotes
          </Button>
          <div className="space-y-3 text-center">
            <div className="mx-auto flex w-full max-w-sm items-center gap-2">
              <button
                type="button"
                onClick={handlePrevFact}
                className="inline-flex shrink-0 items-center justify-center px-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                aria-label="Previous fact"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <div
                key={factIndex}
                className="min-w-0 flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-center animate-fact-card-slide"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                </span>
                <p className="text-xs text-muted-foreground">{FACTS[factIndex]}</p>
              </div>
              <button
                type="button"
                onClick={handleNextFact}
                className="inline-flex shrink-0 items-center justify-center px-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                aria-label="Next fact"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

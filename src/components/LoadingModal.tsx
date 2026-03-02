import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

const POLL_INTERVAL_MS = 180
const PROGRESS_STEP = 4

interface LoadingModalProps {
  open: boolean
  onClose: () => void
}

export function LoadingModal({ open, onClose }: LoadingModalProps) {
  const [progress, setProgress] = useState(0)

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Loading quotes"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="relative h-32 w-32">
          {/* Ripple / pulsing rings – same center as logo */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-24 w-24 rounded-full border-4 border-foreground/25"
              style={{
                transform: "translate(-50%, -50%)",
                animation: "loading-ripple 3s ease-out infinite",
                animationDelay: `${i * 0.7}s`,
              }}
            />
          ))}
          {/* Pikl logo: circle with thick stroke + text – same center */}
          <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-foreground bg-white">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Pikl
            </span>
          </div>
        </div>

        <div className="w-full space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-foreground transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {progress < 100 ? "Finding your best quotes…" : "Ready"}
          </p>
        </div>

        <Button
          className="w-full"
          size="lg"
          disabled={progress < 100}
          onClick={onClose}
        >
          See your quotes
        </Button>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Check, Pencil, X, Zap } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

interface CreateAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prefill?: {
    name?: string
    email?: string
    mobile?: string
  }
}

const FIELDS = [
  {
    id: "name",
    label: "Full name",
    inputId: "create-account-modal-name",
    type: "text" as const,
    value: "John Smith",
    placeholder: "Your full name",
  },
  {
    id: "email",
    label: "Email",
    inputId: "create-account-modal-email",
    type: "email" as const,
    value: "john.smith@example.com",
    placeholder: "you@example.com",
  },
  {
    id: "mobile",
    label: "Mobile number",
    inputId: "create-account-modal-mobile",
    type: "tel" as const,
    value: "07700 900123",
    placeholder: "07XXX XXXXXX",
  },
]

const inputBaseClassName =
"flex h-9 md:h-9 max-[767px]:h-11 w-full rounded-md border-2 bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background"

export function CreateAccountModal({
  open,
  onOpenChange,
  prefill,
}: CreateAccountModalProps) {
  const getInitialValues = useCallback(() => {
    return FIELDS.map((field) => {
      const prefillValue = prefill?.[field.id as keyof typeof prefill]
      return prefillValue && prefillValue.trim().length > 0 ? prefillValue : field.value
    })
  }, [prefill])

  const [progressStep, setProgressStep] = useState(0)
  const [values, setValues] = useState<string[]>(() => getInitialValues())
  const progressCleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!open) {
      setProgressStep(0)
      setValues(getInitialValues())
      progressCleanupRef.current?.()
      progressCleanupRef.current = null
    }
  }, [getInitialValues, open])

  const runProgress = useCallback(() => {
    setProgressStep(1)
    const t1 = setTimeout(() => setProgressStep(2), 450)
    const t2 = setTimeout(() => setProgressStep(3), 450 * 2)
    const t3 = setTimeout(() => onOpenChange(false), 450 * 3 + 200)
    const cleanup = () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
    progressCleanupRef.current = cleanup
    return cleanup
  }, [onOpenChange])

  const isSubmitting = progressStep > 0

  const handleCreateAccount = () => {
    if (isSubmitting) return
    runProgress()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-none bg-transparent p-0 pt-12 px-4 sm:p-4" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Create account</DialogTitle>
        </DialogHeader>

        <Card className="relative w-full">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute right-2 top-2 border-border"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardHeader className="text-center">
            <div
              className="mx-auto mb-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white"
              aria-hidden
            >
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Create your account in seconds
            </h2>
            <CardDescription>
              We&apos;ve pre-filled your details from your quote. Edit anything you like, then create your
              account with one click — quick and hassle-free.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>Pre-filled from your quote — edit as needed</span>
              </div>
              <div className="space-y-4">
                {FIELDS.map((field, index) => {
                  const step = index + 1
                  const isChecked = progressStep >= step
                  return (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label htmlFor={field.inputId}>{field.label}</Label>
                        {isChecked && (
                          <span
                            className="animate-field-check-in flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                            aria-hidden
                          >
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <div className="group relative rounded-md">
                        <input
                          id={field.inputId}
                          type={field.type}
                          value={values[index]}
                          readOnly={isSubmitting}
                          onChange={
                            !isSubmitting
                              ? (e) => {
                                  setValues((prev) => {
                                    const next = [...prev]
                                    next[index] = e.target.value
                                    return next
                                  })
                                }
                              : undefined
                          }
                          className={`${inputBaseClassName} border-input`}
                          placeholder={field.placeholder}
                          disabled={isSubmitting}
                          aria-busy={isSubmitting && progressStep === step}
                        />
                        {!isSubmitting && (
                          <>
                            <span
                              className="pointer-events-none absolute right-3 top-1/2 z-10 flex -translate-y-1/2 text-brand-dark transition-opacity group-hover:opacity-0"
                              aria-hidden
                            >
                              <Check className="h-4 w-4" strokeWidth={2.5} />
                            </span>
                            <span
                              className="pointer-events-none absolute right-3 top-1/2 z-10 flex -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                              aria-hidden
                            >
                              <Pencil className="h-4 w-4" />
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleCreateAccount}
                variant="default"
              >
                Send me a secure link
              </Button>

              <div className="flex items-center gap-3 py-0">
                <div className="h-px flex-1 bg-border" aria-hidden />
                <span className="text-xs font-medium text-muted-foreground">Or</span>
                <div className="h-px flex-1 bg-border" aria-hidden />
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2"
                onClick={handleCreateAccount}
              >
                Create a password
              </Button>
            </div>

            <p className="mt-1 text-center text-xs text-muted-foreground">
              One click — quick and hassle-free.
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

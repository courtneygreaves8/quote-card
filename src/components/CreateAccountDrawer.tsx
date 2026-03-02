import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Check, Loader2, Pencil, X, Zap } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

const PREPOPULATED_USER = {
  name: "John Smith",
  email: "john.smith@example.com",
  mobile: "07700 900123",
  address: "123 Example Street, London, SW1A 1AA",
}

interface CreateAccountDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STEP_DURATION_MS = 450

const inputClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background"

export function CreateAccountDrawer({
  open,
  onOpenChange,
}: CreateAccountDrawerProps) {
  const [progressStep, setProgressStep] = useState(0) // 0 = idle, 1–4 = that many fields checked
  const progressCleanupRef = useRef<(() => void) | null>(null)

  const runProgress = useCallback(() => {
    setProgressStep(1)
    const t1 = setTimeout(() => setProgressStep(2), STEP_DURATION_MS)
    const t2 = setTimeout(() => setProgressStep(3), STEP_DURATION_MS * 2)
    const t3 = setTimeout(() => setProgressStep(4), STEP_DURATION_MS * 3)
    const t4 = setTimeout(() => {
      onOpenChange(false)
    }, STEP_DURATION_MS * 4 + 200)
    const cleanup = () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
    progressCleanupRef.current = cleanup
    return cleanup
  }, [onOpenChange])

  useEffect(() => {
    if (!open) {
      setProgressStep(0)
      progressCleanupRef.current?.()
      progressCleanupRef.current = null
    }
  }, [open])

  const isSubmitting = progressStep > 0

  const handleCreateAccount = () => {
    if (isSubmitting) return
    runProgress()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-hidden bg-white sm:max-w-md"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Create account</SheetTitle>
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

        <div className="flex flex-1 flex-col pt-14">
          <div className="flex flex-col">
            <div
              className="mb-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#EE2A7B] to-[#C91F6A] text-white"
              aria-hidden
            >
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Create your account in seconds
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;ve pre-filled your details from your quote. Edit anything
              you like, then create your account with one click — quick and
              hassle-free.
            </p>
          </div>

          <div className="relative mt-6 overflow-hidden rounded-lg border border-border bg-background p-4">
            {/* Scanning line overlay – runs once when drawer opens */}
            {open && progressStep === 0 && (
                <div
                  className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-lg"
                  aria-hidden
                >
                  <div
                    className="animate-scanning-line absolute left-0 right-0 top-0 h-1 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"
                    style={{
                      boxShadow: "0 0 16px 4px hsl(var(--primary) / 0.25)",
                    }}
                />
              </div>
            )}

            <div className="relative animate-scanning-reveal space-y-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" aria-hidden />
                <span>Pre-filled from your quote — edit as needed</span>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: "name",
                    label: "Full name",
                    inputId: "create-account-name",
                    type: "text",
                    defaultValue: PREPOPULATED_USER.name,
                    placeholder: "Your full name",
                  },
                  {
                    id: "email",
                    label: "Email",
                    inputId: "create-account-email",
                    type: "email",
                    defaultValue: PREPOPULATED_USER.email,
                    placeholder: "you@example.com",
                  },
                  {
                    id: "mobile",
                    label: "Mobile number",
                    inputId: "create-account-mobile",
                    type: "tel",
                    defaultValue: PREPOPULATED_USER.mobile,
                    placeholder: "07XXX XXXXXX",
                  },
                  {
                    id: "address",
                    label: "Address",
                    inputId: "create-account-address",
                    type: "text",
                    defaultValue: PREPOPULATED_USER.address,
                    placeholder: "Your address",
                  },
                ].map((field, index) => {
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
                      <div className="group relative">
                        <input
                          id={field.inputId}
                          type={field.type}
                          defaultValue={field.defaultValue}
                          className={inputClassName}
                          placeholder={field.placeholder}
                          disabled={isSubmitting}
                          readOnly={isSubmitting}
                          aria-busy={isSubmitting && progressStep === step}
                        />
                        {!isSubmitting && (
                          <span
                            className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden
                          >
                            <Pencil className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div
            className="mt-8 flex flex-col gap-0 animate-prefilled-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              className="w-full"
              size="lg"
              onClick={handleCreateAccount}
              disabled={isSubmitting}
              variant="default"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Send me a secure link"
              )}
            </Button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-border" aria-hidden />
              <span className="text-xs font-medium text-muted-foreground">
                Or
              </span>
              <div className="h-px flex-1 bg-border" aria-hidden />
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleCreateAccount}
              disabled={isSubmitting}
            >
              Create a password
            </Button>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              One click — quick and hassle-free.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

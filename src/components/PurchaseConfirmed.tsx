import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/Navbar"
import confetti from "canvas-confetti"
import { FileText, KeyRound, Mail, Shield, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface PurchaseConfirmedProps {
  onSkip?: () => void
}

const CREATE_ACCOUNT_PREFILL_STORAGE_KEY = "quote-card:create-account-prefill"

type CreateAccountPrefill = {
  name?: string
  email?: string
  mobile?: string
}

/** Simple illustration of a prepopulated form (static, non-interactive). */
function FormIllustration({ prefill }: { prefill: CreateAccountPrefill }) {
  const rows = [
    { label: "Full name", value: prefill.name || "—" },
    { label: "Email", value: prefill.email || "—" },
    { label: "Mobile", value: prefill.mobile || "—" },
  ]
  return (
    <div
      className="rounded-lg border border-border bg-muted/30 p-4"
      aria-hidden
    >
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4 shrink-0" />
        <span>Pre-filled details</span>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="space-y-1">
            <Label className="text-xs text-muted-foreground">{row.label}</Label>
            <div className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PurchaseConfirmed({ onSkip }: PurchaseConfirmedProps) {
  const [prefill, setPrefill] = useState<CreateAccountPrefill>({})

  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
    const t = setTimeout(fire, 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const raw = window.localStorage.getItem(CREATE_ACCOUNT_PREFILL_STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as CreateAccountPrefill
      setPrefill(parsed ?? {})
    } catch {
      setPrefill({})
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 max-[767px]:bg-neutral-200">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div
              className="mx-auto mb-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white"
              aria-hidden
            >
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-3">
              <CardTitle>You&apos;re covered!</CardTitle>
              <span className="mx-auto mt-1 flex w-fit items-center justify-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm font-semibold text-foreground/80">
                <Zap className="h-4 w-4 shrink-0" />
                Create your account with one click.
              </span>
            </div>
            <CardDescription>
              We've pre-filled your details from your quote. Manage your account and policies online anytime.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormIllustration prefill={prefill} />

            <div className="space-y-3">
              <Button variant="default" size="lg" className="w-full gap-1.5">
                <Mail className="h-4 w-4" />
                Send me a secure link
              </Button>
              <div className="flex items-center gap-3 py-0">
                <div className="h-px flex-1 bg-border" aria-hidden />
                <span className="text-xs font-medium text-muted-foreground">
                  Or
                </span>
                <div className="h-px flex-1 bg-border" aria-hidden />
              </div>
              <Button variant="outline" size="lg" className="w-full gap-1.5">
                <KeyRound className="h-4 w-4" />
                Create a password
              </Button>
            </div>

            {onSkip && (
              <div className="text-center">
                <Button
                  variant="link"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={onSkip}
                >
                  Skip for now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

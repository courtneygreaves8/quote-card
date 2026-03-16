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
import { LogIn, X } from "lucide-react"
import { useEffect, useState } from "react"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateAccount?: () => void
}

const inputBaseClassName =
"flex h-9 md:h-9 max-[767px]:h-11 w-full rounded-md border-2 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background"

export function LoginModal({ open, onOpenChange, onCreateAccount }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"options" | "password">("options")

  useEffect(() => {
    if (!open) {
      setEmail("")
      setPassword("")
      setMode("options")
    }
  }, [open])

  const handleCreateAccount = () => {
    onOpenChange(false)
    onCreateAccount?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-none bg-transparent p-0 pt-12 px-4 sm:p-4" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Sign in</DialogTitle>
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
              <LogIn className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Sign in to your account
            </h2>
            <CardDescription>
              Sign in to save your quote and access it any time, or create a new account in seconds.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-lg border border-border bg-background p-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputBaseClassName} border-input`}
                  placeholder="you@example.com"
                />
              </div>

              {mode === "password" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputBaseClassName} border-input`}
                    placeholder="••••••••"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              {mode === "options" ? (
                <>
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    variant="default"
                    onClick={() => onOpenChange(false)}
                  >
                    Send me a secure link
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" aria-hidden />
                    <span className="text-xs font-medium text-muted-foreground">Or</span>
                    <div className="h-px flex-1 bg-border" aria-hidden />
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => setMode("password")}
                  >
                    Sign in with password
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    variant="default"
                    onClick={() => onOpenChange(false)}
                  >
                    Sign in
                  </Button>

                  <button
                    type="button"
                    className="w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
                    onClick={() => setMode("options")}
                  >
                    Use a secure link instead
                  </button>
                </>
              )}

              <div className="flex items-center gap-3">
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
                Create an account
              </Button>
            </div>

            <p className="mt-1 text-center text-xs text-muted-foreground">
              Quick and hassle-free — takes less than a minute.
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

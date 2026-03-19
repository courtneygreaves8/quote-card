import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateAccountModal } from "@/components/CreateAccountModal"
import { LoginModal } from "@/components/LoginModal"
import { HelpModal } from "@/components/HelpModal"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { LAYOUT_PADDING_X } from "@/lib/constants"
import { LogIn, Menu, Rocket, UserPlus } from "lucide-react"

const CREATE_ACCOUNT_PREFILL_STORAGE_KEY = "quote-card:create-account-prefill"

interface NavbarProps {
  activeLayout?: "default" | "alt"
  onSelectLayout?: (variant: "default" | "alt") => void
  onBrandClick?: () => void
}

export function Navbar({
  activeLayout = "default",
  onSelectLayout,
  onBrandClick,
}: NavbarProps) {
  const [createAccountOpen, setCreateAccountOpen] = useState(false)
  const [createAccountPrefill, setCreateAccountPrefill] = useState<{
    name?: string
    email?: string
    mobile?: string
  }>({})
  const [loginOpen, setLoginOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

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

  return (
    <>
      <header className={`flex h-14 shrink-0 items-center justify-between border-b border-border bg-white ${LAYOUT_PADDING_X}`}>
        <button
          type="button"
          onClick={onBrandClick}
          className="flex items-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="PIKL Prototype"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200"
            aria-hidden
          >
            <Rocket className="h-4 w-4" stroke="url(#navbarRocketGrad)" strokeWidth={2} />
          </span>
          <svg width={0} height={0} aria-hidden>
            <defs>
              <linearGradient id="navbarRocketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0f0f0f" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-lg tracking-tight text-brand-dark">
            <span className="font-semibold">PIKL</span>{" "}
            <span className="font-light">Prototype</span>
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {/* Desktop / tablet buttons */}
          <div className="hidden md:flex items-center gap-2">
            {activeLayout === "default" && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium"
                onClick={() => onSelectLayout?.("alt")}
              >
                View alt layout
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-1.5 border-border" onClick={() => setLoginOpen(true)}>
              <LogIn className="h-4 w-4" />
              Login
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border"
              onClick={openCreateAccountModal}
            >
              <UserPlus className="h-4 w-4" />
              Create account
            </Button>
           
          </div>
          {/* Mobile hamburger when we show a single card */}
          <Button
            variant="outline"
            size="icon"
            className="border-border md:hidden"
            aria-label="Open navigation"
            onClick={() => setNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
    </header>
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
      <HelpModal open={helpOpen} onOpenChange={setHelpOpen} />
      {/* Mobile nav menu */}
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent
          side="top"
          className="flex w-full max-w-none flex-col border-b border-border bg-white p-4 pt-12"
        >
          <div className="mb-4 flex w-full items-center justify-center gap-2 md:hidden">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200"
              aria-hidden
            >
              <Rocket className="h-4 w-4" stroke="url(#navbarRocketGrad)" strokeWidth={2} />
            </span>
            <span className="text-lg uppercase tracking-tight text-brand-dark">
              <span className="font-semibold">PIKL</span>{" "}
              <span className="font-light">Prototype</span>
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full justify-center gap-1.5 border-border"
              onClick={() => {
                setNavOpen(false)
                setLoginOpen(true)
              }}
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center gap-1.5 border-border"
              onClick={() => {
                setNavOpen(false)
                openCreateAccountModal()
              }}
            >
              <UserPlus className="h-4 w-4" />
              Create account
            </Button>
            {activeLayout === "default" && (
              <Button
                variant="outline"
                className="w-full justify-center gap-1.5 border-border"
                onClick={() => {
                  setNavOpen(false)
                  setHelpOpen(true)
                }}
              >
                Contact support
              </Button>
            )}
            {activeLayout === "default" && (
              <Button
                variant="ghost"
                className="w-full justify-center text-xs font-medium"
                onClick={() => {
                  setNavOpen(false)
                  onSelectLayout?.("alt")
                }}
              >
                View alt layout
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

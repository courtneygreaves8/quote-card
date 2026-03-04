import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateAccountModal } from "@/components/CreateAccountModal"
import { Sheet, SheetContent } from "@/components/ui/sheet"
// To test drawer instead: use CreateAccountDrawer from "@/components/CreateAccountDrawer" and render it here
import { LAYOUT_PADDING_X } from "@/lib/constants"
import { LogIn, Menu, Rocket, UserPlus } from "lucide-react"

export function Navbar() {
  const [createAccountOpen, setCreateAccountOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  return (
    <>
      <header className={`flex h-14 shrink-0 items-center justify-between border-b border-border bg-white ${LAYOUT_PADDING_X}`}>
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-neutral-200"
            aria-hidden
          >
            <Rocket className="h-4 w-4" stroke="url(#navbarRocketGrad)" strokeWidth={2} />
          </span>
          <span className="text-lg font-black uppercase tracking-tight text-black">
            Pikl <span className="font-light">Prototype</span>
          </span>
          <svg width={0} height={0} aria-hidden>
            <defs>
              <linearGradient id="navbarRocketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0f0f0f" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* Desktop / tablet buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 border-border">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border"
              onClick={() => setCreateAccountOpen(true)}
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
      <CreateAccountModal
        open={createAccountOpen}
        onOpenChange={setCreateAccountOpen}
      />
      {/* Mobile nav menu */}
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent
          side="top"
          className="flex w-full max-w-none flex-col border-b border-border bg-white p-4 pt-16"
        >
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="h-10 w-full justify-center gap-1.5 border-border"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
            <Button
              variant="outline"
              className="h-10 w-full justify-center gap-1.5 border-border"
              onClick={() => {
                setNavOpen(false)
                setCreateAccountOpen(true)
              }}
            >
              <UserPlus className="h-4 w-4" />
              Create account
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

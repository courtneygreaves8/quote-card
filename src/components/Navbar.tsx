import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateAccountDrawer } from "@/components/CreateAccountDrawer"
import { LAYOUT_PADDING_X } from "@/lib/constants"
import { LogIn, Rocket, UserPlus } from "lucide-react"

export function Navbar() {
  const [createAccountOpen, setCreateAccountOpen] = useState(false)

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
        <div className="flex shrink-0 items-center gap-1">
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
    </header>
    <CreateAccountDrawer
      open={createAccountOpen}
      onOpenChange={setCreateAccountOpen}
    />
    </>
  )
}

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateAccountDrawer } from "@/components/CreateAccountDrawer"
import { HelpCircle, LogIn, UserPlus } from "lucide-react"

export function Navbar() {
  const [createAccountOpen, setCreateAccountOpen] = useState(false)

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-6">
        <div className="flex items-center">
          <span className="text-lg font-black uppercase tracking-tight text-black">
            Pikl
          </span>
        </div>
        <div className="flex items-center gap-1">
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
        <Button variant="outline" size="sm" className="gap-1.5 border-border">
          <HelpCircle className="h-4 w-4" />
          Help
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

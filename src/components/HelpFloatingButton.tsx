import { Button } from "@/components/ui/button"
import { HelpModal } from "@/components/HelpModal"
import { HelpCircle } from "lucide-react"
import { useState } from "react"

export function HelpFloatingButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full border-border shadow-md"
        aria-label="Help"
        onClick={() => setOpen(true)}
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
      <HelpModal open={open} onOpenChange={setOpen} />
    </>
  )
}

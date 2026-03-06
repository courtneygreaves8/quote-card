import { Button } from "@/components/ui/button"
import { HelpModal } from "@/components/HelpModal"
import { Headset } from "lucide-react"
import { useState } from "react"

export function HelpFloatingButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        className="fixed bottom-6 right-6 z-50 h-10 gap-2 rounded-full border-border px-4 shadow-md"
        aria-label="Contact us"
        onClick={() => setOpen(true)}
      >
        <Headset className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium">Contact us</span>
      </Button>
      <HelpModal open={open} onOpenChange={setOpen} />
    </>
  )
}

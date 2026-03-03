import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export function HelpFloatingButton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full border-border shadow-md"
      aria-label="Help"
    >
      <HelpCircle className="h-5 w-5" />
    </Button>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Headset, Mail, Phone } from "lucide-react"

interface HelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const HELP_MESSAGE =
  "If you need any help to complete our application or have any questions regarding the policies we offer, please contact us using the details below. We are always happy to help."

const OPENING_TIMES = "Office hours are Monday - Friday, 9am - 5pm"
const PHONE_NUMBER = "0800 470 3836"
const EMAIL = "info@pikl.com"

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER.replace(/\s/g, "")}`
  }

  const handleEmail = () => {
    window.location.href = `mailto:${EMAIL}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-[14.4px]">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-1 pr-8 p-[14.4px]">
            <div
              className="mb-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] text-white"
              aria-hidden
            >
              <Headset className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl">How can we help?</DialogTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 px-[14.4px] pb-[14.4px]">
            <p className="mt-[-8px] text-sm text-muted-foreground">{HELP_MESSAGE}</p>

            <div className="mt-1 flex flex-col gap-2 sm:flex-row">
              <Button
                variant="default"
                className="flex-1 gap-2"
                onClick={handleCall}
              >
                <Phone className="h-4 w-4 shrink-0" />
                {PHONE_NUMBER}
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleEmail}
              >
                <Mail className="h-4 w-4 shrink-0" />
                {EMAIL}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">{OPENING_TIMES}</p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

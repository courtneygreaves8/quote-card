import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type ResponsiveTooltipProps = {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function ResponsiveTooltip({
  content,
  children,
  side = "top",
  className,
}: ResponsiveTooltipProps) {
  const [isClickMode, setIsClickMode] = useState(false)

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return
      setIsClickMode(window.innerWidth <= 1023)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  if (isClickMode) {
    return (
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          side={side}
          className={cn(
            "w-max px-3 py-1.5 text-sm",
            // match tooltip visual style as closely as possible
            "rounded-md border border-border bg-popover text-popover-foreground shadow-md",
            className
          )}
        >
          {content}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}


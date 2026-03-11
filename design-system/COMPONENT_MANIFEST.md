# UI component manifest

Each component lives in **`src/components/ui/`** in the main repo. Copy only the ones you need; each has minimal dependencies.

| Component    | File            | Exports | Radix dependency              | Notes                    |
|-------------|-----------------|---------|-------------------------------|--------------------------|
| Button      | `button.tsx`    | Button, buttonVariants | @radix-ui/react-slot | Uses CVA for variants/sizes |
| Card        | `card.tsx`      | Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent | — | Pure presentational |
| Collapsible | `collapsible.tsx` | Collapsible, CollapsibleTrigger, CollapsibleContent | @radix-ui/react-collapsible | |
| Dialog      | `dialog.tsx`    | Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription | @radix-ui/react-dialog | |
| Label       | `label.tsx`     | Label  | @radix-ui/react-label | |
| Popover     | `popover.tsx`   | Popover, PopoverTrigger, PopoverContent | @radix-ui/react-popover | |
| Select      | `select.tsx`    | Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectSeparator | @radix-ui/react-select | Uses lucide-react for icons |
| Separator   | `separator.tsx` | Separator | @radix-ui/react-separator | |
| Sheet       | `sheet.tsx`     | Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription | @radix-ui/react-dialog | Dialog primitive, side panel styling |
| Slider      | `slider.tsx`    | Slider | @radix-ui/react-slider | |
| Switch      | `switch.tsx`    | Switch | @radix-ui/react-switch | |
| Tooltip     | `tooltip.tsx`   | Tooltip, TooltipTrigger, TooltipContent, TooltipProvider | @radix-ui/react-tooltip | Wrap app in TooltipProvider |

All components use:

- `cn()` from `@/lib/utils`
- Tailwind classes that rely on design tokens (e.g. `bg-primary`, `border-input`, `text-muted-foreground`)

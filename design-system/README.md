# Design System — Quote Card

Portable design tokens, Tailwind theme, and UI primitives so you can reuse this styling and components in a new project.

---

## 1. Design tokens (CSS variables)

**Copy:** `design-system/theme.css`  
**Into your project:** Import in your main CSS (e.g. `src/index.css`) **before** Tailwind directives, or merge its contents into your existing base styles.

Tokens use HSL values (no `hsl()` wrapper) for Tailwind’s `hsl(var(--name))` usage:

| Variable | Role |
|----------|------|
| `--background`, `--foreground` | Page and default text |
| `--card`, `--card-foreground` | Cards and card text |
| `--primary`, `--primary-foreground` | Primary actions, buttons |
| `--secondary`, `--secondary-foreground` | Secondary UI |
| `--muted`, `--muted-foreground` | Muted backgrounds and text |
| `--accent`, `--accent-foreground` | Hover states, accents |
| `--destructive`, `--destructive-foreground` | Destructive actions |
| `--border`, `--input`, `--ring` | Borders, inputs, focus rings |
| `--radius` | Default border radius (e.g. `0.75rem`) |

Light and `.dark` variants are included.

---

## 2. Tailwind config

**Copy:** Merge `design-system/tailwind.theme.js` into your `tailwind.config.js`:

- Set `darkMode: ["class"]`.
- In `theme.extend`, add (or merge):
  - `screens` (optional: `card3`, `hd`, `qc`, `sf` breakpoints).
  - `borderRadius` from the theme file.
  - `colors` from the theme file (they reference the CSS variables above).

**Required plugin:** `tailwindcss-animate` (for Sheet/Dialog, Switch, etc.):

```bash
npm i -D tailwindcss-animate
```

```js
plugins: [require("tailwindcss-animate")],
```

---

## 3. Utility: `cn()`

Your app needs a `cn()` helper used by all UI components (merge class names with Tailwind-aware merging).

**Copy:** `design-system/lib/utils.ts` into your project (e.g. `src/lib/utils.ts`).  
If you already have a `utils` module, add this and re-export:

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Dependencies:**

```bash
npm i clsx tailwind-merge
```

---

## 4. UI primitive components

All components live under **`src/components/ui/`** and depend on:

- `cn()` from `@/lib/utils`
- Tailwind theme (design tokens)
- Radix UI primitives (see table below)

**Path alias:** Ensure `@/` resolves to your `src` directory (e.g. in Vite/TS: `"@/*": ["./src/*"]`).

### Files to copy

From this repo into your project’s `src/`:

| Copy from (this repo)      | To (your project)        |
|----------------------------|---------------------------|
| `src/lib/utils.ts`         | `src/lib/utils.ts`        |
| `src/components/ui/button.tsx`     | `src/components/ui/button.tsx`     |
| `src/components/ui/card.tsx`       | `src/components/ui/card.tsx`       |
| `src/components/ui/collapsible.tsx`| `src/components/ui/collapsible.tsx`|
| `src/components/ui/dialog.tsx`     | `src/components/ui/dialog.tsx`     |
| `src/components/ui/label.tsx`      | `src/components/ui/label.tsx`      |
| `src/components/ui/popover.tsx`    | `src/components/ui/popover.tsx`    |
| `src/components/ui/select.tsx`     | `src/components/ui/select.tsx`     |
| `src/components/ui/separator.tsx`  | `src/components/ui/separator.tsx`  |
| `src/components/ui/sheet.tsx`      | `src/components/ui/sheet.tsx`      |
| `src/components/ui/slider.tsx`     | `src/components/ui/slider.tsx`      |
| `src/components/ui/switch.tsx`     | `src/components/ui/switch.tsx`     |
| `src/components/ui/tooltip.tsx`    | `src/components/ui/tooltip.tsx`    |

`select.tsx` uses **lucide-react** for `Check`, `ChevronDown`, `ChevronUp`. Install if you use Select:

```bash
npm i lucide-react
```

### Component → Radix dependency

| Component   | Radix package                  |
|------------|---------------------------------|
| Button     | `@radix-ui/react-slot`          |
| Card       | —                               |
| Collapsible| `@radix-ui/react-collapsible`   |
| Dialog     | `@radix-ui/react-dialog`        |
| Label      | `@radix-ui/react-label`         |
| Popover    | `@radix-ui/react-popover`       |
| Select     | `@radix-ui/react-select`        |
| Separator  | `@radix-ui/react-separator`     |
| Sheet      | `@radix-ui/react-dialog`        |
| Slider     | `@radix-ui/react-slider`        |
| Switch     | `@radix-ui/react-switch`        |
| Tooltip    | `@radix-ui/react-tooltip`       |

---

## 5. NPM dependencies (summary)

**Runtime:**

```bash
npm i class-variance-authority clsx tailwind-merge \
  @radix-ui/react-collapsible @radix-ui/react-dialog @radix-ui/react-label \
  @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-separator \
  @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch \
  @radix-ui/react-tooltip
```

**Optional (for Select icons):** `lucide-react`

**Dev:**

```bash
npm i -D tailwindcss-animate
```

---

## 6. Quick start checklist (new project)

1. [ ] Create Vite + React + TypeScript project (or existing app).
2. [ ] Install Tailwind and the dependencies above.
3. [ ] Add `theme.css` (or its content) to your global CSS.
4. [ ] Merge `tailwind.theme.js` into `tailwind.config.js` and add `tailwindcss-animate`.
5. [ ] Configure path alias `@/` → `src`.
6. [ ] Copy `src/lib/utils.ts` and `src/components/ui/*` from this repo.
7. [ ] Use tokens via Tailwind classes: `bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg` (uses `--radius`), etc.

---

## 7. Optional: app-specific animations

This repo also defines keyframes used by the quote-card app (e.g. `loading-ripple`, `prefilled-fade-in`, `field-check-in`, `fact-card-slide`). They are **not** included in `theme.css`. If you need them, copy the `@keyframes` and `.animate-*` classes from `src/index.css` in this repo into your own CSS.

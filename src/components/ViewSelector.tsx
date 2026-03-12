import { PurchaseConfirmed } from "@/components/PurchaseConfirmed"
import { QuotesPageAltLayout } from "@/components/QuotesPageAltLayout"
import { QuotesPageLayout } from "@/components/QuotesPageLayout"
import { useQuotesPage } from "@/hooks/useQuotesPage"
import { useState } from "react"

export function ViewSelector() {
  const state = useQuotesPage()
  const [layoutVariant, setLayoutVariant] = useState<"default" | "alt">("alt")

  if (state.showPurchaseConfirmed) {
    return <PurchaseConfirmed onSkip={state.handleClosePurchaseConfirmed} />
  }

  if (layoutVariant === "alt") {
    return (
      <QuotesPageAltLayout
        {...state}
        onLayoutChange={(variant) => setLayoutVariant(variant)}
      />
    )
  }

  return (
    <QuotesPageLayout
      {...state}
      onLayoutChange={(variant) => setLayoutVariant(variant)}
    />
  )
}

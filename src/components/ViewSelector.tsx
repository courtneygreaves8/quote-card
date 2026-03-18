import { PurchaseConfirmed } from "@/components/PurchaseConfirmed"
import { QuotesPageAltLayout } from "@/components/QuotesPageAltLayout"
import { QuotesPageLayout } from "@/components/QuotesPageLayout"
import { LettingWizardPage } from "@/components/LettingWizardPage"
import { useQuotesPage } from "@/hooks/useQuotesPage"
import { useEffect, useState } from "react"

export function ViewSelector() {
  const state = useQuotesPage()
  const [layoutVariant, setLayoutVariant] = useState<"default" | "alt">("alt")
  const [view, setView] = useState<"quotes" | "letting">(() => {
    if (typeof window === "undefined") return "quotes"
    return window.location.hash === "#letting" || window.location.hash === "#letting-about" ? "letting" : "quotes"
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    const onHashChange = () => {
      setView(
        window.location.hash === "#letting" || window.location.hash === "#letting-about"
          ? "letting"
          : "quotes"
      )
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  if (view === "letting") {
    return <LettingWizardPage />
  }

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

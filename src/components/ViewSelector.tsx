import { PurchaseConfirmed } from "@/components/PurchaseConfirmed"
import { QuotesPageLayout } from "@/components/QuotesPageLayout"
import { useQuotesPage } from "@/hooks/useQuotesPage"

export function ViewSelector() {
  const state = useQuotesPage()

  if (state.showPurchaseConfirmed) {
    return (
      <PurchaseConfirmed onSkip={state.handleClosePurchaseConfirmed} />
    )
  }

  return <QuotesPageLayout {...state} />
}

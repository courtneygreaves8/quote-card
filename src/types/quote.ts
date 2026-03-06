export type PaymentOption = "monthly" | "annual"

export type SortOption = "price-asc" | "price-desc" | "provider-az"
export type FilterOption = "all" | "under-20" | "under-25" | "under-30"

export interface QuoteFilters {
  coverAmount: number
  excess: string
  policyType: string
  coverStartDate: string
  paymentOption: PaymentOption
  buildingsAccidentalDamage: boolean
  contentsAccidentalDamage: boolean
  legalCover: boolean
  homeEmergency: boolean
}

export interface Quote {
  id: string
  providerName: string
  trustpilotRating: number
  logo: string
  cover: string
  coverAmount: number
  standardPrice: number
  piklPrice: number
  familyLegalAddOnPrice: number
  homeEmergencyAddOnPrice: number
  policyDetails: PolicyDetails
}

export interface PolicyDetails {
  excess: string
  policyType: string
  benefits: string[]
  exclusions: string[]
  summary: string
}

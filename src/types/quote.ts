export type PaymentOption = "monthly" | "annual"

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

export interface HotelConfiguration {
  id: string
  name: string
  tagline: string
  description: string
  branding: {
    logoUrl: string
    faviconUrl: string
    primaryColor: string
    accentColor: string
  }
  contact: {
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    phone: string
    email: string
    website: string
  }
  financial: {
    currency: string
    currencySymbol: string
    taxRatePercent: number
    taxIdentifierName: string // e.g. "GSTIN"
    taxIdentifierValue?: string
  }
  policy: {
    checkInTime: string
    checkOutTime: string
    cancellationPolicyHours: number
  }
}

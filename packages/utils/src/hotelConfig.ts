import { HotelConfiguration } from '@hospitality-os/types'

export function getDefaultHotelConfig(): HotelConfiguration {
  return {
    id: process.env.HOTEL_ID || 'hotel_ashokha_01',
    name: process.env.NEXT_PUBLIC_HOTEL_NAME || 'Hotel Ashokha',
    tagline: 'Luxury Stay & Fine Dining',
    description: 'Experience world-class hospitality, premium suites, and authentic dining.',
    branding: {
      logoUrl: '/logo.svg',
      faviconUrl: '/favicon.ico',
      primaryColor: '#C6A96B',
      accentColor: '#0F172A',
    },
    contact: {
      address: 'Main Commercial District',
      city: 'City',
      state: 'State',
      country: 'India',
      zipCode: '500001',
      phone: '+91 98765 43210',
      email: 'info@ashokainn.com',
      website: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
    financial: {
      currency: 'INR',
      currencySymbol: '₹',
      taxRatePercent: 12,
      taxIdentifierName: 'GSTIN',
      taxIdentifierValue: process.env.HOTEL_GSTIN || '36AAAAA0000A1Z5',
    },
    policy: {
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicyHours: 24,
    },
  }
}

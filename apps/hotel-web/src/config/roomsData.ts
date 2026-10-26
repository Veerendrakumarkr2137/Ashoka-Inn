export interface RoomConfig {
  id: string
  name: string
  tagline?: string
  description: string
  basePrice: number
  capacity: number
  sizeSqm?: number
  hasAC: boolean
  hasTV: boolean
  hasKettle: boolean
  hasWater: boolean
  images: string[] // Paste Google / External Image URLs here for each room
}

export const ROOMS_CONFIG: Record<string, RoomConfig> = {
  'deluxe-non-ac': {
    id: 'deluxe-non-ac',
    name: 'Deluxe Non-AC',
    tagline: 'Signature Collection',
    description: 'Comfortable stay with essential amenities, ideal for budget-conscious travelers who value comfort and convenience.',
    basePrice: 3500,
    capacity: 2,
    sizeSqm: 25,
    hasAC: false,
    hasTV: true,
    hasKettle: true,
    hasWater: true,
    images: [
      'https://content3.jdmagicbox.com/v2/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ashok-inn-pb-road-davangere-davangere-lodging-services-b4y9sipggj.jpg',
      '/images/hotel/IMG-20260725-WA0004.jpg',
      '/images/hotel/IMG-20260725-WA0007.jpg',
      '/images/hotel/IMG-20260725-WA0010.jpg',
    ]
  },

  'superior-ac': {
    id: 'superior-ac',
    name: 'Superior AC',
    tagline: 'Premium Collection',
    description: 'Premium air-conditioned comfort with modern design and tranquil ambiance.',
    basePrice: 5500,
    capacity: 2,
    sizeSqm: 32,
    hasAC: true,
    hasTV: true,
    hasKettle: true,
    hasWater: true,
    images: [
      '/images/hotel/IMG_20260725_120524.jpg',
      '/images/hotel/IMG-20260725-WA0005.jpg',
      '/images/hotel/IMG-20260725-WA0006.jpg',
      '/images/hotel/IMG-20260725-WA0011.jpg',
    ]
  },

  'family-ac': {
    id: 'family-ac',
    name: 'Family AC',
    tagline: 'Family Collection',
    description: 'Spacious accommodation perfect for families seeking quality together-time in supreme comfort.',
    basePrice: 8500,
    capacity: 4,
    sizeSqm: 45,
    hasAC: true,
    hasTV: true,
    hasKettle: true,
    hasWater: true,
    images: [
      '/images/hotel/IMG_20260725_120914.jpg',
      '/images/hotel/IMG_20260725_120919.jpg',
      '/images/hotel/family ac/IMG_20260725_121624.jpg',
      '/images/hotel/family ac/IMG_20260725_121626.jpg',
      '/images/hotel/family ac/IMG_20260725_121632.jpg',
    ]
  },

  'king-suite': {
    id: 'king-suite',
    name: 'King Suite',
    tagline: 'Luxury Collection',
    description: 'Ultimate luxury with premium services, expansive living area, and personalized butler service.',
    basePrice: 15000,
    capacity: 2,
    sizeSqm: 60,
    hasAC: true,
    hasTV: true,
    hasKettle: true,
    hasWater: true,
    images: [
      'https://content3.jdmagicbox.com/v2/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ashok-inn-pb-road-davangere-davangere-lodging-services-b4y9sipggj.jpg',
      '/images/rooms/king-suite/IMG_20260725_121206.jpg',
      '/images/rooms/king-suite/IMG_20260725_121222.jpg',
      '/images/rooms/king-suite/IMG_20260725_121224.jpg',
      '/images/rooms/king-suite/IMG_20260725_121234.jpg',
      '/images/rooms/king-suite/IMG_20260725_121245.jpg',
      '/images/hotel/IMG_20260725_121414.jpg',
      '/images/hotel/IMG_20260725_121419.jpg',
    ]
  }
}

/**
 * Helper to get images for a category, preferring ROOMS_CONFIG image URLs if present
 */
import { SITE_IMAGES } from './siteImages'

export function getRoomImages(category: { id?: string; name: string; images?: { url: string }[] }): string[] {
  const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  // 1. Check SITE_IMAGES.rooms[slug] first for instant global sync!
  if (SITE_IMAGES.rooms && SITE_IMAGES.rooms[slug as keyof typeof SITE_IMAGES.rooms] && SITE_IMAGES.rooms[slug as keyof typeof SITE_IMAGES.rooms].length > 0) {
    return SITE_IMAGES.rooms[slug as keyof typeof SITE_IMAGES.rooms];
  }

  const config = ROOMS_CONFIG[slug] || (category.id ? ROOMS_CONFIG[category.id] : null);
  
  if (config && config.images && config.images.length > 0) {
    return config.images;
  }
  
  if (category.images && category.images.length > 0) {
    return category.images.map(img => img.url);
  }
  
  return [
    '/images/hotel/IMG_20260725_120524.jpg',
    '/images/hotel/IMG-20260725-WA0004.jpg'
  ];
}

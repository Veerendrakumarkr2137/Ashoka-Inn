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
      // ➔ PASTE GOOGLE / EXTERNAL IMAGE URLS FOR DELUXE NON-AC HERE:
      '/images/rooms/deluxe-non-ac/1.jpg',
      '/images/rooms/deluxe-non-ac/2.jpg',
      '/images/rooms/deluxe-non-ac/3.jpg',
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
      // ➔ PASTE GOOGLE / EXTERNAL IMAGE URLS FOR SUPERIOR AC HERE:
      '/images/rooms/superior-ac/1.jpg',
      '/images/rooms/superior-ac/2.jpg',
      '/images/rooms/superior-ac/3.jpg',
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
      'https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/room-imgs/201903230927305696-4476-72aea8b87dfb11e981ee0242ac110003.jpg?output-quality=75&downsize=*:500&crop=990:500',
      'https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/201903230927305696-e4c20f28d7dd11ec9fc40a58a9feac02.jpg?output-quality=75&downsize=*:500&crop=990:500',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWShVsX1YP6WuXSO_ICD6-aqXr5Q5n5xyifi5MN3BADg&s',
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
      // ➔ PASTE GOOGLE / EXTERNAL IMAGE URLS FOR KING SUITE HERE:
      '/images/rooms/king-suite/1.jpg',
      '/images/rooms/king-suite/2.jpg',
      '/images/rooms/king-suite/3.jpg',
    ]
  }
}

/**
 * Helper to get images for a category, preferring ROOMS_CONFIG image URLs if present
 */
export function getRoomImages(category: { id?: string; name: string; images?: { url: string }[] }): string[] {
  const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  const config = ROOMS_CONFIG[slug] || (category.id ? ROOMS_CONFIG[category.id] : null);
  
  if (config && config.images && config.images.length > 0) {
    return config.images;
  }
  
  if (category.images && category.images.length > 0) {
    return category.images.map(img => img.url);
  }
  
  return [
    '/images/rooms/deluxe-non-ac/1.jpg',
    '/images/rooms/deluxe-non-ac/2.jpg'
  ];
}

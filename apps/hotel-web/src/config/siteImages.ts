export const SITE_IMAGES = {
  // ─── 1. HOMEPAGE IMAGES 
  homepage: {
    heroBackground: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/239618349.jpg?k=3ebd7c88484bdd60bcf8f869883e18763f7212c288767e50e442b030b740cb68&o=',
    welcomeLobby: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2874&auto=format&fit=crop',
    executiveMeetings: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/239618337.jpg?k=7f133ad0733398914c5f211eda66cbf70d9fd6209053a7a3d3847b4977845e1b&o=',
    fineDining: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop',

    // ─── 4 PROPERTY SHOWCASE CARDS (Edit each card image independently!) ───
    showcaseCards: {
      arrival: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/239618349.jpg?k=3ebd7c88484bdd60bcf8f869883e18763f7212c288767e50e442b030b740cb68&o=',
      reception: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2874&auto=format&fit=crop',
      suites: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2874&auto=format&fit=crop',
      dining: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop',
    },

    // ─── 6 IMMERSIVE GALLERY GRID PHOTOS (Edit each photo independently!) ───
    immersiveGallery: [
      { id: 1, title: 'King Suite Lounge', category: 'rooms', src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2874&auto=format&fit=crop' },
      { id: 2, title: 'Grand Atrium Architecture', category: 'architecture', src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2874&auto=format&fit=crop' },
      { id: 3, title: 'D Lounge Culinary Experience', category: 'dining', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop' },
      { id: 4, title: 'Courtyard Sanctuary', category: 'courtyard', src: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2874&auto=format&fit=crop' },
      { id: 5, title: 'Hikkups Lounge Bar', category: 'dining', src: '/images/dining/IMG_20260725_120219.jpg' },
      { id: 6, title: 'Superior AC Room', category: 'rooms', src: '/images/hotel/IMG_20260725_120524.jpg' },
      { id: 7, title: 'Superior Room', category: 'rooms', src: '/images/hotel/IMG_20260725_120524.jpg' },
      { id: 8, title: 'Courtyard Sanctuary', category: 'courtyard', src: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2874&auto=format&fit=crop' },

    ]
  },

  // ─── 2. DINING VENUES (DYNAMIC ARRAYS: [0] = Hero, [1...] = Gallery) ───
  dining: {
    // Main Dining Landing Page Hero Background
    heroBackground: '/images/dining/Courtyard Walkway.png',

    // 🍽 D Lounge Restaurant (Multi-Cuisine Fine Dining)
    dLounge: [
      '/images/dining/Courtyard Walkway.png',                              // [0] Hero Background (Dining Hall)
      '/images/dining/Dining Hall.png',                                   // [1] Gallery Photo (Courtyard Walkway)
      '/images/dining/Interior Woven Lights.png',                        // [2] Gallery Photo (Interior Woven Lights)
      '/images/dining/IMG_20260725_120338.jpg',                         // [3] Gallery Photo (Fine Dining Table)
      '/images/dining/outdore.png',
      '/images/dining/Inside.png',
      '/images/dining/images (1).jpg',

    ],

    // 🍦 Mercely's Kefi Ice Cream (Street Facade Dessert Parlour)
    mercelys: [
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=2940&auto=format&fit=crop', // [0] Hero Background (Artisanal Kulfi)
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2940&auto=format&fit=crop', // [2] Gallery Photo (Sizzling Brownie)
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2940&auto=format&fit=crop',     // [1] Gallery Photo (Dessert Counter)
      'https://images.unsplash.com/photo-1752962640187-cfd373f4f553?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbOccInFjk46jomshaEqOgvRXGejuBBltnIsaevYOaMg&s=10',
      '/images/dining/IMG_20260725_120520.jpg',
      '/images/dining/IMG_20260725_120502.jpg',
      '/images/hotel/IMG_20260725_120524.jpg',
      // 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?q=80&w=2940&auto=format&fit=crop', // [3] Gallery Photo (Mango Scoop)
    ],

    // 🍖 The Hikkups BBQ & Bar (Live BBQ & Mixology Lounge)
    hikkups: [
      '/images/dining/IMG_20260725_120219.jpg',                            // [0] Hero Background (Bar Counter)
      'https://images.jdmagicbox.com/comp/davangere/m4/9999p8192.8192.190201134145.b1m4/catalogue/the-hikkups-nittuvalli-davangere-davangere-restaurants-k9qrazpaj0.jpg',
      'https://content.jdmagicbox.com/comp/davangere/m4/9999p8192.8192.190201134145.b1m4/catalogue/the-hikkups-nittuvalli-davangere-davangere-restaurants-zunermu8jq.jpg?imwidth=463.3333333333333',
      '/images/dining/Bar.png',
      // 'https://images.jdmagicbox.com/comp/davangere/m4/9999p8192.8192.190201134145.b1m4/catalogue/the-hikkups-nittuvalli-davangere-davangere-restaurants-757lgn66lw.jpg',
      'https://images.jdmagicbox.com/comp/davangere/m4/9999p8192.8192.190201134145.b1m4/catalogue/the-hikkups-nittuvalli-davangere-davangere-restaurants-j5ir25naks.jpg',
      'https://images.jdmagicbox.com/comp/davangere/m4/9999p8192.8192.190201134145.b1m4/catalogue/the-hikkups-davangere-ho-davangere-restaurants-02okcxczkl.jpg',
      // 'https://content.jdmagicbox.com/comp/davangere/m4/9999p8192.8192.190201134145.b1m4/catalogue/the-hikkups-davangere-restaurants-9alff59dkq.jpg?imwidth=367.6666666666667',
      '/images/dining/844d2110-00cc-43bb-b992-06fab58a2c03.png',
    ],

    // 🛎 24x7 Room Service (In-Suite Fine Dining Care)
    roomService: [
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjBzZXJ2aWNlfGVufDB8fDB8fHww',  // [0] Hero Background (In-Suite Breakfast Spread)
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=2940&auto=format&fit=crop', // [1] Gallery Photo (Club Sandwich Tray)
      '/images/dining/IMG_20260725_120338.jpg',                                                       // [2] Gallery Photo (In-Room Setup)
      'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2940&auto=format&fit=crop',  // [3] Gallery Photo (Midnight Soup Service)
      'https://images.unsplash.com/photo-1544986581-efac024faf62?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWwlMjBzZXJ2aWNlfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1683260041390-e13c859f4b7b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cm9vbSUyMHNlcnZpY2V8ZW58MHx8MHx8fDA%3D',
    ]
  },

  // ─── 3. ROOMS PAGE BANNER ─────────────────────────────────────────────
  roomsListingPage: {
    heroBackground: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2874&auto=format&fit=crop',
  },

  // ─── 4. INDIVIDUAL ROOM GALLERIES ─────────────────────────────────────
  rooms: {
    'deluxe-non-ac': [
      'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/334108934.jpg?k=312f8e7b177b68fdab4dacce492f74613404c2817935b8d471a9610467c13263&o=&s=1024x',
      'https://content3.jdmagicbox.com/v2/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ashok-inn-pb-road-davangere-davangere-lodging-services-b4y9sipggj.jpg',
      'https://images.jdmagicbox.com/v2/comp/davangere/e9/9999p8192.8192.190305120331.u8e9/catalogue/ashok-inn-pb-road-davangere-davangere-hotels-8n9zvhjq6y.jpg',
      'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/328880141.jpg?k=c3ad498949809408a3f3fc9206d2772167bfa79f9908dca39d71936c19d8687a&o=&s=1024x',
      'https://images.jdmagicbox.com/comp/davangere/e9/9999p8192.8192.190305120331.u8e9/catalogue/ashok-inn-davangere-city-davangere-hotels-ax2szb1m0m.jpg',
    ],
    'deluxe-non-ac-room': [
      'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/334108934.jpg?k=312f8e7b177b68fdab4dacce492f74613404c2817935b8d471a9610467c13263&o=&s=1024x',
      'https://content3.jdmagicbox.com/v2/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ashok-inn-pb-road-davangere-davangere-lodging-services-b4y9sipggj.jpg',
      'https://images.jdmagicbox.com/v2/comp/davangere/e9/9999p8192.8192.190305120331.u8e9/catalogue/ashok-inn-pb-road-davangere-davangere-hotels-8n9zvhjq6y.jpg',
    ],

    'superior-ac': [
      'https://pix8.agoda.net/property/56113075/0/ab9960300652b6109824ecece697c478.jpeg?va=1&ce=0&s=1024x',
      'https://pix8.agoda.net/property/69621579/0/dcdcb0ec6f80fe2d9a9d5814bfe7b295.jpeg?va=1&ce=2&s=1024x',
      'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/334108934.jpg?k=312f8e7b177b68fdab4dacce492f74613404c2817935b8d471a9610467c13263&o=&s=1024x',
      'https://pix8.agoda.net/property/69621579/0/be0a6cdfda1ea1f7772234a465f704a6.jpeg?va=1&ce=2&s=1024x',
      '/images/hotel/IMG_20260725_120524.jpg',
    ],
    'superior-ac-room': [
      'https://pix8.agoda.net/property/56113075/0/ab9960300652b6109824ecece697c478.jpeg?va=1&ce=0&s=1024x',
      'https://pix8.agoda.net/property/69621579/0/dcdcb0ec6f80fe2d9a9d5814bfe7b295.jpeg?va=1&ce=2&s=1024x',
      '/images/hotel/IMG_20260725_120524.jpg',
    ],

    'family-ac': [
      '/images/rooms/family-ac/a3356807-d673-488c-88e6-a1d51328ecc8 (1).png',
      'https://pix8.agoda.net/property/56113075/873347128/54dfd03c34f5e5140d99be00d5b00014.jpeg?va=1&ce=0&s=1024x',
      'https://images.jdmagicbox.com/v2/comp/davangere/e9/9999p8192.8192.190305120331.u8e9/catalogue/ashok-inn-pb-road-davangere-davangere-hotels-lnb5kei46c.jpg'
    ],
    'executive-family-ac-room': [
      '/images/rooms/family-ac/a3356807-d673-488c-88e6-a1d51328ecc8 (1).png',
      'https://pix8.agoda.net/property/56113075/873347128/54dfd03c34f5e5140d99be00d5b00014.jpeg?va=1&ce=0&s=1024x',
      'https://images.jdmagicbox.com/v2/comp/davangere/e9/9999p8192.8192.190305120331.u8e9/catalogue/ashok-inn-pb-road-davangere-davangere-hotels-lnb5kei46c.jpg'
    ],

    'king-suite': [
      '/images/rooms/king-suite/3ca6ae06-28dc-42a1-9418-e5a6a5a163a0.png',
      'https://content3.jdmagicbox.com/v2/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ashok-inn-pb-road-davangere-davangere-lodging-services-b4y9sipggj.jpg',
      'https://pix8.agoda.net/hotelImages/31474701/504479616/5c0280746a9d53036ee99442c1dc87ca.jpg?va=1&ca=29&ce=0&s=1024x',
      'https://pix8.agoda.net/hotelImages/31474701/504479616/5dd9189bdf56983a966e76e445aeb50a.jpg?va=1&ca=29&ce=0&s=1024x',
    ],
    'king-suite-lounge': [
      '/images/rooms/king-suite/3ca6ae06-28dc-42a1-9418-e5a6a5a163a0.png',
      'https://content3.jdmagicbox.com/v2/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ashok-inn-pb-road-davangere-davangere-lodging-services-b4y9sipggj.jpg',
      'https://pix8.agoda.net/hotelImages/31474701/504479616/5c0280746a9d53036ee99442c1dc87ca.jpg?va=1&ca=29&ce=0&s=1024x',
    ],
  },

  // ─── 4. DEDICATED GALLERY PAGE IMAGES (Add ONLY the photos you want on /gallery page!) ───
  galleryPage: [
    { title: 'Ashok Inn Exterior', category: 'Exterior', url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/239618349.jpg?k=3ebd7c88484bdd60bcf8f869883e18763f7212c288767e50e442b030b740cb68&o=' },
    { title: 'Deluxe Non-AC Room', category: 'Rooms', url: 'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/334108934.jpg?k=312f8e7b177b68fdab4dacce492f74613404c2817935b8d471a9610467c13263&o=&s=1024x' },
    { title: 'Executive Meetings', category: 'Events', url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/239618337.jpg?k=7f133ad0733398914c5f211eda66cbf70d9fd6209053a7a3d3847b4977845e1b&o=' },
    { title: 'D Lounge Restaurant', category: 'Dining', url: '/images/dining/Courtyard Walkway.png' },
    { title: 'Interior Woven Lights', category: 'Dining', url: '/images/dining/Interior Woven Lights.png' },
    { title: 'The Hikkups BBQ & Bar', category: 'Dining', url: 'https://images.jdmagicbox.com/comp/davangere/m4/9999p8192.8192.190201134145.b1m4/catalogue/the-hikkups-nittuvalli-davangere-davangere-restaurants-757lgn66lw.jpg' },
    { title: 'Kefi Artisanal Scoop', category: 'Dining', url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=2940&auto=format&fit=crop' },
    { title: 'Sizzling Hot Brownie', category: 'Dining', url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2940&auto=format&fit=crop' },
    { title: 'Dessert Counter Display', category: 'Dining', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2940&auto=format&fit=crop' },
    { title: 'Culinary Platter', category: 'Dining', url: 'https://images.unsplash.com/photo-1752962640187-cfd373f4f553?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { title: 'Ashok Inn Dining Specialty', category: 'Dining', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbOccInFjk46jomshaEqOgvRXGejuBBltnIsaevYOaMg&s=10' },
    { title: 'D Lounge Ambience', category: 'Dining', url: '/images/dining/IMG_20260725_120520.jpg' },
    { title: 'Fine Dining Table', category: 'Dining', url: '/images/dining/IMG_20260725_120502.jpg' },
    { title: 'Superior Room Interior', category: 'Rooms', url: '/images/hotel/IMG_20260725_120524.jpg' },
    { title: 'Central Atrium Balcony', category: 'Amenities', url: '/images/hotel/IMG_20260725_120755.jpg' },
    { title: 'Premium Guest Corridor', category: 'Corridor', url: '/images/hotel/images (3).jpg' },
    { title: 'Ashok Inn Reception Lobby', category: 'Lobby', url: '/images/hotel/IMG_20260725_120914.jpg' },
    { title: 'Guest Room Hallway', category: 'Corridor', url: 'https://images.jdmagicbox.com/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ew9s6vjgifyeu1o-355abj2id9.jpg' },
    { title: 'Multi-Cuisine Dining Hall', category: 'Dining', url: 'https://images.jdmagicbox.com/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/pc99s88dc58cw0n-y0fmmfn5bb.jpg' },
    { title: 'Ashok Inn Main Exterior', category: 'Exterior', url: 'https://content.jdmagicbox.com/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ovuhbizuz350xj6-3plz5fe2k5.jpg?imwidth=267.3333333333333' },
    { title: 'Open Atrium Courtyard', category: 'Lobby', url: '/images/hotel/IMG_20260725_120755.jpg' },
    { title: 'Courtyard Water Feature View', category: 'Amenities', url: '/images/hotel/IMG_20260725_121414.jpg' },
    { title: 'Indoor Courtyard Walkway', category: 'Amenities', url: '/images/hotel/images.jpg' },
    { title: 'Lobby Art Gallery Corner', category: 'Lobby', url: '/images/hotel/IMG_20260725_120919.jpg' },
    { title: 'Marble Guest Corridor', category: 'Corridor', url: '/images/hotel/IMG-20260725-WA0004.jpg' },
    { title: 'Traditional Art Display', category: 'Lobby', url: '/images/hotel/IMG_20260725_120919.jpg' },
    { title: 'Glass Roof Atrium', category: 'Amenities', url: '/images/hotel/IMG-20260725-WA0007.jpg' },
    { title: 'Atrium Balcony Overlook', category: 'Amenities', url: '/images/hotel/IMG-20260725-WA0012.jpg' },
  ]
}

export function getCategoryImages(category: { id?: string; name: string; images?: { url: string }[] }): string[] {
  const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  // 1. Direct Slug Match
  let customImages = (SITE_IMAGES.rooms as Record<string, string[]>)[slug];

  // 2. ID Match
  if ((!customImages || customImages.length === 0) && category.id) {
    customImages = (SITE_IMAGES.rooms as Record<string, string[]>)[category.id];
  }

  // 3. Partial / Fuzzy Key Match
  if (!customImages || customImages.length === 0) {
    const roomKeys = Object.keys(SITE_IMAGES.rooms);
    const matchedKey = roomKeys.find(k => slug.includes(k) || k.includes(slug));
    if (matchedKey) {
      customImages = (SITE_IMAGES.rooms as Record<string, string[]>)[matchedKey];
    }
  }

  const filteredCustom = (customImages || []).filter(img => img && img.trim() !== '');
  if (filteredCustom.length > 0) return filteredCustom;

  if (category.images && category.images.length > 0) {
    const dbImages = category.images.map(i => i.url).filter(u => u && u.trim() !== '');
    if (dbImages.length > 0) return dbImages;
  }

  return [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2874&auto=format&fit=crop',
    '/images/hotel/IMG_20260725_120524.jpg'
  ];
}

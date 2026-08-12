export const SITE_IMAGES = {
  // ─── 1. HOMEPAGE IMAGES 
  homepage: {
    heroBackground: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/239618349.jpg?k=3ebd7c88484bdd60bcf8f869883e18763f7212c288767e50e442b030b740cb68&o=',
    welcomeLobby: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2874&auto=format&fit=crop',
    executiveMeetings: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/239618337.jpg?k=7f133ad0733398914c5f211eda66cbf70d9fd6209053a7a3d3847b4977845e1b&o=',
    fineDining: '/images/dining/297e4349-f8f2-4c81-94de-e9fe3ac66d29.png',

    // ─── 4 PROPERTY SHOWCASE CARDS (Edit each card image independently!) ───
    showcaseCards: {
      arrival: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/239618349.jpg?k=3ebd7c88484bdd60bcf8f869883e18763f7212c288767e50e442b030b740cb68&o=',
      reception: '/images/hotel/5474d41e-57cb-4175-a3e6-2503ad7bbeac.png',
      suites: '/images/rooms/king-suite/ChatGPT Image Jul 28, 2026, 08_31_17 PM.png',
      dining: '/images/dining/297e4349-f8f2-4c81-94de-e9fe3ac66d29.png',
    },

    // ─── 6 IMMERSIVE GALLERY GRID PHOTOS (Edit each photo independently!) ───
    immersiveGallery: [
      { id: 1, title: 'King Suite Lounge', category: 'rooms', src: '/images/rooms/king-suite/ChatGPT Image Jul 28, 2026, 08_31_17 PM.png' },
      { id: 2, title: 'Grand Atrium Architecture', category: 'architecture', src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2874&auto=format&fit=crop' },
      { id: 3, title: 'D Lounge Culinary Experience', category: 'dining', src: '/images/dining/297e4349-f8f2-4c81-94de-e9fe3ac66d29.png' },
      { id: 4, title: 'Courtyard Sanctuary', category: 'courtyard', src: '/images/rooms/family-ac/ChatGPT Image Jul 28, 2026, 08_50_09 PM.png' },
      { id: 5, title: 'Hikkups Lounge Bar', category: 'dining', src: '/images/dining/hikkups1.jpg' },
      { id: 6, title: 'Superior AC Room', category: 'rooms', src: '/images/rooms/superior-ac/f87a83c1-6a12-4a70-9ab4-ed44f587ebb5.png' },
    ]
  },

  // ─── 2. DINING VENUES (DYNAMIC ARRAYS: [0] = Hero, [1...] = Gallery) ───
  dining: {
    // 🍽 D Lounge Restaurant (Multi-Cuisine Fine Dining)
    dLounge: [
      '/images/dining/297e4349-f8f2-4c81-94de-e9fe3ac66d29.png', // [0] Hero Background (Dining Hall)
      '/images/dining/dLounge1.jpg',                            // [1] Gallery Photo (Courtyard Walkway)
      '/images/dining/dLounge2.jpg',                            // [2] Gallery Photo (Interior Woven Lights)
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop', // [3] Gallery Photo (Fine Dining Table)
    ],

    // 🍦 Mercely's Kefi Ice Cream (Street Facade Dessert Parlour)
    mercelys: [
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=2940&auto=format&fit=crop', // [0] Hero Background (Artisanal Kulfi)
      '/images/dining/bbqExterior.png',                         // [1] Gallery Photo (Street Facade)
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2940&auto=format&fit=crop', // [2] Gallery Photo (Sizzling Brownie)
      'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?q=80&w=2940&auto=format&fit=crop', // [3] Gallery Photo (Mango Scoop)
    ],

    // 🍖 The Hikkups BBQ & Bar (Live BBQ & Mixology Lounge)
    hikkups: [
      '/images/dining/hikkups1.jpg',                            // [0] Hero Background (Bar Counter)
      '/images/dining/hikkups2.jpg',                            // [1] Gallery Photo (Live BBQ Station)
      '/images/dining/bbqExterior.png',                         // [2] Gallery Photo (Exterior Night Lights)
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2940&auto=format&fit=crop', // [3] Gallery Photo (Craft Cocktail)
    ],

    // 🛎 24x7 Room Service (In-Suite Fine Dining Care)
    roomService: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2940&auto=format&fit=crop', // [0] Hero Background (In-Suite Breakfast Spread)
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=2940&auto=format&fit=crop', // [1] Gallery Photo (Club Sandwich Tray)
      '/images/dining/dLounge1.jpg',                            // [2] Gallery Photo (In-Room Setup)
      'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2940&auto=format&fit=crop', // [3] Gallery Photo (Midnight Soup Service)
    ]
  },

  // ─── 3. ROOMS PAGE BANNER ─────────────────────────────────────────────
  roomsListingPage: {
    heroBackground: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2874&auto=format&fit=crop',
  },

  // ─── 4. INDIVIDUAL ROOM GALLERIES ─────────────────────────────────────
  rooms: {
    'deluxe-non-ac': [
      '/images/rooms/deluxe-non-ac/90d43313-99d4-4145-bf94-1faf2327ac06.PNG',
      'https://content3.jdmagicbox.com/v2/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ashok-inn-pb-road-davangere-davangere-lodging-services-b4y9sipggj.jpg', 
      '/images/rooms/deluxe-non-ac/f87a83c1-6a12-4a70-9ab4-ed44f587ebb5.png',    
      '/images/rooms/deluxe-non-ac/b3d7de53-fbbb-46ef-a56c-9170ed1e5e67.png',
    ],

    'superior-ac': [
      '/images/rooms/superior-ac/f87a83c1-6a12-4a70-9ab4-ed44f587ebb5.png',
      '/images/rooms/superior-ac/90d43313-99d4-4145-bf94-1faf2327ac06.PNG',  
      'https://content3.jdmagicbox.com/v2/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ashok-inn-pb-road-davangere-davangere-lodging-services-b4y9sipggj.jpg',    
      '/images/rooms/superior-ac/b3d7de53-fbbb-46ef-a56c-9170ed1e5e67.png',
    ],

    'family-ac': [
      '/images/rooms/family-ac/ChatGPT Image Jul 28, 2026, 08_50_09 PM.png',
      '/images/rooms/family-ac/a3356807-d673-488c-88e6-a1d51328ecc8.png',
      'https://content3.jdmagicbox.com/v2/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ashok-inn-pb-road-davangere-davangere-lodging-services-b4y9sipggj.jpg',
      '/images/rooms/family-ac/338348182.JPG',
    ],

    'king-suite': [       
      '/images/rooms/king-suite/ChatGPT Image Jul 28, 2026, 08_31_17 PM.png',
      '/images/rooms/king-suite/ChatGPT Image Jul 28, 2026, 08_14_34 PM.png',
      '/images/rooms/king-suite/ChatGPT Image Jul 28, 2026, 08_23_54 PM.png',
      'https://content3.jdmagicbox.com/v2/comp/davangere/q8/9999p8192.8192.230728112934.l2q8/catalogue/ashok-inn-pb-road-davangere-davangere-lodging-services-b4y9sipggj.jpg',
      'https://cf.bstatic.com/xdata/images/hotel/max1024x768/338348180.jpg?k=3ddc19119aaea7e17c18201ea89d21ba5913bd89455d486c5895e433019fbcf2&o=',
    ],
  }
}

export function getCategoryImages(category: { id?: string; name: string; images?: { url: string }[] }): string[] {
  const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const customImages = (SITE_IMAGES.rooms as Record<string, string[]>)[slug] || 
                       (category.id ? (SITE_IMAGES.rooms as Record<string, string[]>)[category.id] : null);

  const filteredCustom = (customImages || []).filter(img => img.trim() !== '');
  if (filteredCustom.length > 0) return filteredCustom;

  if (category.images && category.images.length > 0) {
    const dbImages = category.images.map(i => i.url).filter(u => u.trim() !== '');
    if (dbImages.length > 0) return dbImages;
  }

  return ['https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2874&auto=format&fit=crop'];
}

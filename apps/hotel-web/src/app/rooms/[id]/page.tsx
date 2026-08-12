import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@hospitality-os/database'
import { 
  Users, Wifi, Tv, Coffee, Droplets, 
  ChevronRight, ChevronLeft, Share2, Heart,
  BedDouble, Fan, Briefcase, Sparkles, MapPin, ShieldCheck, HeartHandshake,
  Check, ArrowRight, Wind, Key, Bath
} from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { RoomAccordions } from '@/components/rooms/RoomAccordions'
import { MobileBookingBarAndDrawer } from '@/components/booking/MobileBookingBarAndDrawer'
import { SwipeGallery } from '@/components/ui/SwipeGallery'
import { getCategoryImages } from '@/config/siteImages'

// Next.js 15 requires awaiting params
export default async function RoomDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const category = await prisma.roomCategory.findUnique({
    where: { id },
    include: { images: true }
  })
  
  if (!category) {
    notFound()
  }

  const otherRooms = await prisma.roomCategory.findMany({
    where: { id: { not: id } },
    take: 4,
    include: { images: true }
  })

  // Format the title for editorial stacking (e.g., "Deluxe Non-AC" -> "Deluxe" and "Non-AC")
  const titleParts = category.name.split(' ')
  const firstWord = titleParts[0]
  const restOfTitle = titleParts.slice(1).join(' ')

  // Get room images from central siteImages config
  const galleryImages = getCategoryImages(category)

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-24 font-body">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-32 pb-12">
        <div className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-black/20" />
          <Link href="/rooms" className="hover:text-[#0F172A] transition-colors">Rooms</Link>
          <ChevronRight size={14} className="text-black/20" />
          <span className="text-[#0F172A]">{category.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: Editorial Content (65%) */}
          <div className="w-full lg:w-[65%]">
            
            {/* Massive Editorial Title */}
            <ScrollReveal>
              <h1 className="text-6xl md:text-7xl lg:text-[90px] font-heading text-[#0F172A] leading-[1.1] mb-12" style={{ letterSpacing: '-0.02em' }}>
                <span className="block">{firstWord}</span>
                {restOfTitle && <span className="block text-[#C6A96B] italic font-medium">{restOfTitle}</span>}
              </h1>
            </ScrollReveal>

            {/* Mobile Full-Bleed Swipeable Gallery (Visible on lg:hidden) */}
            <div className="lg:hidden -mx-4 sm:-mx-6 mb-8">
              <SwipeGallery images={galleryImages} altPrefix={category.name} />
            </div>

            {/* Immersive Gallery Stack (Desktop: hidden lg:flex) */}
            <div className="hidden lg:flex flex-col gap-6 lg:gap-8 mb-20">
              {galleryImages.map((imgUrl, idx) => (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <div className={`relative w-full rounded-[24px] overflow-hidden ${idx === 0 ? 'aspect-[4/3] lg:aspect-[16/10]' : 'aspect-video'}`}>
                    <Image 
                      src={imgUrl} 
                      alt={`${category.name} View ${idx + 1}`}
                      fill 
                      className="object-cover hover:scale-105 transition-transform duration-1000"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Mobile Expandable Accordions (Visible on lg:hidden) */}
            <div className="lg:hidden">
              <RoomAccordions category={category} />
            </div>

            {/* Overview & Amenities Section (Desktop: hidden lg:block) */}
            <div className="hidden lg:block">
              {/* Overview Section */}
              <ScrollReveal>
                <div className="mb-20">
                  <span className="text-[10px] font-bold text-[#C6A96B] uppercase tracking-[0.2em] block mb-4">Overview</span>
                  <h3 className="text-3xl lg:text-4xl font-heading text-[#0F172A] mb-8">
                    A sanctuary of comfort.
                  </h3>
                  <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
                    {category.description} Carefully curated to provide an exceptional experience, this space blends modern elegance with timeless luxury. Whether you are traveling for business or leisure, every detail has been thoughtfully designed to ensure your utmost relaxation.
                  </p>
                  
                  {/* Key Features Inline */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t border-black/5">
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-2">Occupancy</p>
                      <p className="text-sm font-bold text-[#0F172A]">Up to {category.capacity} Guests</p>
                    </div>
                    {category.sizeSqm && (
                      <div>
                        <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-2">Room Size</p>
                        <p className="text-sm font-bold text-[#0F172A]">{category.sizeSqm} sq.m</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-2">Climate</p>
                      <p className="text-sm font-bold text-[#0F172A]">{category.hasAC ? 'AC Included' : 'Non-AC'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-2">Bed Type</p>
                      <p className="text-sm font-bold text-[#0F172A]">1 Double Bed</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Grouped Amenities */}
              <ScrollReveal>
                <div className="mb-20">
                  <span className="text-[10px] font-bold text-[#C6A96B] uppercase tracking-[0.2em] block mb-8">Amenities</span>
                  
                  <div className="space-y-12">
                    {/* Comfort */}
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest mb-6 pb-2 border-b border-black/5">Comfort</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3"><BedDouble size={20} className="text-[#C6A96B] stroke-[1.5]" /><span className="text-sm font-medium text-[#6B7280]">King Bed</span></div>
                        {category.hasAC && <div className="flex items-center gap-3"><Wind size={20} className="text-[#C6A96B] stroke-[1.5]" /><span className="text-sm font-medium text-[#6B7280]">Air Conditioning</span></div>}
                        <div className="flex items-center gap-3"><Sparkles size={20} className="text-[#C6A96B] stroke-[1.5]" /><span className="text-sm font-medium text-[#6B7280]">Daily Housekeeping</span></div>
                        <div className="flex items-center gap-3"><HeartHandshake size={20} className="text-[#C6A96B] stroke-[1.5]" /><span className="text-sm font-medium text-[#6B7280]">24x7 Room Service</span></div>
                      </div>
                    </div>
                    
                    {/* Technology */}
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest mb-6 pb-2 border-b border-black/5">Technology</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3"><Wifi size={20} className="text-[#C6A96B] stroke-[1.5]" /><span className="text-sm font-medium text-[#6B7280]">High-Speed Wi-Fi</span></div>
                        {category.hasTV && <div className="flex items-center gap-3"><Tv size={20} className="text-[#C6A96B] stroke-[1.5]" /><span className="text-sm font-medium text-[#6B7280]">Smart TV</span></div>}
                        <div className="flex items-center gap-3"><Key size={20} className="text-[#C6A96B] stroke-[1.5]" /><span className="text-sm font-medium text-[#6B7280]">Electronic Safe</span></div>
                      </div>
                    </div>

                    {/* Bathroom */}
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest mb-6 pb-2 border-b border-black/5">Bathroom</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3"><Bath size={20} className="text-[#C6A96B] stroke-[1.5]" /><span className="text-sm font-medium text-[#6B7280]">Premium Toiletries</span></div>
                        <div className="flex items-center gap-3"><Droplets size={20} className="text-[#C6A96B] stroke-[1.5]" /><span className="text-sm font-medium text-[#6B7280]">Hot Water</span></div>
                        <div className="flex items-center gap-3"><Check size={20} className="text-[#C6A96B] stroke-[1.5]" /><span className="text-sm font-medium text-[#6B7280]">Plush Towels</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Booking Card (Desktop: hidden lg:block) */}
          <div className="hidden lg:block w-full lg:w-[35%] relative">
            <div className="sticky top-32 bg-white rounded-[24px] shadow-[0_32px_64px_rgba(0,0,0,0.06)] border border-black/[0.03] p-8 lg:p-10">
              <span className="text-[10px] font-bold text-[#C6A96B] uppercase tracking-[0.2em] block mb-3">
                Signature Collection
              </span>
              <h2 className="text-3xl font-heading text-[#0F172A] mb-8">
                {category.name}
              </h2>
              
              <div className="pb-8 border-b border-black/5 mb-8">
                <span className="text-[10px] text-[#C6A96B] uppercase tracking-widest font-semibold block mb-2">
                  Starting From
                </span>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold font-heading text-[#0F172A]">₹{category.basePrice.toLocaleString()}</span>
                  <span className="text-sm text-[#6B7280] font-medium">/ night</span>
                </div>
                <span className="text-[10px] text-[#6B7280] block flex items-center gap-1.5">
                  <Check size={12} className="text-[#C6A96B]" strokeWidth={3} /> Breakfast Included
                </span>
              </div>
              
              <Link href={`/booking?room=${category.id}`} className="w-full py-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-center rounded-[12px] font-bold text-[11px] uppercase tracking-widest transition-colors mb-8 flex items-center justify-center gap-2 group">
                Reserve Your Stay <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex flex-col gap-4 text-[#0F172A]">
                <button className="flex items-center justify-between p-4 rounded-[12px] border border-black/5 hover:bg-[#FAF8F5] transition-colors text-xs font-semibold" suppressHydrationWarning>
                  <span className="flex items-center gap-2"><Share2 size={16} className="text-[#C6A96B]" /> Share this room</span>
                  <ChevronRight size={14} className="text-black/20" />
                </button>
                <button className="flex items-center justify-between p-4 rounded-[12px] border border-black/5 hover:bg-[#FAF8F5] transition-colors text-xs font-semibold" suppressHydrationWarning>
                  <span className="flex items-center gap-2"><Heart size={16} className="text-[#C6A96B]" /> Add to Wishlist</span>
                  <ChevronRight size={14} className="text-black/20" />
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Explore More Rooms (Horizontal Carousel) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mb-24 mt-12 border-t border-black/5 pt-20">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] font-bold text-[#C6A96B] uppercase tracking-[0.2em] block mb-3">Discover</span>
              <h3 className="text-3xl lg:text-4xl font-heading text-[#0F172A]">Explore More Rooms</h3>
            </div>
            <div className="hidden sm:flex gap-2">
              <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors" suppressHydrationWarning><ChevronLeft size={20} /></button>
              <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors" suppressHydrationWarning><ChevronRight size={20} /></button>
            </div>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={0.2}>
          <div className="flex gap-6 lg:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {otherRooms.map((room, i) => (
              <div key={room.id} className="w-[85vw] sm:w-[400px] shrink-0 snap-center sm:snap-start group cursor-pointer">
                <Link href={`/rooms/${room.id}`} className="block">
                  <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden mb-6">
                    <Image 
                      src={room.images[0]?.url || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2874&auto=format&fit=crop'} 
                      alt={room.name} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[9px] font-bold text-[#C6A96B] uppercase tracking-[0.2em] block mb-2">
                    {i === 0 ? "Premium Collection" : i === 1 ? "Luxury Collection" : "Family Collection"}
                  </span>
                  <h4 className="text-2xl font-heading text-[#0F172A] mb-3 group-hover:text-[#C6A96B] transition-colors">{room.name}</h4>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold font-heading text-[#0F172A]">₹{room.basePrice.toLocaleString()}</span>
                    <span className="text-[10px] text-[#6B7280] font-medium uppercase tracking-widest">/ night</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
      
      {/* Mobile Floating Bar & Bottom Sheet Drawer */}
      <MobileBookingBarAndDrawer category={category} />
    </main>
  )
}

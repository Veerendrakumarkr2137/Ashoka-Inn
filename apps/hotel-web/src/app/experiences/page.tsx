import React from 'react'
import { prisma } from '@hospitality-os/database'
import { Sparkles, Utensils, Droplets, Car, Wine, Phone, ParkingSquare, Shirt } from 'lucide-react'
import Image from 'next/image'

const iconMap: Record<string, React.ReactNode> = {
  'Room Service': <Utensils size={24} className="text-[#C6A96B]" />,
  'Laundry': <Droplets size={24} className="text-[#C6A96B]" />,
  'Car Wash': <Car size={24} className="text-[#C6A96B]" />,
  'Bar': <Wine size={24} className="text-[#C6A96B]" />,
  'Restaurant': <Utensils size={24} className="text-[#C6A96B]" />,
  'default': <Sparkles size={24} className="text-[#C6A96B]" />
}

export default async function ExperiencesPage() {
  const serviceCategories = await prisma.serviceCategory.findMany({
    include: {
      services: {
        where: { isAvailable: true }
      }
    }
  })

  return (
    <main className="bg-[#F7F5F2] min-h-screen pt-32 pb-16">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <h2 className="text-sm font-bold tracking-[0.2em] text-[#C6A96B] uppercase mb-4">
          Hotel Services
        </h2>
        <h1 className="text-4xl md:text-6xl font-normal font-heading text-[#0F172A] mb-6">
          Curated Experiences
        </h1>
        <p className="text-[#6B7280] text-lg max-w-2xl mx-auto font-light">
          Make your stay unforgettable with our exclusive offerings. From fine dining 
          to in-room conveniences, we cater to your every need.
        </p>
      </div>

      {/* Premium Amenities Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-black/5 text-center group hover:border-[#C6A96B]/30 transition-colors">
            <div className="w-16 h-16 mx-auto bg-[#FDF9F0] text-[#C6A96B] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Car size={32} />
            </div>
            <h3 className="text-xl font-heading text-[#0F172A] mb-3">Automotive Care</h3>
            <p className="text-[#6B7280] leading-relaxed">
              Enjoy peace of mind with our ample secure parking. We also offer professional valet parking and on-demand car washing services during your stay.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-black/5 text-center group hover:border-[#C6A96B]/30 transition-colors">
            <div className="w-16 h-16 mx-auto bg-[#FDF9F0] text-[#C6A96B] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Phone size={32} />
            </div>
            <h3 className="text-xl font-heading text-[#0F172A] mb-3">24/7 Room Service</h3>
            <p className="text-[#6B7280] leading-relaxed">
              Every room is equipped with a direct telephone line. Order from our in-room dining menu or request assistance at any hour of the day or night.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-black/5 text-center group hover:border-[#C6A96B]/30 transition-colors">
            <div className="w-16 h-16 mx-auto bg-[#FDF9F0] text-[#C6A96B] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shirt size={32} />
            </div>
            <h3 className="text-xl font-heading text-[#0F172A] mb-3">Laundry & Amenities</h3>
            <p className="text-[#6B7280] leading-relaxed">
              Take advantage of our professional laundry and dry-cleaning services. All rooms come fully stocked with premium basic amenities for your comfort.
            </p>
          </div>
        </div>
      </div>

      {/* Services Listing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mb-24">
        {serviceCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-[24px] p-8 md:p-12 shadow-sm border border-black/5">
            <div className="flex items-center gap-4 mb-8 border-b border-black/5 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#FDF9F0] flex items-center justify-center">
                {iconMap[category.name] || iconMap['default']}
              </div>
              <h3 className="text-3xl font-heading text-[#0F172A]">{category.name}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map(service => (
                <div key={service.id} className="group p-6 rounded-[16px] border border-black/5 hover:border-[#C6A96B]/30 hover:bg-[#FDF9F0] transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-medium text-[#0F172A] group-hover:text-[#C6A96B] transition-colors">
                      {service.name}
                    </h4>
                    <span className="text-sm font-bold text-[#0F172A]">
                      ₹{service.price}
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      {service.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

import { MetadataRoute } from 'next'
import { SITE_IMAGES } from '@/config/siteImages'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ashokinn.com'

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      images: [SITE_IMAGES.homepage.heroBackground, SITE_IMAGES.homepage.welcomeLobby],
    },
    {
      url: `${baseUrl}/restaurant`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [
        SITE_IMAGES.dining.dLounge[0],
        SITE_IMAGES.dining.hikkups[0],
        SITE_IMAGES.dining.mercelys[0],
        SITE_IMAGES.dining.roomService[0],
      ],
    },
    {
      url: `${baseUrl}/restaurant/d-lounge`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      images: SITE_IMAGES.dining.dLounge,
    },
    {
      url: `${baseUrl}/restaurant/the-hikkups`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      images: SITE_IMAGES.dining.hikkups,
    },
    {
      url: `${baseUrl}/restaurant/mercelys`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      images: SITE_IMAGES.dining.mercelys,
    },
    {
      url: `${baseUrl}/restaurant/room-service`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      images: SITE_IMAGES.dining.roomService,
    },
    {
      url: `${baseUrl}/rooms`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      images: [SITE_IMAGES.roomsListingPage.heroBackground],
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}

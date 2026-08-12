import React from 'react'
import { prisma } from '@hospitality-os/database'
import { SettingsClient } from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const [damageConfigs, systemSettings, roomCategories, serviceCategories] = await Promise.all([
    prisma.damagePriceConfig.findMany({ orderBy: { itemName: 'asc' } }),
    prisma.systemSetting.findMany({ orderBy: { key: 'asc' } }),
    prisma.roomCategory.findMany({ include: { rooms: true }, orderBy: { basePrice: 'asc' } }),
    prisma.serviceCategory.findMany({ include: { services: true } }),
  ])

  return (
    <SettingsClient
      damageConfigs={damageConfigs}
      systemSettings={systemSettings}
      roomCategories={roomCategories}
      serviceCategories={serviceCategories}
    />
  )
}

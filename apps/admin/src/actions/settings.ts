'use server'

import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

// ─── 1. DAMAGE PRICE CONFIGURATION ───────────────────────────────────────────
export async function getDamagePriceConfigs() {
  try {
    const configs = await prisma.damagePriceConfig.findMany({
      orderBy: { itemName: 'asc' },
    })
    return { success: true, configs }
  } catch (error: any) {
    return { success: false, configs: [], error: error.message }
  }
}

export async function upsertDamagePriceConfig(data: { id?: string; itemName: string; price: number; category?: string }) {
  try {
    if (data.id) {
      const config = await prisma.damagePriceConfig.update({
        where: { id: data.id },
        data: {
          itemName: data.itemName,
          price: data.price,
          category: data.category || 'INVENTORY',
        },
      })
      revalidatePath('/settings')
      revalidatePath('/housekeeping')
      return { success: true, config }
    } else {
      const config = await prisma.damagePriceConfig.create({
        data: {
          itemName: data.itemName,
          price: data.price,
          category: data.category || 'INVENTORY',
        },
      })
      revalidatePath('/settings')
      revalidatePath('/housekeeping')
      return { success: true, config }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteDamagePriceConfig(id: string) {
  try {
    await prisma.damagePriceConfig.delete({ where: { id } })
    revalidatePath('/settings')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─── 2. SYSTEM SETTINGS (ZERO CODE EDITING) ───────────────────────────────────
export async function getSystemSettings() {
  try {
    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: 'asc' },
    })
    return { success: true, settings }
  } catch (error: any) {
    return { success: false, settings: [], error: error.message }
  }
}

export async function updateSystemSetting(key: string, value: string) {
  try {
    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, category: 'GENERAL' },
    })

    await prisma.activityLog.create({
      data: {
        category: 'SETTINGS',
        action: 'UPDATE_SETTING',
        message: `System Setting '${key}' updated to '${value}'`,
        author: 'Admin Panel',
      },
    })

    revalidatePath('/settings')
    return { success: true, setting }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─── 3. ROOM CATEGORY CONFIGURATION ───────────────────────────────────────────
export async function getRoomCategories() {
  try {
    const categories = await prisma.roomCategory.findMany({
      include: { rooms: true },
      orderBy: { basePrice: 'asc' },
    })
    return { success: true, categories }
  } catch (error: any) {
    return { success: false, categories: [], error: error.message }
  }
}

export async function updateRoomCategoryPrice(categoryId: string, basePrice: number) {
  try {
    const category = await prisma.roomCategory.update({
      where: { id: categoryId },
      data: { basePrice },
    })
    revalidatePath('/settings')
    revalidatePath('/rooms')
    return { success: true, category }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─── 4. SERVICE CATALOG CONFIGURATION ─────────────────────────────────────────
export async function getServiceCatalog() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: { services: true },
    })
    return { success: true, categories }
  } catch (error: any) {
    return { success: false, categories: [], error: error.message }
  }
}

export async function upsertServiceItem(data: { id?: string; categoryId: string; name: string; price: number; description?: string }) {
  try {
    if (data.id) {
      const item = await prisma.serviceItem.update({
        where: { id: data.id },
        data: { name: data.name, price: data.price, description: data.description },
      })
      revalidatePath('/settings')
      revalidatePath('/services')
      return { success: true, item }
    } else {
      const item = await prisma.serviceItem.create({
        data: { categoryId: data.categoryId, name: data.name, price: data.price, description: data.description },
      })
      revalidatePath('/settings')
      revalidatePath('/services')
      return { success: true, item }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

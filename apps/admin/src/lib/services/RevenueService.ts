import { prisma } from '@hospitality-os/database'

export interface DailyRevenuePoint {
  dayLabel: string
  dateStr: string
  amount: number
  completedCount: number
}

export interface RevenueAnalyticsSummary {
  dailyData: DailyRevenuePoint[]
  sevenDayTotal: number
  prevSevenDayTotal: number
  sevenDayTrendPercent: number
  avgDailyRevenue: number
  monthlyRevenue: number
  prevMonthlyRevenue: number
  monthlyTrendPercent: number
  occupancyRate: number
  revPar: number
}

export class RevenueService {
  /**
   * Get complete revenue analytics metrics with real DB aggregation
   */
  static async getRevenueAnalytics(): Promise<RevenueAnalyticsSummary> {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)

    // 1. Current 7 Days Revenue (Day -6 to Day 0)
    const dailyData: DailyRevenuePoint[] = []
    let sevenDayTotal = 0

    for (let i = 6; i >= 0; i--) {
      const dStart = new Date(todayStart.getTime() - i * 86400000)
      const dEnd = new Date(dStart.getTime() + 86400000 - 1)

      // Query completed payments for this day (excluding cancelled bookings or refunded status)
      const payments = await prisma.payment.findMany({
        where: {
          createdAt: { gte: dStart, lte: dEnd },
          status: 'COMPLETED',
          booking: {
            status: { notIn: ['CANCELLED'] },
          },
        },
      })

      const amount = payments.reduce((sum, p) => sum + p.amount, 0)
      sevenDayTotal += amount

      const dayLabel = dStart.toLocaleDateString('en-US', { weekday: 'short' })
      const dateStr = dStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

      dailyData.push({
        dayLabel,
        dateStr,
        amount,
        completedCount: payments.length,
      })
    }

    // 2. Previous 7 Days Revenue (Day -13 to Day -7) for true comparison
    const prev7Start = new Date(todayStart.getTime() - 13 * 86400000)
    const prev7End = new Date(todayStart.getTime() - 7 * 86400000 - 1)

    const prevPayments = await prisma.payment.findMany({
      where: {
        createdAt: { gte: prev7Start, lte: prev7End },
        status: 'COMPLETED',
        booking: {
          status: { notIn: ['CANCELLED'] },
        },
      },
    })
    const prevSevenDayTotal = prevPayments.reduce((sum, p) => sum + p.amount, 0)

    let sevenDayTrendPercent = 0
    if (prevSevenDayTotal > 0) {
      sevenDayTrendPercent = Math.round(((sevenDayTotal - prevSevenDayTotal) / prevSevenDayTotal) * 1000) / 10
    } else if (sevenDayTotal > 0) {
      sevenDayTrendPercent = 100
    }

    const avgDailyRevenue = Math.round(sevenDayTotal / 7)

    // 3. Current Month Revenue (Day 1 of current month to now)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
    const currentMonthPayments = await prisma.payment.findMany({
      where: {
        createdAt: { gte: monthStart, lte: now },
        status: 'COMPLETED',
        booking: {
          status: { notIn: ['CANCELLED'] },
        },
      },
    })
    const monthlyRevenue = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0)

    // 4. Previous Month Revenue
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0)
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    const prevMonthPayments = await prisma.payment.findMany({
      where: {
        createdAt: { gte: prevMonthStart, lte: prevMonthEnd },
        status: 'COMPLETED',
        booking: {
          status: { notIn: ['CANCELLED'] },
        },
      },
    })
    const prevMonthlyRevenue = prevMonthPayments.reduce((sum, p) => sum + p.amount, 0)

    let monthlyTrendPercent = 0
    if (prevMonthlyRevenue > 0) {
      monthlyTrendPercent = Math.round(((monthlyRevenue - prevMonthlyRevenue) / prevMonthlyRevenue) * 1000) / 10
    } else if (monthlyRevenue > 0) {
      monthlyTrendPercent = 100
    }

    // 5. Live Occupancy & RevPAR
    const totalRooms = await prisma.room.count()
    const occupiedRooms = await prisma.room.count({ where: { status: 'OCCUPIED' } })
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    const daysInMonthSoFar = now.getDate()
    const revPar = totalRooms > 0 && daysInMonthSoFar > 0 
      ? Math.round(monthlyRevenue / (totalRooms * daysInMonthSoFar))
      : 0

    return {
      dailyData,
      sevenDayTotal,
      prevSevenDayTotal,
      sevenDayTrendPercent,
      avgDailyRevenue,
      monthlyRevenue,
      prevMonthlyRevenue,
      monthlyTrendPercent,
      occupancyRate,
      revPar,
    }
  }
}

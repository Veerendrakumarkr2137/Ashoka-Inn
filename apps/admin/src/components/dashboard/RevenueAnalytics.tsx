'use client'

import React, { useState } from 'react'
import { TrendingUp, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react'
import { DailyRevenuePoint } from '@/lib/services/RevenueService'

interface RevenueAnalyticsProps {
  dailyData: DailyRevenuePoint[]
  sevenDayTotal: number
  sevenDayTrendPercent: number
  monthlyRevenue: number
  monthlyTrendPercent: number
  occupancyRate: number
  revPar: number
}

export function RevenueAnalytics({
  dailyData,
  sevenDayTotal,
  sevenDayTrendPercent,
  monthlyRevenue,
  monthlyTrendPercent,
  occupancyRate,
  revPar,
}: RevenueAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'7days' | 'monthly'>('7days')

  const maxAmount = Math.max(...dailyData.map((d) => d.amount), 0)
  const avgDailyRevenue = Math.round(sevenDayTotal / (dailyData.length || 1))
  const isTrendPositive = sevenDayTrendPercent >= 0
  const isMonthlyTrendPositive = monthlyTrendPercent >= 0

  return (
    <div className="bg-white p-6 rounded-[var(--radius-card)] shadow-card border border-[var(--border-subtle)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">Revenue Analytics</h3>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full flex items-center gap-1 border ${
                isTrendPositive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {isTrendPositive ? `+${sevenDayTrendPercent}%` : `${sevenDayTrendPercent}%`}
              {isTrendPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time financial performance and occupancy trends from settled payments
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('7days')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === '7days'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Revenue (7 Days)
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Overview
          </button>
        </div>
      </div>

      {activeTab === '7days' ? (
        <div className="space-y-4">
          {/* Revenue Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {dailyData.map((d, index) => {
              // Exact mathematical height: 0% if amount is 0, proportional if amount > 0
              const heightPercent =
                maxAmount > 0 && d.amount > 0
                  ? Math.max(Math.round((d.amount / maxAmount) * 100), 6)
                  : 0

              const isToday = index === dailyData.length - 1

              return (
                <div key={d.dateStr} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on Hover - Exact Match to d.amount */}
                  <div className="absolute -top-11 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-xl pointer-events-none z-20 whitespace-nowrap flex flex-col items-center">
                    <span>₹{d.amount.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-slate-400 font-medium">{d.dateStr}</span>
                  </div>

                  <div className="w-full bg-slate-50 border border-slate-100 rounded-t-lg h-44 flex items-end p-1 relative overflow-hidden">
                    {heightPercent > 0 ? (
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isToday
                            ? 'bg-gradient-to-t from-[#C6A96B] to-[#E5C989] shadow-sm'
                            : 'bg-slate-800 hover:bg-[#C6A96B]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    ) : (
                      <div className="w-full h-0.5 bg-slate-200 rounded-full" />
                    )}
                  </div>
                  <div className="text-center">
                    <span className={`block text-xs font-semibold ${isToday ? 'text-[#C6A96B] font-extrabold' : 'text-slate-600'}`}>
                      {d.dayLabel}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {d.dateStr}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty Data Banner if 7-day total is 0 */}
          {sevenDayTotal === 0 && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold">
              <Info size={16} className="text-amber-600 shrink-0" />
              <span>No settled payment transactions recorded in the current 7-day window. Chart reflects actual ₹0 daily totals.</span>
            </div>
          )}

          {/* Quick Metrics Footer (3-Card Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <TrendingUp size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 truncate">7-Day Total Revenue</p>
                <p className="text-sm font-extrabold text-slate-900 truncate">
                  ₹{sevenDayTotal.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                <Calendar size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 truncate">Avg. Daily Revenue</p>
                <p className="text-sm font-extrabold text-slate-900 truncate">
                  ₹{avgDailyRevenue.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <ArrowUpRight size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 truncate">Live Occupancy</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-extrabold text-slate-900">{occupancyRate}%</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Active Stays</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Monthly View */
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">This Month's Settled Revenue</p>
              <h4 className="text-3xl font-extrabold text-slate-900 mt-1">
                ₹{monthlyRevenue.toLocaleString('en-IN')}
              </h4>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#C6A96B]/10 text-[#C6A96B] flex items-center justify-center">
              <DollarSign size={24} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-600">Month-over-Month Trend</span>
              <span className={`font-bold ${isMonthlyTrendPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isMonthlyTrendPositive ? `+${monthlyTrendPercent}%` : `${monthlyTrendPercent}%`} vs prev month
              </span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isMonthlyTrendPositive ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(Math.max(monthlyTrendPercent > 0 ? monthlyTrendPercent : 50, 10), 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Current Occupancy Rate</p>
              <p className="text-lg font-bold text-emerald-700 mt-0.5">{occupancyRate}%</p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">RevPAR (Revenue / Room / Day)</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">
                ₹{revPar.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

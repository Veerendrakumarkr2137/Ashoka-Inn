'use client'

import React, { useState, useTransition } from 'react'
import { 
  Settings, DollarSign, BedDouble, Wrench, Shield, Plus, Trash2, 
  CheckCircle, Save, Percent, Clock, AlertTriangle, RefreshCw, 
  RotateCcw, Database, Building, FileText, Bot, Sparkles, Sliders,
  Check, Phone, Mail, MapPin, Globe, CreditCard
} from 'lucide-react'
import { 
  upsertDamagePriceConfig, deleteDamagePriceConfig, 
  updateSystemSetting, updateRoomCategoryPrice, upsertServiceItem 
} from '@/actions/settings'

export function SettingsClient({
  damageConfigs,
  systemSettings,
  roomCategories,
  serviceCategories,
}: {
  damageConfigs: any[]
  systemSettings: any[]
  roomCategories: any[]
  serviceCategories: any[]
}) {
  const [activeTab, setActiveTab] = useState<'hotel' | 'booking' | 'finance' | 'housekeeping' | 'ai' | 'system' | 'damage' | 'rooms' | 'reset'>('hotel')
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Map system settings list into key-value map
  const settingsMap = React.useMemo(() => {
    const map: Record<string, string> = {
      hotel_name: 'Ashok Inn',
      hotel_phone: '+91 80 1234 5678',
      hotel_email: 'reservations@ashok-inn.com',
      hotel_address: 'Main Station Road, Davangere, Karnataka 577002',
      check_in_time: '14:00',
      check_out_time: '11:00',
      gst_tax_rate: '12.0',
      currency_code: 'INR',
      invoice_prefix: 'ASHOK-INV',
      ai_receptionist_enabled: 'true',
      ai_default_language: 'English, Hindi, Kannada',
      ai_voice_speed: '1.0',
      auto_assign_rooms: 'true',
      inspection_qa_required: 'true',
      audit_logging_enabled: 'true',
    }
    systemSettings.forEach((s) => {
      map[s.key] = s.value
    })
    return map
  }, [systemSettings])

  // Form states for active tab
  const [formState, setFormState] = useState<Record<string, string>>(settingsMap)

  // Damage Form state
  const [newDamageName, setNewDamageName] = useState('')
  const [newDamagePrice, setNewDamagePrice] = useState('')
  const [newDamageCategory, setNewDamageCategory] = useState('INVENTORY')

  const handleSettingChange = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettingKey = (key: string) => {
    const value = formState[key]
    setFeedback(null)
    startTransition(async () => {
      const res = await updateSystemSetting(key, value)
      if (res.success) {
        setFeedback({ type: 'success', message: `Saved setting '${key.replace(/_/g, ' ')}' successfully.` })
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update setting.' })
      }
    })
  }

  // Handler: Add Damage Price
  const handleAddDamageConfig = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDamageName || !newDamagePrice) return

    setFeedback(null)
    startTransition(async () => {
      const res = await upsertDamagePriceConfig({
        itemName: newDamageName,
        price: parseFloat(newDamagePrice),
        category: newDamageCategory,
      })

      if (res.success) {
        setFeedback({ type: 'success', message: `Added '${newDamageName}' (₹${newDamagePrice}) to Damage Price List.` })
        setNewDamageName('')
        setNewDamagePrice('')
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to add damage price.' })
      }
    })
  }

  // Handler: Delete Damage Price
  const handleDeleteDamage = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete '${name}' from damage pricing?`)) return

    setFeedback(null)
    startTransition(async () => {
      const res = await deleteDamagePriceConfig(id)
      if (res.success) {
        setFeedback({ type: 'success', message: `Deleted '${name}' from Damage Price List.` })
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to delete item.' })
      }
    })
  }

  // Handler: Update Room Category Base Price
  const handleUpdateRoomPrice = (catId: string, name: string, priceStr: string) => {
    const price = parseFloat(priceStr)
    if (isNaN(price)) return

    setFeedback(null)
    startTransition(async () => {
      const res = await updateRoomCategoryPrice(catId, price)
      if (res.success) {
        setFeedback({ type: 'success', message: `Updated base rate for '${name}' to ₹${price.toLocaleString('en-IN')}` })
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update rate.' })
      }
    })
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-slate-900 text-[#C6A96B] rounded-xl shadow-xs">
              <Settings size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Super Admin System Settings</h1>
          </div>
          <p className="text-xs text-slate-500">
            Enterprise PMS configuration engine for Hotel Metadata, Booking Rules, Taxes, Housekeeping Workflows, AI Reception & System Parameters.
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-900">✕</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-3 dark-scrollbar">
        {[
          { id: 'hotel', label: 'Hotel Profile', icon: Building },
          { id: 'booking', label: 'Booking Rules', icon: FileText },
          { id: 'finance', label: 'Finance & Tax', icon: DollarSign },
          { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
          { id: 'ai', label: 'AI Reception', icon: Bot },
          { id: 'system', label: 'System Behavior', icon: Sliders },
          { id: 'damage', label: 'Damage Pricing', icon: Wrench },
          { id: 'rooms', label: 'Room Category Rates', icon: BedDouble },
          { id: 'reset', label: 'Data Engine & Reset', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-[#C6A96B] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: HOTEL PROFILE */}
      {activeTab === 'hotel' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Hotel Profile & Operating Hours</h3>
            <p className="text-xs text-slate-500">Configure public hotel details displayed on invoices, guest web app, and AI phone receptionist.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Hotel Commercial Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formState['hotel_name'] || ''}
                  onChange={(e) => handleSettingChange('hotel_name', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('hotel_name')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Front Desk Contact Phone</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formState['hotel_phone'] || ''}
                  onChange={(e) => handleSettingChange('hotel_phone', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('hotel_phone')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Official Reservations Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={formState['hotel_email'] || ''}
                  onChange={(e) => handleSettingChange('hotel_email', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('hotel_email')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Standard Check-In Time</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={formState['check_in_time'] || '14:00'}
                  onChange={(e) => handleSettingChange('check_in_time', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('check_in_time')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Standard Check-Out Time</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={formState['check_out_time'] || '11:00'}
                  onChange={(e) => handleSettingChange('check_out_time', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('check_out_time')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Hotel Postal Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formState['hotel_address'] || ''}
                  onChange={(e) => handleSettingChange('hotel_address', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('hotel_address')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKING RULES */}
      {activeTab === 'booking' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Reservation & Room Assignment Rules</h3>
            <p className="text-xs text-slate-500">Configure check-in protocol, cancellation windows, and automated room rack allocation behavior.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Auto-Assign Room on Booking</label>
              <div className="flex gap-2">
                <select
                  value={formState['auto_assign_rooms'] || 'true'}
                  onChange={(e) => handleSettingChange('auto_assign_rooms', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-[#C6A96B]"
                >
                  <option value="true">Enabled (Auto-Assign Available Clean Room)</option>
                  <option value="false">Disabled (Manual Front Desk Assignment)</option>
                </select>
                <button onClick={() => saveSettingKey('auto_assign_rooms')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Cancellation Policy Window (Hours)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formState['cancellation_window_hours'] || '24'}
                  onChange={(e) => handleSettingChange('cancellation_window_hours', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('cancellation_window_hours')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FINANCE & TAX */}
      {activeTab === 'finance' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Finance, Invoice & Tax Settings</h3>
            <p className="text-xs text-slate-500">Configure GST tax percentage, invoice numbering format, currency symbol, and payment gateway options.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">GST Tax Rate (%)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={formState['gst_tax_rate'] || '12.0'}
                  onChange={(e) => handleSettingChange('gst_tax_rate', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('gst_tax_rate')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Invoice Number Prefix</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formState['invoice_prefix'] || 'ASHOK-INV'}
                  onChange={(e) => handleSettingChange('invoice_prefix', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('invoice_prefix')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Base Operating Currency Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formState['currency_code'] || 'INR'}
                  onChange={(e) => handleSettingChange('currency_code', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('currency_code')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOUSEKEEPING */}
      {activeTab === 'housekeeping' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Housekeeping & QA Inspection Protocol</h3>
            <p className="text-xs text-slate-500">Configure supervisor QA inspection requirements, room cleaning SLA times, and auto-dispatch rules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Supervisor QA Inspection Required</label>
              <div className="flex gap-2">
                <select
                  value={formState['inspection_qa_required'] || 'true'}
                  onChange={(e) => handleSettingChange('inspection_qa_required', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-[#C6A96B]"
                >
                  <option value="true">Mandatory (Supervisor must pass QA before room is READY)</option>
                  <option value="false">Optional (Direct transition from Cleaning to Ready)</option>
                </select>
                <button onClick={() => saveSettingKey('inspection_qa_required')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Checkout Cleaning SLA (Minutes)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formState['cleaning_sla_minutes'] || '45'}
                  onChange={(e) => handleSettingChange('cleaning_sla_minutes', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('cleaning_sla_minutes')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AI RECEPTION */}
      {activeTab === 'ai' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">AI Receptionist & Voice Automation Settings</h3>
            <p className="text-xs text-slate-500">Configure autonomous AI phone agent behavior, pre-arrival confirmation triggers, and multilingual capabilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">AI Receptionist Active Status</label>
              <div className="flex gap-2">
                <select
                  value={formState['ai_receptionist_enabled'] || 'true'}
                  onChange={(e) => handleSettingChange('ai_receptionist_enabled', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-[#C6A96B]"
                >
                  <option value="true">🟢 Active (AI handles pre-arrival calls & WhatsApp)</option>
                  <option value="false">🔴 Paused (All calls routed to human front desk)</option>
                </select>
                <button onClick={() => saveSettingKey('ai_receptionist_enabled')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Supported Voice Languages</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formState['ai_default_language'] || 'English, Hindi, Kannada'}
                  onChange={(e) => handleSettingChange('ai_default_language', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#C6A96B]"
                />
                <button onClick={() => saveSettingKey('ai_default_language')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SYSTEM BEHAVIOR */}
      {activeTab === 'system' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">System Audit & Notification Preferences</h3>
            <p className="text-xs text-slate-500">Configure audit logging policies, sound notification chimes, and security safeguards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Immutable Audit Logging</label>
              <div className="flex gap-2">
                <select
                  value={formState['audit_logging_enabled'] || 'true'}
                  onChange={(e) => handleSettingChange('audit_logging_enabled', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-[#C6A96B]"
                >
                  <option value="true">Enabled (Record all user actions to Audit Stream)</option>
                  <option value="false">Disabled</option>
                </select>
                <button onClick={() => saveSettingKey('audit_logging_enabled')} className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: DAMAGE PRICING */}
      {activeTab === 'damage' && (
        <div className="space-y-6">
          <form onSubmit={handleAddDamageConfig} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus size={16} className="text-[#C6A96B]" />
              <span>Add Damage Item Pricing</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Electric Kettle"
                  value={newDamageName}
                  onChange={(e) => setNewDamageName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C6A96B]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  placeholder="1500"
                  value={newDamagePrice}
                  onChange={(e) => setNewDamagePrice(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C6A96B]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Category</label>
                <select
                  value={newDamageCategory}
                  onChange={(e) => setNewDamageCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-[#C6A96B]"
                >
                  <option value="LINEN_ITEMS">Linen & Towels</option>
                  <option value="ELECTRONICS">Electronics & Remotes</option>
                  <option value="APPLIANCES">Appliances</option>
                  <option value="CROCKERY">Glass & Crockery</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-[#C6A96B] font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus size={14} /> Add Item to Price List
              </button>
            </div>
          </form>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Configured Damage Price List ({damageConfigs.length})</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {damageConfigs.map((config) => (
                <div key={config.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all">
                  <div>
                    <div className="font-bold text-slate-900">{config.itemName}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{config.category}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-[#C6A96B]">₹{config.price.toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => handleDeleteDamage(config.id, config.itemName)}
                      disabled={isPending}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-all cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: ROOM CATEGORY RATES */}
      {activeTab === 'rooms' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">Room Category Nightly Rates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roomCategories.map((cat) => (
              <div key={cat.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">{cat.name}</span>
                  <span className="text-xs font-bold text-slate-400">{cat.rooms?.length || 0} Rooms Allocated</span>
                </div>
                <p className="text-xs text-slate-500">{cat.description}</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      defaultValue={cat.basePrice}
                      onBlur={(e) => handleUpdateRoomPrice(cat.id, cat.name, e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-[#C6A96B]"
                    />
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-[#C6A96B] text-xs font-extrabold rounded-xl shadow-xs">
                    Update Rate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: DATA RESET & DEMO DATA ENGINE */}
      {activeTab === 'reset' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database size={20} className="text-[#C6A96B]" /> Enterprise Data Management & Reset Engine
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Clear test transactions or populate a clean 20-room sample hotel dataset for live staff demonstrations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Option 1: Data Reset */}
              <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
                <h3 className="text-xs font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-2">
                  <RotateCcw size={16} /> 1. Clear All Transactional Records
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Removes test bookings, payments, orders, housekeeping tasks, inspections, and audit logs.
                  <br /><strong className="text-slate-900 font-bold">Preserves:</strong> Room Categories, Rooms & System Settings.
                </p>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (confirm('⚠️ ARE YOU SURE? This will clear test bookings & payments.')) {
                      setFeedback(null)
                      startTransition(async () => {
                        try {
                          const res = await fetch('/api/pms/reset', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'RESET' }),
                          }).then((r) => r.json())

                          if (res.success) {
                            setFeedback({ type: 'success', message: 'All test transactions cleared successfully!' })
                            setTimeout(() => window.location.reload(), 800)
                          } else {
                            setFeedback({ type: 'error', message: res.error || 'Reset failed' })
                          }
                        } catch (err: any) {
                          setFeedback({ type: 'error', message: err.message || 'Reset failed' })
                        }
                      })
                    }
                  }}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  Clear Transactional Data
                </button>
              </div>

              {/* Option 2: Seed Demo Data */}
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <h3 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                  <RefreshCw size={16} /> 2. Seed 20-Room Sample Dataset
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Populates realistic sample reservations, active checked-in stays, confirmed arrivals, dirty rooms, and tasks for staff walkthroughs.
                </p>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (confirm('Seed realistic sample dataset for staff demonstration?')) {
                      setFeedback(null)
                      startTransition(async () => {
                        try {
                          const res = await fetch('/api/pms/reset', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'SEED_DEMO' }),
                          }).then((r) => r.json())

                          if (res.success) {
                            setFeedback({ type: 'success', message: 'Realistic sample dataset seeded successfully!' })
                            setTimeout(() => window.location.reload(), 800)
                          } else {
                            setFeedback({ type: 'error', message: res.error || 'Seeding failed' })
                          }
                        } catch (err: any) {
                          setFeedback({ type: 'error', message: err.message || 'Seeding failed' })
                        }
                      })
                    }
                  }}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  Seed 20-Room Sample Dataset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

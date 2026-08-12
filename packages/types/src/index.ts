// ============================================================
// HOSPITALITY OS — SHARED TYPE DEFINITIONS
// ============================================================

// ─── Multi-tenancy ───────────────────────────────────────────
export interface Tenant {
  id: string
  name: string
  subdomain: string
  customDomain?: string
  createdAt: Date
  updatedAt: Date
}

export interface Hotel {
  id: string
  tenantId: string
  name: string
  tagline?: string
  description?: string
  address: string
  city: string
  state?: string
  country: string
  zipCode?: string
  timezone: string
  currency: string
  phone?: string
  email?: string
  website?: string
  latitude?: number
  longitude?: number
  starRating?: number
  totalRooms: number
  createdAt: Date
  updatedAt: Date
}

export interface HotelBranding {
  id: string
  hotelId: string
  logoUrl?: string
  faviconUrl?: string
  primaryColor: string
  accentColor: string
  backgroundColor: string
  headingFont: string
  bodyFont: string
  heroImageUrl?: string
  heroVideoUrl?: string
}

// ─── Auth & Users ────────────────────────────────────────────
export type UserRole =
  | 'SUPER_ADMIN'
  | 'OWNER'
  | 'MANAGER'
  | 'RECEPTIONIST'
  | 'HOUSEKEEPING'
  | 'RESTAURANT'
  | 'FINANCE'
  | 'MARKETING'
  | 'READ_ONLY'
  | 'CUSTOM'

export type Permission =
  | 'VIEW'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'EXPORT'
  | 'APPROVE'
  | 'ASSIGN'
  | 'CONFIGURE'

export interface User {
  id: string
  hotelId: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  role: UserRole
  permissions: Permission[]
  isActive: boolean
  emailVerified: boolean
  twoFactorEnabled: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// ─── Rooms ───────────────────────────────────────────────────
export type RoomType =
  | 'STANDARD'
  | 'DELUXE'
  | 'EXECUTIVE'
  | 'SUITE'
  | 'FAMILY'
  | 'PRESIDENTIAL'
  | 'VILLA'
  | 'DORMITORY'
  | 'APARTMENT'
  | 'PENTHOUSE'

export type RoomStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'RESERVED'
  | 'CLEANING'
  | 'MAINTENANCE'
  | 'OUT_OF_SERVICE'

export type BedType =
  | 'SINGLE'
  | 'DOUBLE'
  | 'QUEEN'
  | 'KING'
  | 'TWIN'
  | 'BUNK'
  | 'SOFA_BED'

export interface RoomCategory {
  id: string
  hotelId: string
  name: string
  type: RoomType
  description: string
  shortDescription?: string
  basePrice: number
  weekendPrice?: number
  maxOccupancy: number
  maxAdults: number
  maxChildren: number
  sizeInSqft?: number
  bedType: BedType
  bedCount: number
  floorNumber?: number
  view?: string
  amenities: Amenity[]
  images: RoomImage[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Room {
  id: string
  hotelId: string
  categoryId: string
  category?: RoomCategory
  roomNumber: string
  floor: number
  status: RoomStatus
  isActive: boolean
  lastCleanedAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface RoomImage {
  id: string
  roomCategoryId: string
  url: string
  alt?: string
  caption?: string
  isPrimary: boolean
  sortOrder: number
}

export interface Amenity {
  id: string
  name: string
  icon: string
  category: 'ROOM' | 'HOTEL' | 'FOOD' | 'SPA' | 'BUSINESS' | 'TRANSPORT'
}

// ─── Bookings ─────────────────────────────────────────────────
export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'NO_SHOW'

export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED' | 'FAILED'

export interface Booking {
  id: string
  bookingNumber: string
  hotelId: string
  guestId: string
  guest?: Guest
  roomId?: string
  room?: Room
  roomCategoryId: string
  roomCategory?: RoomCategory
  status: BookingStatus
  paymentStatus: PaymentStatus
  checkIn: Date
  checkOut: Date
  nights: number
  adults: number
  children: number
  infants: number
  basePrice: number
  discountAmount: number
  taxAmount: number
  gstAmount: number
  addonAmount: number
  totalAmount: number
  couponCode?: string
  couponDiscount?: number
  specialRequests?: string
  addons: BookingAddon[]
  source: 'DIRECT' | 'WEBSITE' | 'WALKIN' | 'PHONE' | 'AGENCY' | 'CORPORATE' | 'AI'
  travelPurpose?: 'LEISURE' | 'BUSINESS' | 'FAMILY' | 'HONEYMOON' | 'OTHER'
  gstNumber?: string
  companyName?: string
  notes?: string
  arrivalTime?: string
  invoiceId?: string
  createdAt: Date
  updatedAt: Date
}

export interface BookingAddon {
  id: string
  bookingId: string
  addonId: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface SpecialRequest {
  id: string
  bookingId: string
  type:
    | 'AIRPORT_PICKUP'
    | 'EXTRA_BED'
    | 'LATE_CHECKOUT'
    | 'EARLY_CHECKIN'
    | 'BABY_CRIB'
    | 'WHEELCHAIR'
    | 'ROOM_DECORATION'
    | 'BIRTHDAY_CAKE'
    | 'CUSTOM'
  notes?: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'DECLINED'
}

// ─── Guests ──────────────────────────────────────────────────
export interface Guest {
  id: string
  hotelId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  nationality?: string
  country?: string
  address?: string
  city?: string
  dateOfBirth?: Date
  anniversaryDate?: Date
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  avatarUrl?: string
  gstNumber?: string
  companyName?: string
  isVIP: boolean
  loyaltyPoints: number
  totalStays: number
  totalNights: number
  totalSpent: number
  preferredLanguage: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface GuestPreferences {
  id: string
  guestId: string
  preferredRoomType?: RoomType
  preferredFloor?: 'LOW' | 'MIDDLE' | 'HIGH'
  preferredView?: string
  preferredBedType?: BedType
  dietaryRestrictions?: string[]
  specialNeeds?: string[]
  prefersSmoking: boolean
  prefersQuietRoom: boolean
  notes?: string
}

// ─── Pricing ─────────────────────────────────────────────────
export interface PricingBreakdown {
  roomCategoryId: string
  checkIn: Date
  checkOut: Date
  nights: number
  basePrice: number
  pricePerNight: number
  weekendSurcharge: number
  seasonalAdjustment: number
  dynamicAdjustment: number
  subtotal: number
  couponDiscount: number
  addonTotal: number
  taxableAmount: number
  gstRate: number
  gstAmount: number
  serviceCharge: number
  totalAmount: number
  currency: string
}

export interface Coupon {
  id: string
  hotelId: string
  code: string
  type:
    | 'PERCENTAGE'
    | 'FIXED'
    | 'FREE_BREAKFAST'
    | 'FREE_UPGRADE'
    | 'CORPORATE'
    | 'STUDENT'
    | 'MILITARY'
    | 'FESTIVAL'
    | 'REFERRAL'
  value: number
  minBookingAmount?: number
  maxDiscountAmount?: number
  validFrom: Date
  validUntil: Date
  maxUses?: number
  currentUses: number
  isActive: boolean
}

// ─── Payments ────────────────────────────────────────────────
export type PaymentMethod =
  | 'PAY_AT_HOTEL'
  | 'UPI'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'NET_BANKING'
  | 'RAZORPAY'
  | 'STRIPE'
  | 'PHONEPAY'
  | 'GOOGLE_PAY'

export type PaymentGateway = 'RAZORPAY' | 'STRIPE' | 'PHONEPAY' | 'MANUAL'

export interface Payment {
  id: string
  bookingId: string
  hotelId: string
  amount: number
  currency: string
  method: PaymentMethod
  gateway: PaymentGateway
  gatewayPaymentId?: string
  gatewayOrderId?: string
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
  failureReason?: string
  refundAmount?: number
  refundedAt?: Date
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

// ─── AI ──────────────────────────────────────────────────────
export type AIAgentType =
  | 'RECEPTIONIST'
  | 'BOOKING'
  | 'CONCIERGE'
  | 'CRM'
  | 'REVENUE'
  | 'MARKETING'
  | 'VOICE'
  | 'WHATSAPP'
  | 'EMAIL'
  | 'HOUSEKEEPING'
  | 'MAINTENANCE'
  | 'RESTAURANT'
  | 'REVIEW'
  | 'ANALYTICS'

export type ConversationChannel = 'WEB_CHAT' | 'WHATSAPP' | 'VOICE' | 'EMAIL'

export interface AIMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  agentType?: AIAgentType
  toolCalls?: AIToolCall[]
  tokensUsed?: number
  latencyMs?: number
  createdAt: Date
}

export interface AIToolCall {
  toolName: string
  input: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
  latencyMs?: number
}

export interface GuestMemory {
  id: string
  guestId: string
  hotelId: string
  memoryType: 'PREFERENCE' | 'COMPLAINT' | 'LIFE_EVENT' | 'GENERAL'
  content: string
  extractedAt: Date
}

// ─── Housekeeping ────────────────────────────────────────────
export type HousekeepingStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'INSPECTED'
  | 'ISSUE_REPORTED'

export interface HousekeepingTask {
  id: string
  hotelId: string
  roomId: string
  room?: Room
  assignedToId?: string
  status: HousekeepingStatus
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  taskType: 'CHECKOUT_CLEAN' | 'STAYOVER_CLEAN' | 'TURNDOWN' | 'DEEP_CLEAN' | 'INSPECTION'
  notes?: string
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// ─── Analytics ───────────────────────────────────────────────
export interface DashboardKPIs {
  todayRevenue: number
  todayBookings: number
  todayCheckIns: number
  todayCheckOuts: number
  occupiedRooms: number
  availableRooms: number
  totalRooms: number
  occupancyRate: number
  adr: number
  revpar: number
  pendingPayments: number
  cleaningQueue: number
  aiNotifications: number
}

export interface RevenueAnalytics {
  date: string
  revenue: number
  bookings: number
  avgBookingValue: number
  occupancyRate: number
}

// ─── API Response Wrappers ────────────────────────────────────
export interface ApiResponse<T> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    httpStatus: number
    appCode: number
    message: string
    details?: Record<string, unknown>
    requestId: string
    timestamp: string
  }
}

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ─── Search ──────────────────────────────────────────────────
export interface RoomSearchParams {
  checkIn: Date
  checkOut: Date
  adults: number
  children?: number
  infants?: number
  roomType?: RoomType
  minPrice?: number
  maxPrice?: number
  amenities?: string[]
  sortBy?: 'PRICE_ASC' | 'PRICE_DESC' | 'RATING' | 'POPULAR'
  couponCode?: string
}

// ─── Notifications ───────────────────────────────────────────
export type NotificationType =
  | 'BOOKING_CREATED'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_FAILED'
  | 'CHECKIN_REMINDER'
  | 'CHECKOUT_REMINDER'
  | 'HOUSEKEEPING_ASSIGNED'
  | 'MAINTENANCE_REQUEST'
  | 'AI_ALERT'
  | 'LOW_INVENTORY'
  | 'REVIEW_RECEIVED'

export interface Notification {
  id: string
  hotelId: string
  userId?: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  isRead: boolean
  createdAt: Date
}

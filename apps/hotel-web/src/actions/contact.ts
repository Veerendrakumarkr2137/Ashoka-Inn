'use server'

import { prisma } from '@hospitality-os/database'

export interface ContactInquiryInput {
  fullName: string
  email: string
  phone: string
  inquiryType: string
  message: string
}

export async function submitContactInquiry(input: ContactInquiryInput) {
  try {
    const { fullName, email, phone, inquiryType, message } = input

    if (!fullName || !email || !phone || !message) {
      return { success: false, error: 'Please fill in all required fields.' }
    }

    // 1. Save to Database
    const inquiry = await prisma.contactInquiry.create({
      data: {
        fullName,
        email,
        phone,
        inquiryType: inquiryType || 'General Inquiry',
        message,
        status: 'NEW',
      },
    })

    console.log(`[Contact Inquiry Saved] ID: ${inquiry.id} from ${fullName} (${email})`)

    return {
      success: true,
      message: 'Thank you! Your inquiry has been received and our team will get back to you shortly.',
      inquiryId: inquiry.id,
    }
  } catch (error) {
    console.error('[Contact Inquiry Error]:', error)
    return { success: false, error: 'Failed to submit inquiry. Please try again or call reception directly.' }
  }
}

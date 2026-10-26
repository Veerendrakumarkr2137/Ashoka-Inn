import nodemailer from 'nodemailer'

export interface BookingEmailPayload {
  guestEmail: string
  guestName: string
  bookingRef: string
  roomName: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  totalAmount: number
  specialRequests?: string
}

// Create reusable Nodemailer Transporter
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER || process.env.GMAIL_USER
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    console.warn('[Email Service] SMTP_USER or SMTP_PASS not set. Emails will log to console.')
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass
    }
  })
}

export async function sendBookingConfirmationEmail(payload: BookingEmailPayload) {
  try {
    const {
      guestEmail,
      guestName,
      bookingRef,
      roomName,
      checkIn,
      checkOut,
      nights,
      guests,
      totalAmount,
      specialRequests
    } = payload

    const formattedCheckIn = new Date(checkIn).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    const formattedCheckOut = new Date(checkOut).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    const gstAmount = Math.round(totalAmount * 0.12)
    const grandTotal = totalAmount + gstAmount

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #FAF8F5; color: #0F172A; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
          .header { background-color: #0F172A; color: #ffffff; padding: 32px 24px; text-align: center; }
          .logo { font-size: 26px; font-weight: bold; letter-spacing: 2px; color: #ffffff; margin: 0; font-family: Georgia, serif; }
          .sublogo { font-size: 10px; letter-spacing: 3px; color: #C6A96B; text-transform: uppercase; margin-top: 6px; font-weight: 600; }
          .content { padding: 32px 28px; }
          .badge { display: inline-block; background-color: #FAF8F5; color: #C6A96B; border: 1px solid #C6A96B; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; }
          .greeting { font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
          .intro { font-size: 14px; color: #6B7280; line-height: 1.6; margin-bottom: 24px; }
          .box { background: #FAF8F5; border-radius: 14px; padding: 20px; margin-bottom: 24px; border: 1px solid rgba(0,0,0,0.05); }
          .ref-title { font-size: 10px; font-weight: 700; color: #C6A96B; text-transform: uppercase; letter-spacing: 2px; }
          .ref-code { font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: 1px; margin: 4px 0 0 0; font-family: monospace; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { text-align: left; font-size: 11px; text-transform: uppercase; color: #6B7280; letter-spacing: 1px; padding-bottom: 8px; border-bottom: 1px solid #E5E7EB; }
          td { padding: 12px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #0F172A; }
          .label { color: #6B7280; font-size: 13px; }
          .val { font-weight: 600; text-align: right; }
          .total-row td { font-weight: 700; font-size: 16px; color: #0F172A; border-top: 2px solid #0F172A; border-bottom: none; padding-top: 16px; }
          .total-val { color: #C6A96B; }
          .info-card { background: #0F172A; color: #ffffff; border-radius: 14px; padding: 20px; font-size: 12px; line-height: 1.6; margin-bottom: 24px; }
          .info-card strong { color: #C6A96B; }
          .footer { text-align: center; padding: 24px; font-size: 12px; color: #9CA3AF; border-top: 1px solid #F3F4F6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">HOTEL ASHOK INN</h1>
            <div class="sublogo">LUXURY & ELEGANCE • DAVANAGERE</div>
          </div>
          
          <div class="content">
            <div class="badge">RESERVATION CONFIRMED</div>
            <div class="greeting">Dear ${guestName || 'Valued Guest'},</div>
            <div class="intro">
              Thank you for choosing Hotel Ashok Inn Davanagere. We are delighted to confirm your reservation. Below are your booking details:
            </div>

            <div class="box">
              <div class="ref-title">BOOKING REFERENCE CODE</div>
              <div class="ref-code">${bookingRef}</div>
            </div>

            <table>
              <thead>
                <tr>
                  <th colspan="2">RESERVATION DETAILS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="label">Room Category</td>
                  <td class="val">${roomName}</td>
                </tr>
                <tr>
                  <td class="label">Check-In Date</td>
                  <td class="val">${formattedCheckIn} (From 12:00 PM)</td>
                </tr>
                <tr>
                  <td class="label">Check-Out Date</td>
                  <td class="val">${formattedCheckOut} (Until 11:00 AM)</td>
                </tr>
                <tr>
                  <td class="label">Duration & Guests</td>
                  <td class="val">${nights} ${nights === 1 ? 'Night' : 'Nights'} • ${guests} Guest(s)</td>
                </tr>
                ${specialRequests ? `
                <tr>
                  <td class="label">Special Requests</td>
                  <td class="val">${specialRequests}</td>
                </tr>
                ` : ''}
                <tr>
                  <td class="label">Room Tariff (${nights} Nights)</td>
                  <td class="val">₹${totalAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td class="label">GST (12%)</td>
                  <td class="val">₹${gstAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr class="total-row">
                  <td class="label" style="font-weight: 700; color: #0F172A;">Total Amount Payable at Hotel</td>
                  <td class="val total-val">₹${grandTotal.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <div class="info-card">
              <strong>Check-In Instructions & Assistance:</strong><br/>
              • Location: Beside KSRTC Bus Stand, PB Road, Davanagere, Karnataka - 577004.<br/>
              • Please bring valid Government Photo ID (Aadhaar / Passport / DL) at check-in.<br/>
              • 24x7 Desk Support: <strong>+91 80 1234 5678</strong> | <strong>reservations@ashokinn.com</strong>
            </div>
          </div>

          <div class="footer">
            © ${new Date().getFullYear()} Hotel Ashok Inn Davanagere. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `

    const transporter = createTransporter()
    const fromAddress = process.env.SMTP_FROM || `"Hotel Ashok Inn" <reservations@ashokinn.com>`

    if (transporter) {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: guestEmail,
        subject: `Booking Confirmation - ${bookingRef} | Hotel Ashok Inn Davanagere`,
        html: htmlContent
      })
      console.log('[Email Service] Confirmation email sent successfully:', info.messageId)
      return { success: true, messageId: info.messageId }
    } else {
      console.log(`[Email Service Simulation] Booking Confirmation Email for ${guestEmail} (${bookingRef}):`)
      console.log(`To: ${guestEmail} | Guest: ${guestName} | Room: ${roomName} | Ref: ${bookingRef}`)
      return { success: true, simulated: true }
    }
  } catch (error) {
    console.error('[Email Service Error]:', error)
    return { success: false, error: 'Failed to send confirmation email' }
  }
}

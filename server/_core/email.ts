import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";

const useSendGrid = !!process.env.SENDGRID_API_KEY;

if (useSendGrid) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
}

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_FROM_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    if (useSendGrid) {
      await sgMail.send({
        to,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@hangoutsession.com",
        subject,
        html,
      });
    } else {
      await gmailTransporter.sendMail({
        to,
        from: process.env.GMAIL_FROM_EMAIL,
        subject,
        html,
      });
    }
    console.log(`✉️ Email sent to ${to}`);
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
}

// Email templates
export const emailTemplates = {
  welcomeEmail: (name: string) => ({
    subject: "Welcome to HangoutSession!",
    html: `
      <h1>Welcome to HangoutSession, ${name}!</h1>
      <p>Just be yourself — Get Booked to hangout face to face</p>
      <p>Start creating your first hangout session or browse amazing experiences today!</p>
    `,
  }),

  bookingConfirmation: (hostName: string, guestName: string, hangoutTitle: string, date: string) => ({
    subject: `New Booking: ${hangoutTitle}`,
    html: `
      <h1>Booking Confirmed!</h1>
      <p>Hi ${hostName},</p>
      <p>${guestName} has booked your "${hangoutTitle}" hangout for ${date}.</p>
      <p>Check your dashboard to view booking details and message your guest.</p>
    `,
  }),

  bookingRequest: (hostName: string, guestName: string, hangoutTitle: string) => ({
    subject: `New Booking Request: ${hangoutTitle}`,
    html: `
      <h1>New Booking Request!</h1>
      <p>Hi ${hostName},</p>
      <p>${guestName} wants to book your "${hangoutTitle}" hangout.</p>
      <p>Review the request and accept or decline in your dashboard.</p>
    `,
  }),

  paymentConfirmation: (guestName: string, amount: number, hangoutTitle: string) => ({
    subject: "Payment Confirmed",
    html: `
      <h1>Payment Confirmed</h1>
      <p>Hi ${guestName},</p>
      <p>Your payment of $${amount.toFixed(2)} for "${hangoutTitle}" has been processed successfully.</p>
      <p>Get ready for an amazing experience!</p>
    `,
  }),

  earningsNotification: (hostName: string, amount: number) => ({
    subject: "You've Earned Money!",
    html: `
      <h1>Earnings Update</h1>
      <p>Hi ${hostName},</p>
      <p>Congratulations! You've earned $${amount.toFixed(2)} from your hangout sessions.</p>
      <p>Check your earnings dashboard to request a payout.</p>
    `,
  }),
};

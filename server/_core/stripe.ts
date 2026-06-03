import Stripe from "stripe";
import { Request, Response } from "express";
import { db } from "../db";
import { bookings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function createCheckoutSession(
  hangoutId: string,
  guestId: string,
  hostId: string,
  guestCount: number,
  totalPrice: number,
  platformFee: number,
  hostEarnings: number,
  scheduledDate: string,
  scheduledTime: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Hangout Session Booking",
          },
          unit_amount: Math.round(totalPrice * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.VITE_APP_URL}/bookings?success=true`,
    cancel_url: `${process.env.VITE_APP_URL}/hangout/${hangoutId}?cancelled=true`,
    client_reference_id: guestId,
    metadata: {
      hangoutId,
      guestId,
      hostId,
      guestCount: guestCount.toString(),
      platformFee: platformFee.toString(),
      hostEarnings: hostEarnings.toString(),
      scheduledDate,
      scheduledTime,
    },
  });

  return session;
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (metadata && metadata.hangoutId && metadata.guestId) {
      // Create booking record
      const bookingId = `booking_${Date.now()}`;
      await db.insert(bookings).values({
        id: bookingId,
        hangoutId: metadata.hangoutId,
        guestId: metadata.guestId,
        hostId: metadata.hostId,
        status: "confirmed",
        guestCount: parseInt(metadata.guestCount),
        totalPrice: parseFloat(session.amount_total?.toString() || "0") / 100,
        platformFee: parseFloat(metadata.platformFee),
        hostEarnings: parseFloat(metadata.hostEarnings),
        paymentIntentId: session.payment_intent as string,
        scheduledDate: new Date(metadata.scheduledDate),
        scheduledTime: metadata.scheduledTime,
      });

      console.log(`✅ Booking created: ${bookingId}`);
    }
  }

  res.json({ received: true });
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/config/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const rawBody = await req.arrayBuffer();
  const body = Buffer.from(rawBody);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    const galleryId = metadata?.galleryId;
    const clerkId = metadata?.clerkId;

    if (!galleryId || !clerkId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      const gallery = await prisma.gallery.findUnique({
        where: { id: galleryId },
      });

      if (!gallery || gallery.quantity < 1) {
        return NextResponse.json(
          { error: "Gallery not available" },
          { status: 400 }
        );
      }

      await prisma.order.create({
        data: {
          user: { connect: { clerkId } },
          total: gallery.price,
          status: "PAID",
          stripeId: session.payment_intent as string,
          items: {
            create: {
              gallery: { connect: { id: galleryId } },
              quantity: 1,
              unitPrice: gallery.price,
            },
          },
        },
      });

      await prisma.gallery.update({
        where: { id: galleryId },
        data: {
          quantity: { decrement: 1 },
          soldCount: { increment: 1 },
        },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("🔥 Webhook processing error:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

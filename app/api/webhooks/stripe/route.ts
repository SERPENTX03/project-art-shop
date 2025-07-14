import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/config/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    const userId = metadata?.userId;
    const cartItemIds = metadata?.cartItemIds;

    if (!userId || !cartItemIds) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const itemIds = cartItemIds.split(",");

    try {
      const cartItems = await prisma.cartItem.findMany({
        where: { id: { in: itemIds } },
        include: { gallery: true },
      });

      if (!cartItems.length) {
        return NextResponse.json(
          { error: "No valid cart items" },
          { status: 400 }
        );
      }

      await prisma.order.create({
        data: {
          user: { connect: { clerkId: userId } },
          total: cartItems.reduce(
            (sum, item) => sum + item.gallery.price * item.quantity,
            0
          ),
          status: "PAID",
          stripeId: session.payment_intent as string,
          shippingFullName: metadata.shippingFullName,
          shippingPhone: metadata.shippingPhone,
          shippingAddressLine: metadata.shippingAddressLine,
          shippingSubDistrict: metadata.shippingSubDistrict,
          shippingDistrict: metadata.shippingDistrict,
          shippingProvince: metadata.shippingProvince,
          shippingPostalCode: metadata.shippingPostalCode,
          items: {
            create: cartItems.map((item) => ({
              gallery: { connect: { id: item.galleryId } },
              quantity: item.quantity,
              unitPrice: item.gallery.price,
            })),
          },
        },
      });

      for (const item of cartItems) {
        await prisma.gallery.update({
          where: { id: item.galleryId },
          data: {
            quantity: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      await prisma.cartItem.deleteMany({
        where: { id: { in: itemIds } },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("🔥 Webhook processing error:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItem } from "@/types/cart";
import { Address } from "@/types/adress";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      items,
      total,
      address,
    }: { items: CartItem[]; total: number; address: Address } = body;

    if (!items || items.length === 0 || !total || !address) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "thb",
          product_data: {
            name: item.gallery.title,
          },
          unit_amount: Math.round(item.gallery.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success/stripe?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      metadata: {
        userId,
        cartItemIds: items.map((i) => i.id).join(","),
        shippingFullName: address.fullName,
        shippingPhone: address.phone,
        shippingAddressLine: address.addressLine,
        shippingSubDistrict: address.subDistrict,
        shippingDistrict: address.district,
        shippingProvince: address.province,
        shippingPostalCode: address.postalCode,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

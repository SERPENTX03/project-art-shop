import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItem } from "@/types/cart";
import { Address } from "@/types/adress";
import prisma from "@/config/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      items,
      address,
    }: { items: CartItem[]; address: Address } = body;

    if (!items || items.length === 0 || !address) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    // ✅ รวมสินค้าที่ซ้ำกัน (ป้องกันแสดงรายการซ้ำ)
    const mergedItemsMap: { [galleryId: string]: CartItem } = {};
    for (const item of items) {
      const id = item.gallery.id;
      if (!mergedItemsMap[id]) {
        mergedItemsMap[id] = { ...item };
      } else {
        mergedItemsMap[id].quantity += item.quantity;
      }
    }
    const mergedItems = Object.values(mergedItemsMap);

    // ✅ เตรียม line items และค่าส่ง
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let shippingTotal = 0;

    for (const item of mergedItems) {
      const product = await prisma.gallery.findUnique({
        where: { id: item.gallery.id },
      });

      if (!product || product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `สินค้า ${product?.title || "ไม่พบ"} หมดแล้ว` },
          { status: 400 }
        );
      }

      lineItems.push({
        price_data: {
          currency: "thb",
          product_data: {
            name: product.title,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });

      // ✅ คำนวณค่าส่งต่อชิ้น
      const sizeCm = Number(product.imageSize);
      let shippingFee = 0;
      if (sizeCm < 100) shippingFee = 100;
      else if (sizeCm <= 150) shippingFee = 300;
      else if (sizeCm <= 200) shippingFee = 500;
      else if (sizeCm <= 300) shippingFee = 1000;

      shippingTotal += shippingFee * item.quantity;
    }

    // ✅ เพิ่มค่าส่งแยกเป็น line item
    if (shippingTotal > 0) {
      lineItems.push({
        price_data: {
          currency: "thb",
          product_data: {
            name: "ค่าจัดส่ง",
          },
          unit_amount: Math.round(shippingTotal * 100),
        },
        quantity: 1,
      });
    }

    // ✅ สร้าง Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success/stripe?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      metadata: {
        userId,
        cartItemIds: mergedItems.map((i) => i.id).join(","),
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
      { error: "ไม่สามารถสร้าง Stripe Checkout ได้" },
      { status: 500 }
    );
  }
}

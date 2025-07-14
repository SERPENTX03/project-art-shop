import prisma from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import { CartItem } from "@/types/cart";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ เช็กว่าเป็น charge.complete
    if (
      body.object === "event" &&
      body.key === "charge.complete" &&
      body.data?.object === "charge"
    ) {
      const charge = body.data;

      const omiseId = charge.id;
      const status = charge.status;

      console.log("📦 Omise webhook received. Charge ID:", omiseId);

      // ✅ ป้องกันการสร้างซ้ำ
      const existingOrder = await prisma.order.findFirst({
        where: { omiseId },
      });

      if (existingOrder) {
        console.log("⚠️ Order already exists:", existingOrder.id);
        return NextResponse.json({ received: true });
      }

      // ✅ ดำเนินการต่อเมื่อชำระสำเร็จเท่านั้น
      if (status === "successful") {
        const metadata = charge.metadata || {};
        const userId = metadata.userId;

        if (!userId || !metadata.cartItems) {
          console.error("❌ Missing metadata for order creation.");
          return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        const cartItems = JSON.parse(metadata.cartItems) as CartItem[];

        let productTotal = 0;
        let shippingTotal = 0;

        // ✅ ตรวจสอบสินค้าอีกครั้งและคำนวณราคา
        for (const item of cartItems) {
          const product = await prisma.gallery.findUnique({
            where: { id: item.gallery.id },
          });

          if (!product) {
            console.error("❌ Product not found:", item.gallery.id);
            continue;
          }

          const sizeCm = Number(product.imageSize);
          let shippingFee = 0;
          if (sizeCm < 100) shippingFee = 100;
          else if (sizeCm <= 150) shippingFee = 300;
          else if (sizeCm <= 200) shippingFee = 500;
          else if (sizeCm <= 300) shippingFee = 1000;

          shippingTotal += shippingFee * item.quantity;
          productTotal += product.price * item.quantity;
        }

        const finalTotal = productTotal + shippingTotal;

        // ✅ สร้าง Order
        const order = await prisma.order.create({
          data: {
            user: { connect: { clerkId: userId } },
            omiseId,
            total: finalTotal,
            status: "PAID",
            shippingFullName: metadata.shippingFullName,
            shippingPhone: metadata.shippingPhone,
            shippingAddressLine: metadata.shippingAddressLine,
            shippingSubDistrict: metadata.shippingSubDistrict,
            shippingDistrict: metadata.shippingDistrict,
            shippingProvince: metadata.shippingProvince,
            shippingPostalCode: metadata.shippingPostalCode,
            items: {
              create: cartItems.map((item) => ({
                galleryId: item.gallery.id,
                quantity: item.quantity,
                unitPrice: item.gallery.price,
              })),
            },
          },
        });

        // ✅ ตัด stock
        for (const item of cartItems) {
          await prisma.gallery.update({
            where: { id: item.gallery.id },
            data: {
              quantity: { decrement: item.quantity },
              soldCount: { increment: item.quantity },
            },
          });
        }

        console.log("✅ Order created:", order.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Omise Webhook Error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

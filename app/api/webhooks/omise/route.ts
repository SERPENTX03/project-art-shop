import prisma from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (
    body.object === "event" &&
    body.key === "charge.complete" &&
    body.data?.object === "charge"
  ) {
    const charge = body.data;
    console.log("Webhook Charge ID:", charge.id);

    const order = await prisma.order.findFirst({
      where: {
        omiseId: charge.id,
        status: "PENDING",
      },
      include: { items: true },
    });

    if (!order) {
      console.log("❌ ไม่พบ order ที่ omiseId =", charge.id);
    } else {
      console.log("✅ พบ order แล้ว:", order.id);
    }

    if (charge.status === "successful") {
      const order = await prisma.order.findFirst({
        where: {
          omiseId: charge.id,
          status: "PENDING",
        },
        include: {
          items: {
            select: {
              galleryId: true,
              quantity: true,
            },
          },
        },
      });

      if (order) {
        const {
          shippingFullName,
          shippingPhone,
          shippingAddressLine,
          shippingSubDistrict,
          shippingDistrict,
          shippingProvince,
          shippingPostalCode,
        } = charge.metadata || {};

        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            shippingFullName,
            shippingPhone,
            shippingAddressLine,
            shippingSubDistrict,
            shippingDistrict,
            shippingProvince,
            shippingPostalCode,
          },
        });

        for (const item of order.items) {
          await prisma.gallery.update({
            where: { id: item.galleryId },
            data: {
              quantity: { decrement: item.quantity },
              soldCount: { increment: item.quantity },
            },
          });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}

import prisma from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Webhook POST received");

  const body = await req.json();

  if (
    body.object === "event" &&
    body.key === "charge.complete" &&
    body.data?.object === "charge"
  ) {
    const charge = body.data;

    if (charge.status === "successful") {
      const order = await prisma.order.findFirst({
        where: {
          omiseId: charge.id,
          status: "PENDING",
        },
        include: { items: true },
      });

      if (order && order.items.length > 0) {
        const galleryId = order.items[0].galleryId;

        // อัปเดตสถานะ Order
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID" },
        });

        // อัปเดตสินค้า
        await prisma.gallery.update({
          where: { id: galleryId },
          data: {
            quantity: { decrement: 1 },
            soldCount: { increment: 1 },
          },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}

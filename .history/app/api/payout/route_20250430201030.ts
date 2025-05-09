import prisma from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { shopId, amount, galleryIds, note } = await req.json();
    console.log("Body received:", req);

    if (
      !shopId ||
      !amount ||
      !Array.isArray(galleryIds) ||
      galleryIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payout = await prisma.payout.create({
      data: {
        amount,
        status: "PAID",
        transferredAt: new Date(),
        note: note || "ชำระจากแอดมิน",
        shop: {
          connect: { id: shopId },
        },
        gallery: {
          connect: { id: galleryIds[0] },
        },
      },
    });

    // update order item paidToShop to true
    await prisma.orderItem.updateMany({
      where: {
        galleryId: { in: galleryIds },
        paidToShop: false,
      },
      data: {
        paidToShop: true,
      },
    });

    return NextResponse.json({ success: true, payout }, { status: 201 });
  } catch (err) {
    console.error("Error creating payout:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err },
      { status: 500 }
    );
  }
}

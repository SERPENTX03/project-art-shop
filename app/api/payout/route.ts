import prisma from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { shopId, amount, galleryIds, orderItemIds, note } = await req.json();

    if (
      !shopId ||
      !amount ||
      !Array.isArray(galleryIds) ||
      galleryIds.length === 0 ||
      !Array.isArray(orderItemIds) ||
      orderItemIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    //  ตรวจสอบว่าสถานะการจัดส่งของ orderItem เป็น DELIVERED ทั้งหมด
    const undeliveredItems = await prisma.orderItem.findMany({
      where: {
        id: { in: orderItemIds },
        deliveryStatus: { not: "DELIVERED" }, // 👈 ห้ามยืนยันถ้าไม่ส่งสำเร็จ
      },
    });

    if (undeliveredItems.length > 0) {
      return NextResponse.json(
        {
          error: "พบรายการที่ยังจัดส่งไม่สำเร็จ ห้ามยืนยันการโอน",
          items: undeliveredItems.map((i) => ({
            id: i.id,
            status: i.deliveryStatus,
          })),
        },
        { status: 400 }
      );
    }

    // สร้าง Payout
    const payout = await prisma.payout.create({
      data: {
        amount,
        status: "PAID",
        transferredAt: new Date(),
        note: note || "ชำระจากแอดมิน",
        artist: {
          connect: { id: shopId },
        },
        gallery: {
          connect: { id: galleryIds[0] },
        },
      },
    });

    //  อัปเดต paidToShop = true เฉพาะรายการที่อนุญาต
    await prisma.orderItem.updateMany({
      where: {
        id: { in: orderItemIds },
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

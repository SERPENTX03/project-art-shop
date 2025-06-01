"use server";

import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";

export async function getShopOrders() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const artist = await prisma.artistProfile.findFirst({
    where: { userId },
  });

  if (!artist) throw new Error("ไม่พบร้านค้าของคุณ");

  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          gallery: {
            shopManageId: artist.id,
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          gallery: true,
        },
      },
    },
  });

  return orders;
}

// ดึง order ที่ยังไม่ได้จัดส้ง
export async function getPendingOrders() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const artist = await prisma.artistProfile.findFirst({
    where: { userId },
  });
  if (!artist) throw new Error("ไม่พบร้านของคุณ");

  const pendingItems = await prisma.orderItem.findMany({
    where: {
      gallery: {
        shopManageId: artist.id,
      },
      deliveryStatus: "PENDING",
    },
  });

  return pendingItems;
}

// นับจำนวน order ที่ยังไม่ได้จัดส่ง badge Navside

export async function getPendingOrderCount() {
  const { userId } = await auth();
  if (!userId) return 0;

  const artist = await prisma.artistProfile.findFirst({
    where: { userId },
  });

  const count = await prisma.orderItem.count({
    where: {
      gallery: {
        shopManageId: artist?.id,
      },
      deliveryStatus: "PENDING",
    },
  });
  return count;
}

// อัปเดตสถานะการจัดส่ง
export async function updateDeliveryStatus(
  orderItemId: string,
  status: "SHIPPED" | "DELIVERED",
  trackingNumber?: string
) {
  await prisma.orderItem.update({
    where: { id: orderItemId },
    data: {
      deliveryStatus: status,
      ...(trackingNumber && { trackingNumber }),
      ...(status === "DELIVERED" && { deliveredAt: new Date() }),
    },
  });
}

"use server";

import prisma from "@/config/db";
export async function getTotalSalesAllShops(
  startDate?: Date,
  endDate?: Date
) {
  const result = await prisma.orderItem.groupBy({
    by: ["galleryId"],
    _sum: {
      unitPrice: true,
      quantity: true,
    },
    where: {
      order: {
        status: "PAID",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });

  const shopTotalsMap: Record<
    string,
    { shopName: string | null; totalSales: number }
  > = {};

  for (const row of result) {
    const gallery = await prisma.gallery.findUnique({
      where: { id: row.galleryId },
      include: {
        user: {
          select: {
            clerkId: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!gallery?.user) continue;

    const shopId = gallery.user.clerkId;
    const shopName =
      gallery.user.username ||
      `${gallery.user.firstName || ""} ${gallery.user.lastName || ""}`.trim();

    const rowTotal =
      (row._sum.unitPrice || 0) * (row._sum.quantity || 0);

    if (!shopTotalsMap[shopId]) {
      shopTotalsMap[shopId] = { shopName, totalSales: 0 };
    }
    shopTotalsMap[shopId].totalSales += rowTotal;
  }

  return Object.entries(shopTotalsMap).map(([shopId, data]) => ({
    shopId,
    shopName: data.shopName,
    totalSales: data.totalSales,
  }));
}

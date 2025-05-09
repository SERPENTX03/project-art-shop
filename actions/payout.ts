"use server";

import prisma from "@/config/db";

export const fetchSoldGalleriesWithShop = async () => {
  try {
    const galleries = await prisma.gallery.findMany({
      where: {
        soldCount: {
          gt: 0,
        },
      },
      include: {
        shop: true,
        orderItems: {
          include: {
            order: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return galleries;
  } catch (error) {
    console.error("Failed to fetch sold galleries:", error);
    return [];
  }
};

//Fetch Payout
export const fetchPayoutByUserId = async (userId: string) => {
  try {
    const payout = await prisma.payout.findMany({
      where: {
        shop: {
          userId: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return payout;
  } catch (error) {
    console.error("Failed to fetch payout:", error);
    return [];
  }
};

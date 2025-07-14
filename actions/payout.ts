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
        artist: {
          select: {
            id: true,
            name: true,
            phone: true,
            bankName: true,
            accountName: true,
            accountNumber: true,
          },
        },
        orderItems: {
          include: {
            order: {
              select: {
                id: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return galleries;
  } catch (error) {
    console.error("❌ Failed to fetch sold galleries:", error);
    return [];
  }
};

//Fetch Payout
export const fetchPayoutByUserId = async (userId: string) => {
  try {
    const payout = await prisma.payout.findMany({
      where: {
        artist: {
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


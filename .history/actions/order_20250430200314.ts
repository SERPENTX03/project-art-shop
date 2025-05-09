"use server";

import prisma from "@/config/db";

export const fetchOrdersByShopOwner = async (shopOwnerId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            gallery: {
              userId: shopOwnerId,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            gallery: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return orders;
  } catch (error) {
    console.error("Error to fetch orders by shop owner", error);
    throw new Error("Failed to fetch shop orders");
  }
};

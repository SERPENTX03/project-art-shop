"use server";

import prisma from "@/config/db";

export const fetchOrderByShop = async (userId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            gallery: {
              userId,
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

export const fetchUserOrderItems = async (userId: string) => {
  try {
    const items = await prisma.orderItem.findMany({
      where: {
        order: {
          userId,
        },
      },
      orderBy: {
        order: {
          createdAt: "asc",
        },
      },
      include: {
        order: {
          select: {
            id: true,
            createdAt: true,
          },
        },
        gallery: {
          include: {
            shop: true,
          },
        },
      },
    });

    return items;
  } catch (error) {
    console.error("Error fetching order items for user:", error);
    throw new Error("Failed to fetch your order items");
  }
};

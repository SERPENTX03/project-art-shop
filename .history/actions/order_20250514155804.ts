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

export const fetchOrderByUser = async (userId: string) => {
  const order = await prisma.order.findFirst({
    where: { userId },
  });

  return order;
};

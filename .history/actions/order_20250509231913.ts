"use server";

import prisma from "@/config/db";

export const fetchOrderById = async (userId: string) => {
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
    console.log(orders);

    return orders;
  } catch (error) {
    console.error("Error to fetch orders by shop owner", error);
    throw new Error("Failed to fetch shop orders");
  }
};

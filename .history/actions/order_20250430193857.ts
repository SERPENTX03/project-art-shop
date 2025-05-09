"use server";

import prisma from "@/config/db";

export const fetchOrderById = async (userId: string) => {
  try {
    const order = prisma.order.findMany({
      where: { userId },
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

    console.log(order);
    return order;
  } catch (error) {
    console.error("Error to fetch order", error);
    throw new Error("Fetch to shop Errorr");
  }
};

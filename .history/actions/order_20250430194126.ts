"use server";

import prisma from "@/config/db";

export const fetchOrderById = async (userId: string) => {
  console.log(userId);
  try {
    const order = await prisma.order.findMany({
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

    console.log("Orders found:", order.length);
    return order;
  } catch (error) {
    console.error("Error to fetch order", error);
    throw new Error("Fetch to shop Errorr");
  }
};

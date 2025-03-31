"use server";

import prisma from "@/config/db";

export const fetchOrderById = async (clerkId: string) => {
  try {
    const order = prisma.order.findMany({
      where: { userId: clerkId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            gallery: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error to fetch order", error);
    throw new Error("Fetch to shop Errorr");
  }
};

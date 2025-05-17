"use server";

import prisma from "@/config/db";

export const requestReturn = async (itemId: string, reason: string) => {
  try {
    const item = await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        returnRequested: true,
        returnReason: reason,
        returnStatus: "RETURN_REQUESTED",
      },
    });

    return item;
  } catch (error) {
    console.error("Failed to request return:", error);
    throw new Error("Unable to process return request");
  }
};

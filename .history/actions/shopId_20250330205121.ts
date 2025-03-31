import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";

export const fetchShopId = async () => {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return {
      success: false,
      error: "Unauthrized",
    };
  }

  const shop = await prisma.shopManage.findFirst({
    where: { userId: clerkId },
    select: { id: true, name: true },
  });
};

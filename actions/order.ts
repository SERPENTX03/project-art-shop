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
            artist: true,
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

export const fetchUnpaidOrderItemsForArtist = async (artistId: string) => {
  try {
    const unpaidItems = await prisma.orderItem.findMany({
      where: {
        paidToShop: false,
        order: {
          status: "PAID", // ✅ เฉพาะออเดอร์ที่ชำระแล้ว
        },
        gallery: {
          userId: artistId, // ✅ ของศิลปินคนนี้
        },
      },
      include: {
        gallery: {
          select: {
            id: true,
            title: true,
            price: true,
            imageSize: true,
            images: true,
          },
        },
        order: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    return unpaidItems;
  } catch (err) {
    console.error("❌ Failed to fetch unpaid items:", err);
    return [];
  }
};

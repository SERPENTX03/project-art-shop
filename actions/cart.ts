"use server";

import prisma from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";

export async function addtoCart(galleryId: string, quantity: number) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;

  // ค้นหาหรือสร้างตะกร้าสำหรับผู้ใช่
  let cart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  // เช็คว่ามี item นี้อยู่ใน cart แล้วหรือยัง
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_galleryId: {
        cartId: cart.id,
        galleryId,
      },
    },
  });

  if (existingItem) {
    // 3. ถ้ามีอยู่แล้ว -> เพิ่ม quantity
    await prisma.cartItem.update({
      where: {
        cartId_galleryId: {
          cartId: cart.id,
          galleryId,
        },
      },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  } else {
    // 4. ถ้าไม่มี -> สร้างใหม่
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        galleryId,
        quantity,
      },
    });
  }
}

export const getCartItemCount = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userId = user.id;
  if (!userId) return 0;

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: true,
    },
  });

  if (!cart) return 0;

  // total cartItem
  // รวม quantity ทั้งหมดจาก cartItem
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return totalItems;
};

export async function getUserAllCart() {
  const user = await currentUser();
  if (!user) {
    return [];
  }
  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          gallery: true,
        },
      },
    },
  });
  return cart?.items ?? [];
}

export const updateCartItemQuantity = async (id: string, quantity: number) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const item = await prisma.cartItem.findUnique({
    where: { id },
  });

  if (!item) {
    throw new Error("ไม่พบสินค้าในตะกร้า");
  }
  await prisma.cartItem.update({
    where: { id },
    data: { quantity },
  });

  return { success: true };
};

export const removeFromCart = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const item = await prisma.cartItem.findUnique({ where: { id } });

  if (!item) {
    throw new Error("ไม่พบสินค้าในตะกร้า");
  }

  await prisma.cartItem.delete({
    where: { id },
  });
};

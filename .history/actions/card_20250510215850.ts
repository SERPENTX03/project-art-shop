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
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      galleryId,
    },
  });

  if (existingItem) {
    // ถ้ามี ให้เพิ่มจำนวน
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        galleryId,
        quantity,
      },
    });
  }
}

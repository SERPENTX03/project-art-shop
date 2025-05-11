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

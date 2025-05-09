"use server";

import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

export async function addToCart(galleryId: string, quantity: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  // หาตะกร้าสินค้าของผู้ใช้
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  // ถ้ายังไม่มีตะกร้า สร้างใหม่
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        user: { connect: { clerkId: userId } },
      },
      include: { items: true },
    });
  }

  // ตรวจสอบว่าสินค้ามีอยู่ในตะกร้าแล้วหรือไม่
  const existingItem = cart.items.find((item) => item.galleryId === galleryId);

  if (existingItem) {
    // อัปเดตจำนวนสินค้าที่มีอยู่
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    // เพิ่มสินค้าใหม่
    await prisma.cartItem.create({
      data: {
        cart: { connect: { id: cart.id } },
        gallery: { connect: { id: galleryId } },
        quantity,
      },
    });
  }

  revalidatePath("/");
  return { success: true };
}

export async function getCart() {
  const { userId } = await auth();
  if (!userId) return null;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          gallery: true,
        },
      },
    },
  });

  return cart;
}

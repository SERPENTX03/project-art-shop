"use server";

import prisma from "@/config/db";
import { Address } from "@/types/adress";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export async function createAddress(data: Address) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const userId = user.id;

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...data,
        userId,
        type: data.type ?? "HOME",
        isDefault: data.isDefault ?? false,
      },
    });

    revalidatePath("/cart/checkout");
    return { success: true, address };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function updateAddress(id: string, data: Address) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const userId = user.id;

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data,
    });

    revalidatePath("/cart/checkout");
    return { success: true, updated };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteAddress(id: string) {
  try {
    await prisma.address.delete({ where: { id } });
    revalidatePath("/cart/checkout");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getUserAddresses() {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const userId = user.id;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });

    return { success: true, addresses };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

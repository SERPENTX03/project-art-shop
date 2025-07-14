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

    // ตรวจสอบว่า address ที่จะอัปเดตมีอยู่จริงและเป็นของ user คนนี้
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id, 
        userId 
      },
    });

    if (!existingAddress) {
      throw new Error("Address not found or unauthorized");
    }

    // ถ้าตั้งเป็น default ให้ปรับ address อื่นๆ ให้ไม่เป็น default ก่อน
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId,
          id: { not: id } // ไม่รวม address ที่กำลังอัปเดต
        },
        data: { isDefault: false },
      });
    }

    // สร้าง data object ที่สะอาดโดยไม่รวม fields ที่ไม่จำเป็น
    const updateData: Partial<Address> = {
      fullName: data.fullName,
      phone: data.phone,
      addressLine: data.addressLine,
      province: data.province,
      district: data.district,
      subDistrict: data.subDistrict,
      postalCode: data.postalCode,
      isDefault: data.isDefault ?? false,
    };

    // ลบ fields ที่ undefined หรือ null
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof Address] === undefined || updateData[key as keyof Address] === null) {
        delete updateData[key as keyof Address];
      }
    });

    const updated = await prisma.address.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/cart/checkout");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Update address error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัปเดตที่อยู่" 
    };
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

"use server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/config/db";
import { revalidatePath } from "next/cache";

export type FormState = {
  success: boolean;
  // message?: string;
};

// Zod Schema สำหรับตรวจสอบข้อมูลร้านค้า
const createShopSchema = z.object({
  name: z.string().min(2, "Shop name is required"),
  phone: z
    .string()
    .min(9, "Phone number too short")
    .max(15, "Phone number too long")
    .regex(/^\d+$/, "Phone must be numeric"),
});

export async function createShop(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, message: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    const validated = createShopSchema.safeParse({ name, phone });

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.errors.map((e) => e.message).join(", "),
      };
    }

    // เช็คว่ามีร้านอยู่แล้วหรือไม่
    const existingShop = await prisma.shopManage.findFirst({
      where: { userId: clerkId },
    });

    if (existingShop) {
      return {
        success: false,
        message: "You already created a shop",
      };
    }

    await prisma.shopManage.create({
      data: {
        name: validated.data.name,
        phone: validated.data.phone,
        user: {
          connect: { clerkId },
        },
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Shop created successfully!",
    };
  } catch (error) {
    console.error("Error creating shop:", error);
    return {
      success: false,
      message: "Failed to create shop",
    };
  }
}

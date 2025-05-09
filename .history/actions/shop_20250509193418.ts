"use server";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/config/db";
import { revalidatePath } from "next/cache";

export type FormState = {
  success?: boolean;
  message?: string;
};

// Zod Schema สำหรับตรวจสอบข้อมูลร้านค้า
const createShopSchema = z.object({
  name: z.string().min(2, "Shop name is required"),
  phone: z.coerce
    .string()
    .min(9, "Phone number too short")
    .max(15, "Phone number too long"),
  bankName: z.string().min(2),
  accountName: z.string().min(2),
  accountNumber: z.string().min(8),
  promptpayId: z.string().optional(),
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

    const user = await currentUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    // ตรวจสอบว่า user มีอยู่ใน Prisma หรือยัง
    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          clerkId,
          email: user.emailAddresses[0].emailAddress,
          profileImage: user.imageUrl,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    }

    //  รับค่าจากฟอร์ม
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const bankName = formData.get("bankName") as string;
    const accountName = formData.get("accountName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const promptpayId = formData.get("promptpayId") as string | null;

    //  Validate ด้วย Zod
    const validated = createShopSchema.safeParse({
      name,
      phone,
      bankName,
      accountName,
      accountNumber,
      promptpayId: promptpayId || undefined,
    });

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.errors.map((e) => e.message).join(", "),
      };
    }

    // ตรวจว่าร้านมีอยู่แล้วไหม
    const existingShop = await prisma.shopManage.findFirst({
      where: { userId: clerkId },
    });

    if (existingShop) {
      return {
        success: false,
        message: "You already created a shop",
      };
    }

    //  สร้างร้านค้าพร้อมข้อมูลบัญชี
    await prisma.shopManage.create({
      data: {
        name: validated.data.name,
        phone: validated.data.phone,
        bankName: validated.data.bankName,
        accountName: validated.data.accountName,
        accountNumber: validated.data.accountNumber,
        promptpayId: validated.data.promptpayId,
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

export async function fetchShopInfoByUserId(userId: string) {
  try {
    const shop = await prisma.shopManage.findFirst({
      where: {
        user: {
          clerkId: userId,
        },
      },
    });

    return shop;
  } catch (error) {
    console.error("Failed to fetch shop info:", error);
    return null;
  }
}

export async function updateShopBankInfo(formData: FormData) {
  // const userId = formData.get("userId") as string;
  const bankName = formData.get("bankName") as string | null;
  const accountName = formData.get("accountName") as string | null;
  const accountNumber = formData.get("accountNumber") as string | null;
  const promptpayId = formData.get("promptpayId") as string | null;

  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const shop = await prisma.shopManage.findFirst({
      where: {
        user: {
          clerkId: userId,
        },
      },
    });

    if (!shop) {
      throw new Error("Shop not found");
    }

    const updatedShop = await prisma.shopManage.update({
      where: {
        id: shop.id,
      },
      data: {
        bankName,
        accountName,
        accountNumber,
        promptpayId: promptpayId || null,
      },
    });

    revalidatePath("/dashboard/shop");

    return { success: true, shop: updatedShop };
  } catch (error) {
    console.error("Failed to update shop bank info:", error);
    return { success: false, message: "Update failed" };
  }
}

"use server";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/config/db";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";

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
  address: z.string().min(2),
});

export async function createArtist(
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

    // รับค่าจากฟอร์ม
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const bankName = formData.get("bankName") as string;
    const accountName = formData.get("accountName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const promptpayId = formData.get("promptpayId") as string | null;
    const address = formData.get("address") as string;


    // Validate ด้วย Zod
    const validated = createShopSchema.safeParse({
      name,
      phone,
      bankName,
      accountName,
      accountNumber,
      promptpayId: promptpayId || undefined,
      address,
    });

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.errors.map((e) => e.message).join(", "),
      };
    }

    // ตรวจว่าร้านมีอยู่แล้วไหม
    const existingShop = await prisma.artistProfile.findFirst({
      where: { userId: clerkId },
    });

    if (existingShop) {
      return {
        success: false,
        message: "You already created a shop",
      };
    }

    // สร้างร้านค้าพร้อมข้อมูลบัญชี
    await prisma.artistProfile.create({
      data: {
        name: validated.data.name,
        phone: validated.data.phone,
        bankName: validated.data.bankName,
        accountName: validated.data.accountName,
        accountNumber: validated.data.accountNumber,
        promptpayId: validated.data.promptpayId,
        address: validated.data.address,
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

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "ชื่อศิลปินนี้ถูกใช้ไปแล้ว กรุณาใช้ชื่ออื่น",
      };
    }

    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการสร้างร้านค้า กรุณาลองใหม่",
    };
  }
}

export async function fetchArtist(userId: string) {
  try {
    const shop = await prisma.artistProfile.findFirst({
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

export async function fetchAllArtist() {
  const artist = await prisma.artistProfile.findMany();
  return artist;
}

export const fetchArtistById = async (artistId: string) => {
  if (!artistId) throw new Error("Missing artistId");

  const artist = await prisma.artistProfile.findUnique({
    where: { id: artistId },
    include: {
      Post: {
        orderBy: { createdAt: "asc" },
        include: {
          Reaction: { select: { emoji: true } },
          PollQuestion: {
            include: {
              options: {
                include: {
                  votes: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return artist;
};

export async function updateArtistBankInfo(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const newBankName = formData.get("bankName") as string | null;
  const newAccountName = formData.get("accountName") as string | null;
  const newAccountNumber = formData.get("accountNumber") as string | null;
  const newPromptpayId = formData.get("promptpayId") as string | null;

  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };

  try {
    const shop = await prisma.artistProfile.findFirst({
      where: {
        user: {
          clerkId: userId,
        },
      },
    });

    if (!shop) {
      return { success: false, message: "ไม่พบร้านค้า" };
    }

    // ใช้ของใหม่ถ้ามี ถ้าไม่มีใช้ค่าปัจจุบันจาก DB
    await prisma.artistProfile.update({
      where: { id: shop.id },
      data: {
        bankName: newBankName ?? shop.bankName,
        accountName: newAccountName ?? shop.accountName,
        accountNumber: newAccountNumber ?? shop.accountNumber,
        promptpayId: newPromptpayId ?? shop.promptpayId,
      },
    });

    revalidatePath("/dashboard/shop");

    return { success: true, message: "อัปเดตข้อมูลสำเร็จ" };
  } catch (error) {
    console.error("Failed to update shop bank info:", error);
    return { success: false, message: "เกิดข้อผิดพลาดในการอัปเดต" };
  }
}

export const uploadArtistAvatar = async (formData: FormData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const file = formData.get("avatar") as File;
  if (!file || file.size === 0) throw new Error("No file provided");

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "artist-avatars",
            public_id: `artist_${userId}`,
            overwrite: true,
            transformation: [
              { width: 300, height: 300, crop: "thumb", gravity: "face" },
            ],
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as { secure_url: string });
          }
        )
        .end(buffer);
    }
  );

  await prisma.artistProfile.updateMany({
    where: { userId },
    data: { avatar: result.secure_url },
  });

  return result.secure_url;
};

export const updateArtistBio = async (bio: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const updated = await prisma.artistProfile.updateMany({
    where: { userId },
    data: { bio },
  });

  if (updated.count === 0) {
    throw new Error("Artist profile not found");
  }

  return { success: true, message: "Updated Bio Success!" };
};

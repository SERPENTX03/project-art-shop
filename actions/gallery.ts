"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import cloudinary from "@/lib/cloudinary";
import { Gallery } from "@/types/gallery";

// Schema validatation for zod

const createGallerySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.number().min(1, "Price is required"),
  quantity: z.number().min(1, "Quantity is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  imageAdmin: z
    .array(z.string())
    .min(1, "ต้องอัปโหลดรูป preview อย่างน้อย 1 รูป")
    .max(10, "รูป preview ได้สูงสุด 10 รูป"),
});
// Type สำหรับ FormState
export type FormState = {
  success: boolean;
  message?: string;
  data?: Gallery;
};

export async function createGallery(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, message: "Unauthorized" };
    }

    // รับข้อมูลจาก form
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const quantity = Number(formData.get("quantity") || 0);
    const categoryNames = formData.getAll("categoryIds") as string[];
    const imageSize = formData.get("imageSize") as string;
    const imageFiles = (formData.getAll("images") as File[]).filter(
      (file) => file.size > 0
    );
    const adminImageFiles = (formData.getAll("imageAdmin") as File[]).filter(
      (file) => file.size > 0
    );

    if (adminImageFiles.length < 1 || adminImageFiles.length > 10) {
      return {
        success: false,
        message: "กรุณาอัปโหลดรูป preview อย่างน้อย 1 และไม่เกิน 10 รูป",
      };
    }

    if (!imageFiles.length) {
      return {
        success: false,
        message: "No valid images uploaded",
      };
    }

    //  ค้นหา artist ของผู้ใช้จาก clerkId
    const artist = await prisma.artistProfile.findFirst({
      where: { userId: clerkId },
    });

    if (!artist) {
      return {
        success: false,
        message: "ไม่พบร้านค้าสำหรับผู้ใช้นี้",
      };
    }

    const imageAdminArray = await Promise.all(
      adminImageFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise<string>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "gallery/admin" }, (error, result) => {
              if (error || !result) return reject(error);
              resolve(result.secure_url);
            })
            .end(buffer);
        });
      })
    );

    // ⬆️ อัปโหลดภาพ
    const imagesArray = await Promise.all(
      imageFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise<string>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "gallery" }, (error, result) => {
              if (error || !result) return reject(error);
              resolve(result.secure_url);
            })
            .end(buffer);
        });
      })
    );

    // ⛑️ validate ข้อมูล
    const validatedData = createGallerySchema.parse({
      title,
      description,
      price,
      images: imagesArray,
      quantity,
      imageAdmin: imageAdminArray,
    });

    //  บันทึก Gallery
    const newGallery = await prisma.gallery.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        images: validatedData.images,
        imageAdmin: validatedData.imageAdmin,
        imageSize: imageSize,
        quantity: validatedData.quantity,
        status: "PENDING",
        user: {
          connect: { clerkId },
        },
        artist: {
          connect: {
            id: artist.id,
          },
        },
        categories: {
          create: categoryNames.map((name) => ({
            category: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      },
    });

    revalidatePath("/gallery");

    return {
      success: true,
      message: "Gallery created successfully",
      data: newGallery,
    };
  } catch (error) {
    console.error("Error creating gallery:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create gallery",
    };
  }
}
export async function fetchAllGalleries() {
  try {
    const galleries = await prisma.gallery.findMany({
      where: {
        status: "APPROVED", // แสดงเฉพาะที่ผ่านการอนุมัติ
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return galleries;
  } catch (error) {
    console.error("Error fetching galleries:", error);
    throw new Error("ไม่สามารถดึงข้อมูลแกลเลอรี่ได้");
  }
}

//filter categories
export async function fetchGalleriesByCategory(categoryName: string) {
  try {
    const galleries = await prisma.gallery.findMany({
      where: {
        status: "APPROVED",
        categories: {
          some: {
            category: {
              name: categoryName,
            },
          },
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return galleries;
  } catch (error) {
    console.error("Error fetching galleries by category:", error);
    throw new Error("Failed to fetch galleries by category");
  }
}

export async function fetchGalleryByUserId(userId: string) {
  try {
    const galleries = await prisma.gallery.findMany({
      where: {
        userId,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        artist: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return galleries;
  } catch (error) {
    console.error("❌ Error fetching gallery by user ID", error);
    throw new Error("Failed to fetch galleries by user ID");
  }
}

export async function fetchGalleryById(id: string) {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    if (!gallery) {
      throw new Error("not found gallery");
    }

    return gallery;
  } catch (error) {
    console.error("Error fetching gallery by Id", error);
    throw new Error("Not fetching gallery!!");
  }
}

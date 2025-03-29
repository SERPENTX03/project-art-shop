"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import cloudinary from "@/lib/cloudinary";

// Schema validatation for zod

const createGallerySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.number().min(1, "At price is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});
// Type สำหรับ FormState
export type FormState = {
  success: boolean;
  message?: string;
  data?: any;
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

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const imageFiles = formData.getAll("images") as File[];

    if (!imageFiles || imageFiles.length === 0) {
      return {
        success: false,
        message: "No images uploaded",
      };
    }

    // อัปโหลดภาพทั้งหมดไปยัง Cloudinary
    const uploadPromises = imageFiles.map(async (file) => {
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
    });

    const imagesArray = await Promise.all(uploadPromises);

    // Validate ข้อมูล
    const validatedData = createGallerySchema.parse({
      title,
      description,
      price,
      images: imagesArray,
    });

    // บันทึกข้อมูลลงฐานข้อมูล
    const newGallery = await prisma.gallery.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        images: validatedData.images,
        user: {
          connect: { clerkId },
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
      },
    });
  } catch (error) {
    console.error("Error fetching gallery by Id", error);
    throw new Error("Not fetching gallery!!");
  }
}

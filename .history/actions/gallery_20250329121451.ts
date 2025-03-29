"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { ObjectId } from "mongodb";

// Schema validatation for zod

const createGallerySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});
// Type สำหรับ FormState
export type FormState = {
  success: boolean;
  message?: string;
  data?: any;
};

export async function createGallery(
  prevState: FormState, // รับ state ก่อนหน้า
  formData: FormData
): Promise<FormState> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    console.log("Test User Id", userId);

    const rawData = Object.fromEntries(formData);
    let imagesArray: string[];

    // จัดการ images input
    if (typeof rawData.images === "string") {
      // ถ้าเป็น URL เดี่ยว ให้ใส่ใน array
      if (rawData.images.startsWith("http")) {
        imagesArray = [rawData.images];
      }
      // ถ้าเป็น JSON array ให้ parse
      else {
        try {
          imagesArray = JSON.parse(rawData.images);
        } catch (e) {
          return {
            success: false,
            message: "Invalid images format. Use a URL or JSON array.",
          };
        }
      }
    } else {
      imagesArray = rawData.images ? [String(rawData.images)] : [];
    }
    const validatedData = createGallerySchema.parse({
      title: rawData.title,
      description: rawData.description,
      images: imagesArray,
    });

    const newGallery = await prisma.gallery.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        images: validatedData.images,
        userId,
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
      orderBy: {
        createdAt: "desc", // เรียงตามวันที่สร้างล่าสุด
      },
    });

    return galleries;
  } catch (error) {
    console.error("Error fetching galleries:", error);
    throw new Error("ไม่สามารถดึงข้อมูลแกลเลอรี่ได้");
  }
}

"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// Schema validatation for zod

const createGallerySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

//function createAction
export const createGallery = async (formData: FormData) => {
  try {
    // ดึง userId จาก Clerk
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // แปลง FormData เป็น object
    const rawData = Object.fromEntries(formData);

    // แปลง images จาก string (ถ้าส่งมาเป็น JSON) หรือจัดการตาม format ที่ส่งมา
    let imagesArray: string[];
    if (typeof rawData.images === "string") {
      imagesArray = JSON.parse(rawData.images);
    } else {
      imagesArray = Array.isArray(rawData.images)
        ? rawData.images.map((file: File) => file.name || "")
        : [];
    }

    // Validate ข้อมูล
    const validatedData = createGallerySchema.parse({
      title: rawData.title,
      description: rawData.description,
      images: imagesArray,
    });

    // สร้าง gallery ใน database ด้วย Prisma
    const newGallery = await prisma.gallery.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        images: validatedData.images,
        userId: userId, // เชื่อมโยงกับ user ที่ล็อกอิน
      },
    });

    // Revalidate path เพื่ออัพเดทข้อมูลในหน้า
    revalidatePath("/gallery"); // ปรับ path ตามที่คุณใช้

    return {
      success: true,
      data: newGallery,
    };
  } catch (error) {
    console.error("Error creating gallery:", error);

    // จัดการ error message
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create gallery",
    };
  }
};

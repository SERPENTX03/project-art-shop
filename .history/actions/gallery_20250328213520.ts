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

    const rawData = Object.fromEntries(formData);
    let imagesArray: string[];
    if (typeof rawData.images === "string") {
      imagesArray = JSON.parse(rawData.images);
    } else {
      if (
        Array.isArray(rawData.images) &&
        rawData.images.every((img) => img instanceof File)
      ) {
        imagesArray = rawData.images.map((file) => file.name); // Extract file names
      } else if (typeof rawData.images === "string") {
        imagesArray = [rawData.images];
      } else {
        imagesArray = [];
      }
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
        userId: userId,
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

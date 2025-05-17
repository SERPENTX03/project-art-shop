"use server";

import prisma from "@/config/db";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function requestReturn(
  orderItemId: string,
  formData: FormData
): Promise<void> {
  const reason = formData.get("reason") as string;
  const images = formData.getAll("images") as File[];

  if (!reason) throw new Error("Reason is required");

  // อัปโหลดรูปภาพไปยัง Cloudinary
  const uploadedUrls: string[] = [];

  for (const file of images) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const upload = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "returns" }, (err, result) => {
            if (err || !result) return reject(err);
            resolve(result as any);
          })
          .end(buffer);
      }
    );

    uploadedUrls.push(upload.secure_url);
  }

  await prisma.orderItem.update({
    where: { id: orderItemId },
    data: {
      returnRequested: true,
      returnReason: reason,
      returnImages: uploadedUrls,
      returnStatus: "REQUESTED",
    },
  });

  revalidatePath("/account/orders");
}

export async function approveReturn(orderItemId: string) {
  await prisma.orderItem.update({
    where: { id: orderItemId },
    data: { returnStatus: "APPROVED" },
  });
}

export async function rejectReturn(orderItemId: string) {
  await prisma.orderItem.update({
    where: { id: orderItemId },
    data: { returnStatus: "REJECTED" },
  });
}

export async function rejectReturnWithNote(orderItemId: string, note: string) {
  if (!note || note.trim().length === 0) {
    throw new Error("กรุณาระบุหมายเหตุการปฏิเสธ");
  }

  return prisma.orderItem.update({
    where: { id: orderItemId },
    data: {
      returnStatus: "REJECTED",
      returnNote: note,
    },
  });
}

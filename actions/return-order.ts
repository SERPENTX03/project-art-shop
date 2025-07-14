"use server";

import prisma from "@/config/db";
import cloudinary from "@/lib/cloudinary";
import { ReturnStatus } from "@prisma/client";
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
            resolve(result);
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

const statusFlow: ReturnStatus[] = [
  "REQUESTED",
  "APPROVED",
  "RECEIVED",
  "REFUNDED",
];

export async function progressReturnStatus(orderItemId: string) {
  const item = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    select: { returnStatus: true },
  });

  if (!item?.returnStatus) throw new Error("ยังไม่มีสถานะการคืน");

  const currentIndex = statusFlow.indexOf(item.returnStatus);
  if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
    throw new Error("ไม่สามารถอัปเดตสถานะได้");
  }

  const nextStatus = statusFlow[currentIndex + 1];

  return prisma.orderItem.update({
    where: { id: orderItemId },
    data: { returnStatus: nextStatus },
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

"use server";

import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";

export const voteOnPost = async (postId: string, value: 1 | -1) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const existing = await prisma.vote.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existing) {
      if (existing.value === value) {
        // ยกเลิก vote ถ้ากดซ้ำ
        await prisma.vote.delete({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
        });
        return { removed: true };
      } else {
        // เปลี่ยนจาก up ↔ down
        await prisma.vote.update({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
          data: { value },
        });
        return { updated: true };
      }
    }

    // ยังไม่เคยโหวต → create
    await prisma.vote.create({
      data: {
        postId,
        userId,
        value,
      },
    });

    return { created: true };
  } catch (err) {
    console.error(err);
    throw new Error("ไม่สามารถโหวตได้");
  }
};

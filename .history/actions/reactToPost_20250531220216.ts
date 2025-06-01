"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/config/db";
export const reactToPost = async (postId: string, emoji: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // พยายาม insert ถ้ายังไม่เคยกด emoji นี้ใน post นี้
  try {
    await prisma.reaction.create({
      data: {
        postId,
        emoji,
        userId,
      },
    });
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.code === "P2002") {
        // unique constraint failed = เคยกดแล้ว
        return { success: false, message: "คุณกด emoji นี้ไปแล้ว" };
      }
    }

    throw err;
  }
};

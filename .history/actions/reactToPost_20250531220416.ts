"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/config/db";

export const toggleReaction = async (postId: string, emoji: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await prisma.reaction.findFirst({
    where: {
      postId,
      emoji,
      userId,
    },
  });

  if (existing) {
    await prisma.reaction.delete({
      where: {
        id: existing.id,
      },
    });
    return { success: true, removed: true };
  }

  await prisma.reaction.create({
    data: {
      postId,
      emoji,
      userId,
    },
  });

  return { success: true, removed: false };
};

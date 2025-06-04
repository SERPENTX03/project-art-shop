"use server";

import prisma from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";

export const toggleFavorite = async (galleryId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthoized");
  const userId = user.id;

  const existing = await prisma.favorite.findFirst({
    where: { userId, galleryId },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: { id: existing.id },
    });
    return { message: "ยกเลิกถูกใจแล้ว 💔", isFavorite: false };
  }

  await prisma.favorite.create({
    data: {
      userId,
      galleryId,
    },
  });

  return { message: "ถูกใจแล้ว ❤️", isFavorite: true };
};

// Count Favorite for a Gallery
export const getMyFavoriteCount = async () => {
  const user = await currentUser();
  if (!user) return 0;

  return await prisma.favorite.count({
    where: { userId: user.id },
  });
};

// Get Galleries Favorited by Current User
export const getMyFavorites = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const userId = user.id;

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      gallery: true,
    },
  });

  return favorites.map((f) => f.gallery);
};

"use server";

import prisma from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";

export async function addtoCart(galleryId: string, quantity: number) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
}

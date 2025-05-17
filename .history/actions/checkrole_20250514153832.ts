"use server";

import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";

const getRole = async () => {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findFirst({
    where: { clerkId: userId },
  });

  return user;
};

export default getRole;

"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/config/db";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return true;
}

export async function requireAdminAPI() {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") return false;

  return true;
}

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

  if (!user) {
    redirect("/");
  }

  if (user.role === "ADMIN") {
    redirect("/admin/galleries");
  }

  // ถ้าไม่ใช่ admin และไม่ต้องการให้เข้า
  redirect("/");
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

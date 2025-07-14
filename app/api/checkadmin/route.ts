import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/config/db";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ role: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  return NextResponse.json({ role: user?.role ?? null }, { status: 200 });
}

import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shop = await prisma.shopManage.findFirst({
    where: { userId: clerkId },
    select: { id: true, name: true },
  });

  if (!shop) {
    return redirect("/createshop");
  }

  return NextResponse.json(shop);
}

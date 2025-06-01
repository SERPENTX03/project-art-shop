import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const artist = await prisma.artistProfile.findFirst({
    where: { userId: clerkId },
    select: { id: true, name: true },
  });

  if (!artist) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  return NextResponse.json(artist);
}

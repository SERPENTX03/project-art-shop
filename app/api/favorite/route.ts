import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const galleryId = searchParams.get("galleryId");

  const user = await currentUser();
  if (!user || !galleryId) {
    return NextResponse.json({ isFavorite: false });
  }

  const favorite = await prisma.favorite.findFirst({
    where: {
      userId: user.id,
      galleryId,
    },
  });

  return NextResponse.json({ isFavorite: !!favorite });
}

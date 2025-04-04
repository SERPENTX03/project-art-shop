import { requireAdminAPI } from "@/actions/chackadmin";
import prisma from "@/config/db";
import { NextResponse } from "next/server";

export async function GET() {
  const isAdmin = await requireAdminAPI();

  if (!isAdmin) {
    return NextResponse.json({ error: "Admin Only" }, { status: 403 });
  }

  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    where: { status: { not: "APPROVED" } },
  });

  console.log(galleries);

  return NextResponse.json(galleries);
}

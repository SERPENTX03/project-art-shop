import prisma from "@/config/db";
import { requireAdmin } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // const authError = await requireAdmin(req);
  // if (authError) return authError;

  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    where: { status: { not: "APPROVED" } },
  });

  return NextResponse.json(galleries);
}

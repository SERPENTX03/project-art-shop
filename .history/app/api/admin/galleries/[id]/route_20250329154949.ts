import prisma from "@/config/db";
import { requireAdmin } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // const authError = await requireAdmin(req);
  // if (authError) return authError;

  const { status } = await req.json();

  if (!status || !["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.gallery.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(updated);
}

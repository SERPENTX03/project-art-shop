import { requireAdminAPI } from "@/actions/checkadmin";
import prisma from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const isAdmin = await requireAdminAPI();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const { status, reasons } = await req.json();

  if (!status || !["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updated = await prisma.gallery.update({
      where: { id },
      data: {
        status,
        rejectReasons: reasons || [],
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating gallery status:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

import prisma from "@/config/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payouts = await prisma.payout.findMany({
      where: {
        status: "PAID",
      },
      select: {
        id: true,
        galleryId: true,
        transferredAt: true,
      },
    });

    return NextResponse.json(payouts, { status: 201 });
  } catch (error) {
    console.error("Error fetching payout history", error);
    return NextResponse.json(
      {
        error: "Failed to load payout history",
      },
      { status: 500 }
    );
  }
}

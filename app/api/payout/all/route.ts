import prisma from "@/config/db";
import { NextResponse } from "next/server";

export async function GET() {
  const payouts = await prisma.payout.findMany({
    orderBy: { transferredAt: "desc" },
    include: {
      artist: {
        select: {
          name: true,
        },
      },
      gallery: {
        select: {
          title: true,
        },
      },
    },
  });

  return NextResponse.json({ payouts });
}

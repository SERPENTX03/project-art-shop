// /api/order/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/config/db";

export async function GET(req: NextRequest) {
  const chargeId = req.nextUrl.searchParams.get("chargeId");

  if (!chargeId) {
    return NextResponse.json({ error: "Missing chargeId" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { omiseId: chargeId },
  });

  if (!order) {
    return NextResponse.json({ status: "NOT_FOUND" });
  }

  return NextResponse.json({ status: order.status });
}

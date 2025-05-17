import Omise from "omise";
import { NextRequest, NextResponse } from "next/server";

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC_KEY!,
  secretKey: process.env.OMISE_SECRET_KEY!,
});

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  try {
    const charge = await omise.charges.retrieve(orderId);
    return NextResponse.json({ status: charge.status });
  } catch (err) {
    console.error("Fetch order status error:", err);
    return NextResponse.json(
      { error: "Unable to retrieve order status" },
      { status: 500 }
    );
  }
}

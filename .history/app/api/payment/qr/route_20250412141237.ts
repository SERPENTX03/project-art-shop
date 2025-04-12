import { NextResponse } from "next/server";
import Omise from "omise";

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC_KEY!,
  secretKey: process.env.OMISE_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const { amount, description } = await req.json();

    const charge = await omise.charges.create({
      amount: Math.round(amount * 100), // THB → satang
      currency: "thb",
      return_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      source: {
        type: "promptpay",
      },
      description,
    });
    return NextResponse.json({
      qr: charge.source.scannable_code.image.download_uri,
      chargeId: charge.id,
    });
  } catch (err) {
    console.error("Omise error:", err);
    return NextResponse.json({ error: "Omise QR failed" }, { status: 500 });
  }
}

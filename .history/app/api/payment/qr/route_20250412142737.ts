import { NextResponse } from "next/server";
import Omise from "omise";
import { prisma } from "@/config/db";

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
        amount: Math.round(amount * 100),
        currency: "thb",
      },
      description,
    });

    const chargeId = charge.id;
    const qrUrl = charge.source?.scannable_code?.image?.download_uri;

    if (!qrUrl) {
      throw new Error("QR code generation failed");
    }

    const order = await prisma.order.create({
      data: {
        userId,
        total: amount,
        status: PaymentStatus.PENDING,
        provider: PaymentProvider.OMISE,
        omiseId: chargeId,
        items: {
          create: [
            {
              galleryId,
              quantity: 1,
              unitPrice: amount,
            },
          ],
        },
      },
    });

    return NextResponse.json({
      qr: qrUrl,
      chargeId: chargeId,
      orderId: order.id,
    });
  } catch (err) {
    console.error("Omise error:", err);
    return NextResponse.json({ error: "Omise QR failed" }, { status: 500 });
  }
}

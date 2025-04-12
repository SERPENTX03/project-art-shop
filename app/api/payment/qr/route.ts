import { NextResponse } from "next/server";
import Omise from "omise";
import prisma from "@/config/db";

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC_KEY!,
  secretKey: process.env.OMISE_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const { amount, description, userId, galleryId } = await req.json();

    if (!userId || !galleryId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
    });

    if (!gallery || gallery.quantity < 1) {
      return NextResponse.json(
        { error: "Gallery not available" },
        { status: 400 }
      );
    }

    // สร้าง charge จาก Omise
    const charge = await omise.charges.create({
      amount: Math.round(amount * 100),
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

    //  สร้าง Order ใน Prisma
    await prisma.order.create({
      data: {
        user: { connect: { clerkId: userId } },
        total: gallery.price,
        status: "PENDING",
        omiseId: charge.id,
        items: {
          create: {
            gallery: { connect: { id: galleryId } },
            quantity: 1,
            unitPrice: gallery.price,
          },
        },
      },
    });
    await prisma.gallery.update({
      where: { id: galleryId },
      data: {
        quantity: { decrement: 1 },
        soldCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      qr: qrUrl,
      chargeId: chargeId,
    });
  } catch (err) {
    console.error("Omise error:", err);
    return NextResponse.json({ error: "Omise QR failed" }, { status: 500 });
  }
}

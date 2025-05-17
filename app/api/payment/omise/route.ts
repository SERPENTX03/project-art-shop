import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Omise from "omise";
import { CartItem } from "@/types/cart";
import { Address } from "@/types/adress";
import prisma from "@/config/db";

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC_KEY!,
  secretKey: process.env.OMISE_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      items,
      total,
      address,
    }: { items: CartItem[]; total: number; address: Address } = body;

    if (!items || items.length === 0 || !total || !address) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    for (const item of items) {
      const product = await prisma.gallery.findUnique({
        where: { id: item.gallery.id },
      });

      if (!product || product.quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `สินค้า ${product?.title || "ไม่พบ"} หมดแล้ว`,
          },
          { status: 400 }
        );
      }
    }

    // 1. สร้างคำสั่งซื้อไว้ก่อน (status = PENDING)
    const order = await prisma.order.create({
      data: {
        user: { connect: { clerkId: userId } },
        total,
        status: "PENDING",
        shippingFullName: address.fullName,
        shippingPhone: address.phone,
        shippingAddressLine: address.addressLine,
        shippingSubDistrict: address.subDistrict,
        shippingDistrict: address.district,
        shippingProvince: address.province,
        shippingPostalCode: address.postalCode,
        items: {
          create: items.map((item) => ({
            galleryId: item.gallery.id,
            quantity: item.quantity,
            unitPrice: item.gallery.price,
          })),
        },
      },
    });

    // 2. เรียก Omise Charge และแนบ orderId
    const charge = await omise.charges.create({
      amount: Math.round(total * 100),
      currency: "thb",
      description: `Order ${order.id} by ${userId}`,
      source: { type: "promptpay" } as never,
      metadata: {
        userId,
        orderId: order.id,
        shippingFullName: address.fullName,
        shippingPhone: address.phone,
        shippingAddressLine: address.addressLine,
        shippingSubDistrict: address.subDistrict,
        shippingDistrict: address.district,
        shippingProvince: address.province,
        shippingPostalCode: address.postalCode,
      },
      return_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    });

    // 3. บันทึก charge.id ลงใน order.omiseId
    await prisma.order.update({
      where: { id: order.id },
      data: { omiseId: charge.id },
    });

    if (!charge.source || !charge.source.scannable_code?.image?.download_uri) {
      return NextResponse.json(
        { error: "ไม่พบ QR Code จาก Omise" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      qr: charge.source.scannable_code.image.download_uri,
      orderId: charge.id,
    });
  } catch (err) {
    console.error("Omise QR error:", err);
    return NextResponse.json(
      { error: "ไม่สามารถสร้าง QR ได้" },
      { status: 500 }
    );
  }
}

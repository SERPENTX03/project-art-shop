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
    const { items, address }: { items: CartItem[]; address: Address } = body;

    if (!items || items.length === 0 || !address) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    // ✅ รวมรายการสินค้าที่ซ้ำกัน
    const mergedItems: { [galleryId: string]: CartItem } = {};
    for (const item of items) {
      const id = item.gallery.id;
      if (!mergedItems[id]) {
        mergedItems[id] = { ...item };
      } else {
        mergedItems[id].quantity += item.quantity;
      }
    }

    const mergedItemsArray = Object.values(mergedItems);

    let productTotal = 0;
    let shippingTotal = 0;

    for (const item of mergedItemsArray) {
      const product = await prisma.gallery.findUnique({
        where: { id: item.gallery.id },
      });

      if (!product || product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `สินค้า ${product?.title || "ไม่พบ"} หมดแล้ว` },
          { status: 400 }
        );
      }

      // ✅ คำนวณราคาสินค้า
      productTotal += product.price * item.quantity;

      // ✅ คำนวณค่าส่งตาม imageSize
      const sizeCm = Number(product.imageSize);
      let shippingFee = 0;

      if (sizeCm < 100) {
        shippingFee = 100;
      } else if (sizeCm <= 150) {
        shippingFee = 300;
      } else if (sizeCm <= 200) {
        shippingFee = 500;
      } else if (sizeCm <= 300) {
        shippingFee = 1000;
      }

      shippingTotal += shippingFee * item.quantity;
    }

    const finalTotal = productTotal + shippingTotal;

    // ✅ สร้าง Omise Charge โดยไม่สร้าง order ทันที
    const charge = await omise.charges.create({
      amount: Math.round(finalTotal * 100),
      currency: "thb",
      description: `Order by ${userId}`,
      source: { type: "promptpay" } as never,
      metadata: {
        userId,
        cartItems: JSON.stringify(mergedItemsArray),
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

    if (!charge.source || !charge.source.scannable_code?.image?.download_uri) {
      return NextResponse.json(
        { error: "ไม่พบ QR Code จาก Omise" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      qr: charge.source.scannable_code.image.download_uri,
      chargeId: charge.id,
      productTotal,
      shippingTotal,
      finalTotal,
    });
  } catch (err) {
    console.error("Omise QR error:", err);
    return NextResponse.json(
      { error: "ไม่สามารถสร้าง QR ได้" },
      { status: 500 }
    );
  }
}

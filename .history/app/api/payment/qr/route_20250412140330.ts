import { NextResponse } from "next/server";
import { Omise } from "omise";

const omise = new Omise({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

export async function POST(response: NextResponse) {
  try {
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Omise QR failed",
      },
      { status: 500 }
    );
  }
}

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/config/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  const eventType = evt.type;

  // ✅ ตรวจสอบก่อนว่าประเภท event คือ user.created
  if (eventType === "user.created") {
    try {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        username,
        primary_email_address_id,
      } = evt.data;
  
      // ✅ ตรวจสอบข้อมูลที่จำเป็น
      if (!id || !email_addresses || email_addresses.length === 0) {
        throw new Error("Incomplete user data received");
      }
  
      // ✅ หา primary email จาก email_addresses
      const primaryEmailObj = email_addresses.find(
        (email) => email.id === primary_email_address_id
      );
  
      const primaryEmail = primaryEmailObj?.email_address;
  
      if (!primaryEmail) {
        throw new Error("No valid email address found");
      }
  
      // ✅ ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: id },
      });
  
      if (existingUser) {
        return NextResponse.json(
          { message: "User already exists", userId: existingUser.id },
          { status: 200 }
        );
      }
  
      // ✅ สร้างผู้ใช้ใหม่
      const newUser = await prisma.user.create({
        data: {
          clerkId: id,
          email: primaryEmail,
          profileImage: image_url || "",
          firstName: first_name || null,
          lastName: last_name || null,
          username: username || null,
          role: "USER",
        },
      });
  
      return NextResponse.json(
        {
          message: "User created successfully",
          userId: newUser.id,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error(`Error processing user.created event:`, error);
      return NextResponse.json(
        {
          error: "Failed to process user creation",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 200 } // ✅ return 200 เพื่อไม่ให้ webhook fail
      );
    }
  }
  
  // ✅ ถ้าไม่ใช่ event ที่เราสนใจ ก็ return 200
  return new Response("Webhook received", { status: 200 });
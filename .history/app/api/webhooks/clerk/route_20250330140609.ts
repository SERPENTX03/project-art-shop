import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
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
  // For this guide, log payload to console
  const eventType = evt.type;
  // ควรตรวจสอบ event type ก่อนดำเนินการใดๆ
  if (eventType === "user.created") {
    try {
      // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน
      if (!evt.data?.id || !evt.data?.email_addresses) {
        throw new Error("Incomplete user data received");
      }

      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        username,
      } = evt.data;

      // หา primary email
      const primaryEmailObj = email_addresses.find(
        (email) => email.id === evt.data.primary_email_address_id
      );

      const primaryEmail = primaryEmailObj?.email_address;

      if (!primaryEmail) {
        throw new Error("No valid email address found");
      }

      // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: id },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: "User already exists", userId: existingUser.id },
          { status: 200 }
        );
      }

      // สร้างผู้ใช้ใหม่
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

      const client = await clerkClient();

      await client.users.updateUserMetadata(id, {
        publicMetadata: {
          role: "USER",
          dbUserId: newUser.id,
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
        { status: 500 }
      );
    }
  }

  return new Response("Webhook received", { status: 200 });
}

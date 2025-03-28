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
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;

  // manage for even user.created
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url, username } =
      evt.data;

    // where Email
    const primaryEmail = email_addresses.find(
      (email: any) => email.id === evt.data.primary_email_address_id
    )?.email_address;

    try {
      if (!evt.data.id || !primaryEmail) {
        throw new Error("Missing required fields");
      }

      const user = await prisma.user.create({
        data: {
          clerkId: evt.data.id,
          email: primaryEmail,
          profileImage: evt.data.image_url || "",
          firstName: evt.data.first_name || null,
          lastName: evt.data.last_name || null,
          username: evt.data.username || null,
        },
      });

      return NextResponse.json(
        { message: "User created successfully", userId: user.id },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error creating user:", error);

      return NextResponse.json(
        {
          error: "Error creating user",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }

  return new Response("Webhook received", { status: 200 });
}

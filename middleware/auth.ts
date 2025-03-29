import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function requireAdmin(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${userId}`
  );
  const user = await res.json();

  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

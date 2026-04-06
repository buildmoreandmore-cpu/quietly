import { NextResponse } from "next/server";
import { createCustomerPortalSession } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "https://quietly.app";
    const url = await createCustomerPortalSession(customerId, `${origin}/app`);

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Portal error:", err);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}

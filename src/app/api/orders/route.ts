import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const backendBase = process.env.NEXT_PUBLIC_BASE_URL;

    const cookie = req.headers.get("cookie") ?? "";
    const authorization = req.headers.get("authorization");
    const guestToken = req.headers.get("x-guest-token");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      cookie, 
    };

    if (authorization) headers["Authorization"] = authorization;
    if (guestToken) headers["X-Guest-Token"] = guestToken;

    const res = await fetch(`${backendBase}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      // no credentials needed here; this is server-to-server
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

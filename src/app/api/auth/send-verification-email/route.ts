import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, token } = (await req.json()) as {
      email?: string;
      token: string;
    };
    console.log("Gtoken", token);

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    const backendBase = process.env.NEXT_PUBLIC_BASE_URL;
    if (!backendBase) {
      return NextResponse.json(
        { message: "BACKEND_URL is not set" },
        { status: 500 },
      );
    }

    const cookie = req.headers.get("cookie") ?? "";
    const authorization = req.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      cookie, // ✅ manual cookie forwarding
    };

    if (authorization) headers["Authorization"] = authorization;

    const backendBody = {
      email,
      token
    };
    console.log("backendBody", backendBody);

    const res = await fetch(`${backendBase}/auth/send-verification-email`, {
      method: "POST",
      headers,
      body: JSON.stringify(backendBody),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("POST /api/auth/send-verification-email error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

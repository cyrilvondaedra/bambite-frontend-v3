import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendBase = process.env.NEXT_PUBLIC_BASE_URL;

    const cookie = req.headers.get("cookie") ?? "";
    const authorization = req.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      cookie,
    };

    if (authorization) headers["Authorization"] = authorization;

    const res = await fetch(`${backendBase}/auth/user/forgot-password`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    console.error("POST /api/auth/user/forgot-password error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

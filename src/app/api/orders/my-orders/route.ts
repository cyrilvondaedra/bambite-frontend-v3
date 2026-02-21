import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const backendBase = process.env.NEXT_PUBLIC_BASE_URL;
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const cookie = req.headers.get("cookie") ?? "";
    const authorization = req.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      cookie,
    };

    if (authorization) headers["Authorization"] = authorization;

    const res = await fetch(
      `${backendBase}/orders/my-orders?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await res.json().catch(() => ({}));
    
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    console.error("GET /api/orders/my-orders error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

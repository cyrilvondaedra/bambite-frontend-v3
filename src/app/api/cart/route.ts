import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("authorization");
  const guestToken = req.headers.get("x-guest-token");
  const cookie = req.headers.get("cookie") ?? "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    cookie,
  };

  if (token) headers["Authorization"] = token;
  if (guestToken) headers["X-Guest-Token"] = guestToken;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

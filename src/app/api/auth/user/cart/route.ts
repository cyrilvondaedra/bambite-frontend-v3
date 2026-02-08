import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  const guestToken = req.headers.get("x-guest-token");
  const cookie = req.headers.get("cookie") ?? "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    cookie,
  };

  if (token) headers["Authorization"] = token;
  if (guestToken) headers["X-Guest-Token"] = guestToken;

  const url = token
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/cart`
    : `${process.env.NEXT_PUBLIC_BASE_URL}/cart?guestToken=${guestToken}`;

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const guestToken = req.headers.get("x-guest-token");
  const cookie = req.headers.get("cookie") ?? "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    cookie,
  };

  if (guestToken) headers["X-Guest-Token"] = guestToken;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/items`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    credentials: "include",
  });

  const data = await res.json();
  console.log("POST", data);

  const response = NextResponse.json(data, { status: res.status });

  return response;
}
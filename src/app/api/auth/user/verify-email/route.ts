import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("POST");
  const body = await req.json();

  const guestToken = req.headers.get("x-guest-token");
  const cookie = req.headers.get("cookie") ?? "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    cookie,
  };

  if (guestToken) headers["X-Guest-Token"] = guestToken;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/verify-email`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      credentials: "include",
    },
  );

  const data = await res.json();
  console.log("res", data);
  return NextResponse.json(data, { status: res.status });
}

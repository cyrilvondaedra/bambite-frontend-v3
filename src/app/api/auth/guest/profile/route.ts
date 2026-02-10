import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const guestToken = req.headers.get("x-guest-token");
  const cookie = req.headers.get("cookie") ?? "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    cookie,
  };

  if (guestToken) headers["X-Guest-Token"] = guestToken;
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/guest/profile`,
    {
      method: "GET",
      headers,
      credentials: "include",
    },
  );

  const data = await res.json();
  console.log("guest profile", data);
  return NextResponse.json(data, { status: res.status });
}

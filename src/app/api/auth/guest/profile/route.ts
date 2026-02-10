import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const guestToken = req.headers.get("x-guest-token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (guestToken) headers["X-Guest-Token"] = guestToken;
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/guest/profile`,
    {
      method: "GET",
      headers,
    },
  );

  const data = await res.json();
  console.log("guest profile", data);
  return NextResponse.json(data, { status: res.status });
}

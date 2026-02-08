import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ productId: string }> },
) {
  const { productId } = await ctx.params;

  const body = await req.json();

  const guestToken = req.headers.get("x-guest-token");
  const cookie = req.headers.get("cookie") ?? "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    cookie,
  };

  if (guestToken) headers["X-Guest-Token"] = guestToken;
  console.log("guestToken",guestToken);
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cart/items/${productId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
      credentials: "include",
      cache: "no-store",
    },
  );

  const data = await res.json();
  console.log("PUT", data);

  const response = NextResponse.json(data, { status: res.status });

  return response;
}

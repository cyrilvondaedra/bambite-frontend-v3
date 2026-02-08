import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ cartId: string }> },
) {
  const { cartId } = await ctx.params;

  const body = await req.json();

  const guestToken = req.headers.get("x-guest-token");
  const cookie = req.headers.get("cookie") ?? "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    cookie,
  };

  if (guestToken) headers["X-Guest-Token"] = guestToken;
  console.log("guestToken", guestToken);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cart/items/${cartId}/options`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
      credentials: "include",
      cache: "no-store",
    },
  );

  const data = await res.json();
  console.log("PATCH", data);

  const response = NextResponse.json(data, { status: res.status });

  return response;
}

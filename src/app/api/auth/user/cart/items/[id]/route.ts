import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const guestToken = req.headers.get("x-guest-token");
  const cookie = req.headers.get("cookie") ?? "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    cookie,
  };

  if (guestToken) headers["X-Guest-Token"] = guestToken;
  console.log("guestToken", guestToken);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cart/items/${id}`,
    {
      method: "DELETE",
      headers,
      credentials: "include",
      cache: "no-store",
    },
  );

  const data = await res.json();
  console.log("DELETE", data);

  const response = NextResponse.json(data, { status: res.status });

  return response;
}

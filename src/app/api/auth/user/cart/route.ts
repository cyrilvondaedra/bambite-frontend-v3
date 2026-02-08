import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart`, {
    method: "GET",
    headers: {
      Authorization: token || "",
      cookie: req.headers.get("cookie") || "",
    },
    credentials: "include",
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") || "", // forward the cookie
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  console.log("POST", res);
  const data = await res.json();

  const response = NextResponse.json(data, { status: res.status });

  return response;
}

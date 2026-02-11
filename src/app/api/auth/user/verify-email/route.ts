import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("POST verify-email");
  const body = await req.json();


  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

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

  const response = NextResponse.json(data, { status: res.status });

  return response;
}

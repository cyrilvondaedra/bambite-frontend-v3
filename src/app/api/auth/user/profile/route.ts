import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const backendBase = process.env.NEXT_PUBLIC_BASE_URL;
    if (!backendBase) {
      return NextResponse.json(
        { message: "Server misconfigured" },
        { status: 500 }
      );
    }

    const cookie = req.headers.get("cookie") ?? "";

    const authHeader = req.headers.get("authorization") ?? "";

    const upstream = await fetch(`${backendBase}/auth/user/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: any) {
    console.error("PATCH /api/auth/user/profile error:", err);
    return NextResponse.json(
      { message: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
	const token = req.headers.get('authorization');

	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/profile`, {
		method: 'GET',
		headers: {
			Authorization: token || '',
			cookie: req.headers.get('cookie') || '',
		},
		credentials: 'include',
	});

	const data = await res.json();
	return NextResponse.json(data, { status: res.status });
}
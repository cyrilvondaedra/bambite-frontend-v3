import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const body = await req.json();

	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
		credentials: 'include',
	});

	const data = await res.json();

	// Forward the cookie from backend to client
	const response = NextResponse.json(data, { status: res.status });

	const backendCookie = res.headers.get('set-cookie');
	if (backendCookie) {
		response.headers.set('set-cookie', backendCookie);
	}

	return response;
}
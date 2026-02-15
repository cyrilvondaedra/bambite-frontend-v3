import { NextResponse } from "next/server";

const BACKEND_API = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_API}/hero-sections?active=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Disable caching to always get fresh data from backend
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch hero sections from backend" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return with no-cache headers to ensure fresh data
    const responseWithHeaders = NextResponse.json(data);
    responseWithHeaders.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    responseWithHeaders.headers.set("Pragma", "no-cache");
    responseWithHeaders.headers.set("Expires", "0");
    
    return responseWithHeaders;
  } catch (error) {
    console.error("Error fetching hero sections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

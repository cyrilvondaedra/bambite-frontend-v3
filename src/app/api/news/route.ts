import { NextResponse } from "next/server";

const BACKEND_API = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "";
    const limit = searchParams.get("limit") || "1000";
    const page = searchParams.get("page") || "1";

    // Build query string
    const queryParams = new URLSearchParams();
    if (type) queryParams.append("type", type);
    queryParams.append("limit", limit);
    queryParams.append("page", page);

    const response = await fetch(
      `${BACKEND_API}/news/published?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Disable caching to always get fresh data
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch news from backend" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return with no-cache headers to ensure fresh data
    const responseWithHeaders = NextResponse.json(data);
    responseWithHeaders.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    responseWithHeaders.headers.set("Pragma", "no-cache");
    responseWithHeaders.headers.set("Expires", "0");

    return responseWithHeaders;
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

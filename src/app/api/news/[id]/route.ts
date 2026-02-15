import { NextResponse } from "next/server";

const BACKEND_API = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the news item directly by ID
    const response = await fetch(`${BACKEND_API}/news/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "News item not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch news item from backend" },
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
    console.error("Error fetching news item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

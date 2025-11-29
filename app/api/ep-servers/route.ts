"use server";

// File: /app/api/ep-servers/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // New Cloudflare Worker URL that returns HTML
    const workerUrl =
      "https://epservers.ahmed-dikha26.workers.dev/?url=" +
      encodeURIComponent(
        "https://wb.animeluxe.org/episodes/sanda-الحلقة-1/"
      );

    // Fetch HTML from your Worker
    const response = await fetch(workerUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Worker request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const html = await response.text(); // Get raw HTML as text

    if (!html || html.length === 0) {
      return NextResponse.json({ message: "No HTML returned from Worker." });
    }

    // Return HTML as JSON
    return NextResponse.json({ success: true, html });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown server error." },
      { status: 500 }
    );
  }
}

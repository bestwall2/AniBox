"use server";

// File: /app/api/ep-servers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const anime = url.searchParams.get("anime") || "sanda"; // default example
    const ep = url.searchParams.get("ep") || "1";

    // Construct episode URL
    const episodeUrl = `https://wb.animeluxe.org/episodes/${anime}-%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-${ep}/`;

    // Cloudflare Worker URL
    const workerUrl = `https://epservers.ahmed-dikha26.workers.dev/?url=${encodeURIComponent(
      episodeUrl
    )}`;

    // Fetch HTML from worker
    const res = await fetch(workerUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Worker request failed: ${res.statusText}` },
        { status: res.status }
      );
    }

    const html = await res.text();

    if (!html || html.includes("404") || html.includes("Error")) {
      return NextResponse.json(
        { error: "There is no data or we can't find this query" },
        { status: 404 }
      );
    }

    // Parse HTML using jsdom
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const links = document.querySelectorAll(".server-list li a[data-url]");

    if (!links || links.length === 0) {
      return NextResponse.json(
        { error: "No servers found for this episode" },
        { status: 404 }
      );
    }

    // Extract server info
    const servers = [...links].map((a) => {
      const base64 = a.getAttribute("data-url") || "";
      let decoded: string | null = null;
      try {
        decoded = Buffer.from(base64, "base64").toString("utf-8");
      } catch {}

      return {
        name: a.textContent?.trim() || "",
        encoded: base64,
        decodedUrl: decoded,
      };
    });

    return NextResponse.json({ anime, ep, servers });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown server error" },
      { status: 500 }
    );
  }
}

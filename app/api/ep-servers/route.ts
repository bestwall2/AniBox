"use server";


import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const anime = url.searchParams.get("anime") || "sanda";
    const ep = url.searchParams.get("ep") || "1";

    const episodeUrl = `https://wb.animeluxe.org/episodes/${anime}-%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-${ep}/`;
    const workerUrl = `https://epservers.ahmed-dikha26.workers.dev/?url=${encodeURIComponent(
      episodeUrl
    )}`;

    const res = await fetch(workerUrl);
    if (!res.ok) return NextResponse.json({ error: "Worker fetch failed" }, { status: res.status });

    const html = await res.text();

    if (!html || html.includes("404")) {
      return NextResponse.json({ error: "No data or page not found" }, { status: 404 });
    }

    // Extract <ul class="server-list"> block
    const ulMatch = html.match(/<ul class="server-list">([\s\S]*?)<\/ul>/);
    if (!ulMatch) return NextResponse.json({ error: "No servers found" }, { status: 404 });

    const ulContent = ulMatch[1];

    // Extract <a data-url="..."> links
    const linkRegex = /<a[^>]*data-url="([^"]+)"[^>]*>([^<]+)<\/a>/g;
    const servers: { name: string; encoded: string; decodedUrl: string | null }[] = [];

    let match;
    while ((match = linkRegex.exec(ulContent)) !== null) {
      const encoded = match[1];
      let decoded: string | null = null;
      try {
        decoded = Buffer.from(encoded, "base64").toString("utf-8");
      } catch {}
      servers.push({ name: match[2].trim(), encoded, decodedUrl: decoded });
    }

    if (servers.length === 0) return NextResponse.json({ error: "No servers found" }, { status: 404 });

    return NextResponse.json({ anime, ep, servers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown server error" }, { status: 500 });
  }
}


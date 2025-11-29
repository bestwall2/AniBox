"use server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const anime = url.searchParams.get("anime") || "sanda";
    const ep = url.searchParams.get("ep") || "1";
    // Generate slug
    const slug = anime
    .toLowerCase()
    .normalize("NFKD")                 // remove accents safely
    .replace(/["'’“”‘]/g, "")          // remove quotes
    .replace(/&/g, "")              // replace & with "and"
    .replace(/[^a-z0-9\s-]/g, "")      // remove all other symbols
    .replace(/\s+/g, "-")              // replace spaces with -
    .replace(/-+/g, "-")               // collapse multiple dashes
    .replace(/^-|-$/g, "");

    const episodeUrl = `https://wb.animeluxe.org/episodes/${slug}-%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-${ep}/`;
    const workerUrl = `https://epservers.ahmed-dikha26.workers.dev/?url=${encodeURIComponent(
      episodeUrl
    )}`;

    const res = await fetch(workerUrl);
    if (!res.ok)
      return NextResponse.json({ error: "Worker fetch failed" }, { status: res.status });

    const html = await res.text();

    if (!html || html.includes("404")) {
      return NextResponse.json({ error: "No data or page not found" }, { status: 404 });
    }

    // Extract <ul class="server-list"> block
    const ulMatch = html.match(/<ul class="server-list">([\s\S]*?)<\/ul>/);
    if (!ulMatch)
      return NextResponse.json({ error: "No servers found" }, { status: 404 });

    const ulContent = ulMatch[1];

    // Keep your working regex, but make it a RegExp object
    const linkRegex = new RegExp('data-url=\\"([^\\"]+)', 'g');
    const decodedUrls: string[] = [];

    let match;
    while ((match = linkRegex.exec(ulContent)) !== null) {
      try {
        const decoded = Buffer.from(match[1], "base64").toString("utf-8");
        decodedUrls.push(decoded);
      } catch {}
    }

    if (decodedUrls.length === 0)
      return NextResponse.json({ error: "No servers found" }, { status: 404 });

    return NextResponse.json({ anime, ep, servers: decodedUrls });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown server error" },
      { status: 500 }
    );
  }
}

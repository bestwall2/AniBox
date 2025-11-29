"use server"; // <-- Explicitly marks this code to run on the server

import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";

const SCRAPEOPS_KEY = "aa333f67-8ca9-4f7f-bc00-2370f3a80570";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
];

const pickUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const anime = searchParams.get("anime");
  const ep = searchParams.get("ep");

  if (!anime || !ep) {
    return NextResponse.json({ error: "anime & ep are required" }, { status: 400 });
  }

  const slug = anime
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const targetUrl = `https://wb.animeluxe.org/episodes/${slug}-%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-${ep}/`;

  try {
    const apiUrl = `https://proxy.scrapeops.io/v1/?api_key=${SCRAPEOPS_KEY}&url=${encodeURIComponent(
      targetUrl
    )}`;

    const res = await fetch(apiUrl, {
      headers: { "User-Agent": pickUA() },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch page" }, { status: res.status });
    }

    const html = await res.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const links = document.querySelectorAll(".server-list li a[data-url]");
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
    console.error("Scrape error:", err.message || err);
    return NextResponse.json({ error: "Failed to scrape page" }, { status: 500 });
  }
}

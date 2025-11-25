export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const anime = searchParams.get("anime");
    const ep = searchParams.get("ep");

    if (!anime || !ep) {
      return NextResponse.json(
        { error: "Missing anime or ep" },
        { status: 400 }
      );
    }

    const servers = await getEpisodeServers(anime, ep);
    return NextResponse.json(servers);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function getEpisodeServers(animeName: string, epNumber: string) {
  const nameSlug = animeName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const url = `https://animelek.live/episode/${nameSlug}-${epNumber}-الحلقة/`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36",
        Accept: "text/html",
      },
    });

    if (!res.ok) {
      console.error("Site blocked request:", res.status);
      return [];
    }

    const html = await res.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const listItems = document.querySelectorAll(
      "#watch #episode-servers li a[data-ep-url]"
    );

    const servers: any[] = [];

    listItems.forEach((a: any) => {
      servers.push({
        serverName: a.textContent.trim(),
        quality: a.querySelector("small")?.textContent || "",
        url: a.getAttribute("data-ep-url"),
      });
    });

    return servers;
  } catch (error) {
    console.error("Scraping Error:", error);
    return [];
  }
}

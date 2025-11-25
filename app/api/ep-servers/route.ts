export const runtime = "nodejs"; // must be BEFORE imports

"use server"; // must be at the very top (no parentheses)

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

export async function getEpisodeServers(animeName: string, epNumber: string) {
  const nameSlug = animeName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const url = `https://animelek.live/episode/${nameSlug}-${epNumber}-الحلقة/`;

  try {
    const res = await fetch(url);
    const html = await res.text();
    

    console.log("STATUS:", res.status);
    
    console.log("HTML length:", html.length);
    console.log("HTML preview:", html.slice(0, 200));

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
        url: a.getAttribute("data-ep-url")
      });
    });

    return servers;

  } catch (error) {
    console.error("Scraping Error:", error);
    return [];
  }
}

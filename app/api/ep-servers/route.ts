"use server";

import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const anime = searchParams.get("anime");
    const ep = searchParams.get("ep");

    if (!anime || !ep) {
      return NextResponse.json(
        { error: "Missing parameters: anime or ep" },
        { status: 400 }
      );
    }

    const servers = await getEpisodeServers(anime, ep);
    return NextResponse.json(servers);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const getEpisodeServers = async (
  animeName: string,
  epNumber: string
) => {
  // Convert anime name into animelek slug
  const nameSlug = animeName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const url = `https://animelek.live/episode/${nameSlug}-${epNumber}-الحلقة/`;

  try {
    const res = await fetch(url);
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
    console.error("Animelek Parsing Error:", error);
    return [];
  }
};

import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const animeName = searchParams.get("animeName");
  const epNumber = searchParams.get("epNumber");

  if (!animeName || !epNumber) {
    return NextResponse.json(
      { error: "Missing animeName or epNumber" },
      { status: 400 },
    );
  }

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
      "#watch #episode-servers li a[data-ep-url]",
    );

    const servers = Array.from(listItems).map((a) => ({
      serverName: a.textContent.trim(),
      quality: a.querySelector("small")?.textContent || "",
      url: a.getAttribute("data-ep-url"),
    }));

    return NextResponse.json(servers);
  } catch (error) {
    console.error("Error fetching servers:", error);
    return NextResponse.json(
      { error: "Failed to fetch servers" },
      { status: 500 },
    );
  }
}

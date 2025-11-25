export const runtime = "nodejs";
import fetch from "node-fetch";

import { NextResponse } from "next/server";

import { JSDOM } from "jsdom";
//fix missing user-agent issue by moving scraping logic to a separate function
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
       accept:
         "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
       "accept-language": "en-US,en;q=0.9",
       "cache-control": "max-age=0",
       priority: "u=0, i",
       "sec-ch-ua": '"Chromium";v="142", "Brave";v="142", "Not_A Brand";v="99"',
       "sec-ch-ua-mobile": "?0",
       "sec-ch-ua-platform": '"Windows"',
       "sec-fetch-dest": "document",
       "sec-fetch-mode": "navigate",
       "sec-fetch-site": "none",
       "sec-fetch-user": "?1",
       "sec-gpc": "1",
       "upgrade-insecure-requests": "1",
       cookie:
         "pp_main_0cecf23bfab9ece29028ffd99f0e5e3f=1; pp_sub_0cecf23bfab9ece29028ffd99f0e5e3f=3; cf_clearance=Fb8f0gmIBVXs3uChIthWzVrvGq26SlSsY6pYefQVOCo-1764077374-1.2.1.1-5wz.xmG5j8x5pQhNvKYlIXluPKCeBtWWC7xMrKNsviW9gyn4lMuLPvM20JF3I6tXjcI3Lan159dI2ONJ7fcy2wXuEdhCA.tfKSP2kgitQtQUXosqVaW.0nMbwudPUWwHR9WZmjRgautio3biONg3oCHhildptL.cnOU.D7LXXN2gf827mZDGjDASKQJqcuwLKxElmEBWqziqn328p3Wc191FPyapYdMU0r1VGOzPCeI",
     },
     body: null,
     method: "GET",
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

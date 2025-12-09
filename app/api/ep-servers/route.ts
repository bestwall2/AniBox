"use server";

import { NextRequest, NextResponse } from "next/server";



// --------------------------------------------------
// 1) Jikan function (MOVING IT TO TOP - CORRECT PLACE)
// --------------------------------------------------
async function fetchJikanTitle(malId: number) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch from Jikan API");
    }

    const json = await response.json();
    return json?.data?.title || null;

  } catch (err) {
    console.error("Jikan fetch error:", err);
    return null;
  }
}
// --------------------------------------------------

async function extractEpisodeLinks(url: string) {
  const res = await fetch(url);
  const html = await res.text();

  // استخراج محتوى ul.episodes-lists
  const ulMatch = html.match(
    /<ul class="episodes-lists"[^>]*>([\s\S]*?)<\/ul>/
  );
  if (!ulMatch) return [];

  const ulContent = ulMatch[1];

  // استخراج روابط الحلقات من <li> → <a class="title" href="...">
  const liRegex = /<li>[\s\S]*?<a href="([^"]+)" class="title">/g;
  const links: string[] = [];
  let match;

  while ((match = liRegex.exec(ulContent)) !== null) {
    links.push(match[1]);
  }
 
  return links;
}


export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const anime = url.searchParams.get("anime") || "sanda";
    const ep = url.searchParams.get("ep") || "1";

    // --------------------------------------------------
    // 2) Extract MAL ID from "anime" string
    // --------------------------------------------------
    const malId = parseInt(anime.replace(/\D/g, "")); // 60303 → OK

    if (!malId) {
      return NextResponse.json(
        { error: "Anime ID is invalid. Expected MAL ID." },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 3) Get Title from Jikan API
    // --------------------------------------------------
    const jikanTitle = await fetchJikanTitle(malId);

    if (!jikanTitle) {
      return NextResponse.json(
        { error: "Cannot fetch title from Jikan API", jikanTitle},
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // 4) Convert title → slug format
    // --------------------------------------------------
    const slug = jikanTitle
      .toLowerCase()
      .replace(/\s[^a-zA-Z0-9\s]\s/g, " ")
      .normalize("NFKD")
      .replace(/\s+/g, "-")
      //.replace(/[^a-z0-9\s]+/g, "")
      .replace(/[^a-z0-9-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    console.log("Final Slug:", slug);

    // --------------------------------------------------
    // 5) Continue your original logic
    // --------------------------------------------------

    const servers: Array<{ name: string; url: string }> = [];

    // Try animeluxe.org (existing source)
    try {

      const animeUrl = `https://epservers.ahmed-dikha26.workers.dev/?url=https://wb.animeluxe.org/${slug}`;
      const links = await extractEpisodeLinks(animeUrl);
      const episodeUrl = links[Number(ep) - 1];


      if (!episodeUrl) {
        return NextResponse.json(
          { error: "Episode URL not found", slug, ep },
          { status: 404 }
        );
      }

      const workerUrl = `https://epservers.ahmed-dikha26.workers.dev/?url=${encodeURIComponent(
        episodeUrl
      )}`;

      const res = await fetch(workerUrl);
      if (res.ok) {
        const html = await res.text();

        if (html && !html.includes("404")) {
          // Extract <ul class="server-list"> block
          const ulMatch = html.match(
            /<ul class="server-list">([\s\S]*?)<\/ul>/
          );
          if (ulMatch) {
            const ulContent = ulMatch[1];
            const linkRegex = new RegExp('data-url=\\"([^\\"]+)', "g");

            let match;
            while ((match = linkRegex.exec(ulContent)) !== null) {
              try {
                const decoded = Buffer.from(match[1], "base64").toString(
                  "utf-8"
                );

                // Extract domain name from URL (e.g., https://mega.nz/ → mega)
                let serverName = "unknown";
                const urlObj = new URL(decoded);
                const hostParts = urlObj.hostname.split(".");
                if (hostParts.length > 0) {
                  serverName = hostParts[hostParts.length - 2] || hostParts[0];
                }

                servers.push({ name: serverName, url: decoded });
              } catch {}
            }
          }
        }
      }
    } catch (err) {
      console.log("Animeluxe fetch failed:", err);
    }

    // Try blkom.com (new source)
    try {
      const blkomUrl = `https://www.blkom.com/watch/${slug}/${ep}`;
      const blkomRes = await fetch(
        `https://epservers.ahmed-dikha26.workers.dev/?url=${encodeURIComponent(
          blkomUrl
        )}`
      );

      if (blkomRes.ok) {
        const blkomHtml = await blkomRes.text();

        // Extract all <span class="server ..."> blocks and their <a data-src> attributes
        const serverSpanRegex = /<span class="server[^"]*">([\s\S]*?)<\/span>/g;
        let spanMatch;

        while ((spanMatch = serverSpanRegex.exec(blkomHtml)) !== null) {
          const spanContent = spanMatch[1];
          // Extract data-src from <a> tag within the span
          const dataSrcMatch = spanContent.match(/data-src="([^"]+)"/);
          if (dataSrcMatch && dataSrcMatch[1]) {
            // Extract domain name from URL (e.g., https://bkvideo.online/ → bkvideo)
            let serverName = "blkom";
            try {
              const urlObj = new URL(dataSrcMatch[1]);
              const hostParts = urlObj.hostname.split(".");
              if (hostParts.length > 0) {
                serverName = hostParts[hostParts.length - 2] || hostParts[0];
              }
            } catch {}

            servers.push({ name: serverName, url: dataSrcMatch[1] });
          }
        }
      }
    } catch (err) {
      console.log("Blkom fetch failed:", err);
    }

    if (servers.length === 0)
      return NextResponse.json(
        { error: "No servers found \n" + slug },
        { status: 404 }
      );

    return NextResponse.json({ anime, ep, slug, servers });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown server error" },
      { status: 500 }
    );
  }
}



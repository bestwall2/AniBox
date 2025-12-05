"use server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const anime = url.searchParams.get("anime") || "sanda";
    const ep = url.searchParams.get("ep") || "1";
    // Generate slug
    const slug = anime
    .toLowerCase()                        // convert to lowercase
    .normalize("NFKD")                     // normalize accents
    .replace(/[^a-z0-9\s\-]+/g, "")       // remove all symbols except hyphens
    .trim()                                // remove spaces at start/end
    .replace(/\s+/g, "-");
    console.log(slug);

    const servers: Array<{ name: string; url: string }> = [];

    // Try animeluxe.org (existing source)
    try {
      const episodeUrl = `https://wb.animeluxe.org/episodes/${slug}-%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-${ep}/`;
      const workerUrl = `https://epservers.ahmed-dikha26.workers.dev/?url=${encodeURIComponent(
        episodeUrl
      )}`;

      const res = await fetch(workerUrl);
      if (res.ok) {
        const html = await res.text();

        if (html && !html.includes("404")) {
          // Extract <ul class="server-list"> block
          const ulMatch = html.match(/<ul class="server-list">([\s\S]*?)<\/ul>/);
          if (ulMatch) {
            const ulContent = ulMatch[1];
            const linkRegex = new RegExp('data-url=\\"([^\\"]+)', 'g');

            let match;
            while ((match = linkRegex.exec(ulContent)) !== null) {
              try {
                const decoded = Buffer.from(match[1], "base64").toString("utf-8");
                
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
      const blkomRes = await fetch(`https://epservers.ahmed-dikha26.workers.dev/?url=${encodeURIComponent(
        blkomUrl
      )}` );
   

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
      return NextResponse.json({ error: "No servers found /n" + slug}, { status: 404 });

    return NextResponse.json({ anime, ep, slug, servers });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown server error" },
      { status: 500 }
    );
  }
}

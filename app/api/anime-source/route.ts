"use server";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Extract query params from the incoming request (optional, or hardcode values)
    // For demo, we'll hardcode values as per your example:
    const id = "178680";
    const host = "yuki";
    const ep = "1";
    const type = "sub";
    const slug = "wind-breaker-season-2-19542?ep=136108";

    const url = `https://aniplaynow.live/anime/watch/${id}?host=${host}&ep=${ep}&type=${type}`;
    const bodyRaw = JSON.stringify([id, host, slug, ep, type]);

    const headers = {
      "accept": "text/x-component",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "text/plain;charset=UTF-8",
      "next-action": "7ffa001e009c8af959eee63285fcdce64145311f9e",
      "next-router-state-tree":
        '["","{\\"children\\":[\\"(user)\\",{\\"children\\":[\\"(media)\\",{\\"children\\":[\\"anime\\",{\\"children\\":[\\"watch\\",[[\\"aniId\\",\\"178680\\",\\"d\\"],{\\"children\\":[\\"__PAGE__?{\\\\\\"host\\\\\\":\\\\\\"yuki\\\\\\",\\\\\\"ep\\\\\\":\\\\\\"1\\\\\\",\\\\\\"type\\\\\\":\\\\\\"sub\\\\\\"}\\",{},\\"/anime/watch/178680?host=yuki&ep=1&type=sub\\",\\"refresh\\"]}]]}]}]}]}"]',   
      "referer": url,
    };

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: bodyRaw,
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch video info, status: ${res.status}`);
    }

    const text = await res.text();

    // Split by lines and parse each line JSON part (after "0:", "1:", etc)
    const parsedObjects = text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const colonIndex = line.indexOf(":");
        if (colonIndex === -1) return null;
        const jsonPart = line.slice(colonIndex + 1);
        try {
          return JSON.parse(jsonPart);
        } catch (e) {
          console.error("Failed to parse JSON line:", e, line);
          return null;
        }
      })
      .filter(Boolean);

    // Return parsed JSON array of objects from the response
    return NextResponse.json(parsedObjects);
  } catch (error) {
    console.error("Error fetching anime watch info:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime watch info" },
      { status: 500 }
    );
  }
}
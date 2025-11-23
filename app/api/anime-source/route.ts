"use server";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Destructure the expected fields from the request body
    const { id, host, slug, ep, type } = data;

    if (!id || !host || !slug || !ep || !type) {
      return NextResponse.json(
        { error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const url = `https://aniplaynow.live/anime/watch/${id}?host=${host}&ep=${ep}&type=${type}`;
    const bodyRaw = JSON.stringify([id, host, slug, ep, type]);

    const headers = {
      "authority": "aniplaynow.live",
      "accept": "text/x-component",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "text/plain;charset=UTF-8",
      "cookie":
        "_ga=GA1.1.1943138151.1749783483; _ga_7CDEK7DNXH=GS2.1.s1749808998$o3$g1$t1749809640$j38$l0$h0",
      "next-action": "7ffa001e009c8af959eee63285fcdce64145311f9e",
      "next-router-state-tree":
        '["","{\\"children\\":[\\"(user)\\",{\\"children\\":[\\"(media)\\",{\\"children\\":[\\"anime\\",{\\"children\\":[\\"watch\\",[[\\"aniId\\",\\"' +
        id +
        '\\",\\"d\\"],{\\"children\\":[\\"__PAGE__?{\\\\\\"host\\\\\\":\\\\\\"' +
        host +
        '\\\\\\",\\\\\\"ep\\\\\\":\\\\\\"' +
        ep +
        '\\\\\\",\\\\\\"type\\\\\\":\\\\\\"' +
        type +
        '\\\\"}\\",{},\\"/anime/watch/' +
        id +
        '?host=' +
        host +
        '&ep=' +
        ep +
        '&type=' +
        type +
        '\\",\\"refresh\\"]}]]}]}]}]}"]',
      "origin": "https://aniplaynow.live",
      "referer": url,
      "sec-ch-ua": '"Chromium";v="137", "Not/A)Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    };

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: bodyRaw,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch video info, status: ${res.status}`);
    }

    const text = await res.text();

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

    return NextResponse.json(parsedObjects);
  } catch (error) {
    console.error("Error fetching anime watch info:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime watch info" },
      { status: 500 }
    );
  }
}
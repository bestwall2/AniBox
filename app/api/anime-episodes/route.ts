"use server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing anime ID" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://aniplaynow.live/anime/info/${id}`, {
      method: "POST",
      headers: {
        "Accept": "text/x-component",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
        "Referer": "https://aniplaynow.live/",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([id, true, true]),
    });

    if (!res.ok) {
      console.error(`Failed to fetch anime info for id: ${id}, status: ${res.status}`);
      return NextResponse.json(
        { error: `Failed to fetch anime info for id: ${id}` },
        { status: res.status }
      );
    }

    const text = await res.text();

    try {
      // First attempt: Parse the whole text as JSON
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      // If parsing the whole text fails, try the old logic
      try {
        const key1Line = text.split(/\n/).find(line => line.startsWith("1:"));

        if (!key1Line) {
          console.error("Failed to find line starting with '1:' in response body.");
          return NextResponse.json({ error: "Failed to parse episode data" }, { status: 500 });
        }

        const jsonString = key1Line.slice(2); // remove the "1:" prefix
        const data = JSON.parse(jsonString);
        return NextResponse.json(data);
      } catch (parseError) {
        console.error("Error parsing episode data after fallback:", parseError);
        return NextResponse.json({ error: "Failed to parse episode data" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error(`Error in GET /api/anime-episodes for id: ${id}:`, error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching anime info." },
      { status: 500 }
    );
  }
}
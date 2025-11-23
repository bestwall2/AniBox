"use server";

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing anime ID" }, { status: 400 });
  }

  try {
    // Fetch anime episodes from the API using your provided URL and headers
    const res = await fetch(`https://backend.animetsu.to/api/anime/eps/${id}`, {
      credentials: "include",
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Priority": "u=0"
      },
      referrer: `https://animetsu.to/anime/${id}`,
      method: "GET",
      mode: "cors"
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch anime episodes for id: ${id}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching anime episodes:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime episodes" },
      { status: 500 }
    );
  }
}
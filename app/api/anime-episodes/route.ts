"use server";

import { NextResponse } from "next/server";

export async function GET(request) {
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
        "Next-Action": "7f98001caa202033310a94da4dff5fe16667c58611",
        "Next-Router-State-Tree": `%5B%22%22%2C%7B%22children%22%3A%5B%22(user)%22%2C%7B%22children%22%3A%5B%22(media)%22%2C%7B%22children%22%3A%5B%22anime%22%2C%7B%22children%22%3A%5B%22info%22%2C%7B%22children%22%3A%5B%5B%22aniId%22%2C%22${id}%22%2C%22d%22%5D%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2Fanime%2Finfo%2F${id}%22%2C%22refresh%22%5D%7D%5D%7D%5D%7D%5D%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D`,
        "User-Agent": "Mozilla/5.0 (Linux; Android 12; ZTE 8046 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/138.0.7204.3 Mobile Safari/537.36",
        "Referer": `https://aniplaynow.live/anime/info/${id}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([id, true, true]),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch anime info for id: ${id}`);
    }

    const text = await res.text();

    // extract line that starts with "1:"
    const key1Line = text.split(/\n/).find(line => line.startsWith("1:"));

    if (!key1Line) {
      return NextResponse.json([]);
    }

    const jsonString = key1Line.slice(2); // remove the "1:" prefix

    const data = JSON.parse(jsonString);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime info" },
      { status: 500 }
    );
  }
}
"use server";

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing anime ID" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://aniplaynow.live/anime/info/${id}`, {
      method: "POST",
      headers: {
        "Accept": "text/x-component",
        "Next-Action": "7f328d44382d74f2942c42d0bc9915b2d510628a02",
        "Next-Router-State-Tree": `["",{"children":["(user)",{"children":["(media)",{"children":["anime",{"children":["info",{"children":[["aniId","${id}","d"],{"children":["__PAGE__",{}, "/anime/info/${id}","refresh"]}]}]}]}]}]},null,null,true]`,
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 12; en; ZTE 8046 Build/MyOS12.0.12_8046_EEA) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0.0.0 Mobile Safari/537.36",
        "Referer": `https://aniplaynow.live/anime/info/${id}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([id, false, true]),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch anime info for id: ${id}`);
    }

    const rawText = await res.text(); // Because response is not JSON but streamed component
    return NextResponse.json({ raw: rawText });
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime info" },
      { status: 500 }
    );
  }
}
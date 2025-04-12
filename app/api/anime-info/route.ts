// app/api/anime-info/route.js
"use server";

import { fetchAnimeInfo } from "../../../actions/ApiData.js";
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
    const data = await fetchAnimeInfo(id); // pass the id here
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime info" },
      { status: 500 }
    );
  }
}
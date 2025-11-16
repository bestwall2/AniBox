// app/api/anime-id/route.js
"use server";

import { NextResponse } from "next/server";

// URL of the full anime list JSON
const ANIME_LIST_URL = "https://raw.githubusercontent.com/Fribb/anime-lists/refs/heads/master/anime-list-full.json";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // expect AniList ID

  if (!id) {
    return NextResponse.json(
      { error: "Missing anime ID" },
      { status: 400 }
    );
  }

  try {
    // Fetch the full anime list JSON
    const response = await fetch(ANIME_LIST_URL);
    if (!response.ok) throw new Error("Failed to fetch anime list");

    const animeList = await response.json();

    // Find the anime by AniList ID
    const anime = animeList.find(a => a.anilist_id === Number(id));

    if (!anime || !anime.themoviedb_id) {
      return NextResponse.json(
        { error: "TMDb ID not found for this anime" },
        { status: 404 }
      );
    }

    // Return only the TMDb ID
    return NextResponse.json({ tmdb_id: anime.themoviedb_id });

  } catch (error) {
    console.error("Error fetching anime list:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime info" },
      { status: 500 }
    );
  }
}

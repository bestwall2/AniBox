// app/api/anime-id/route.js
"use server";

import { NextResponse } from "next/server";

const TMDB_API_KEY = "90a823390bd37b5c1ba175bef7e2d5a8";
const ANIME_LIST_URL =
  "https://raw.githubusercontent.com/Fribb/anime-lists/refs/heads/master/anime-list-full.json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const anilistId = searchParams.get("id");

    if (!anilistId) {
      return NextResponse.json({ error: "Missing anime ID" }, { status: 400 });
    }

    // 1️⃣ Fetch TMDB ID from JSON list
    const listRes = await fetch(ANIME_LIST_URL);
    if (!listRes.ok) throw new Error("Failed to fetch anime list");
    const animeList = await listRes.json();

    const anime = animeList.find(
      (a: { anilist_id: number }) => a.anilist_id === Number(anilistId),
    );
    if (!anime || !anime.themoviedb_id) {
      return NextResponse.json({ error: "TMDb ID not found" }, { status: 404 });
    }
    const tmdbId = anime.themoviedb_id;

    // 2️⃣ Fetch AniList anime details
    const aniRes = await fetch(`${request.nextUrl.origin}/api/anime-info?id=${anilistId}`);
    if (!aniRes.ok) throw new Error("Failed to fetch AniList info");
    const media = (await aniRes.json()).Media;

    if (!media) {
      return NextResponse.json({ error: "AniList media not found" }, { status: 404 });
    }

    // 3️⃣ Handle movies
    if (media.format === "MOVIE") {
      return NextResponse.json({ tmdb_id: tmdbId, current_season: null });
    }

    // 4️⃣ Fetch TMDB TV show details
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    if (!tmdbRes.ok) throw new Error("Failed to fetch TMDB TV details");
    const tmdbData = await tmdbRes.json();
    const seasons = tmdbData.seasons || [];

    const aniYear = media.startDate?.year;
    const aniMonth = media.startDate?.month || 1;
    const aniEpisodes = media.episodes || 0;
    const titleFinal = media.title?.romaji?.toUpperCase().includes("FINAL");

    // 5️⃣ Try to find season matching by year, month, total episodes
    let matchingSeason = seasons.find((season) => {
      if (!season.air_date) return false;
      const seasonDate = new Date(season.air_date);
      const sameYear = seasonDate.getFullYear() === aniYear;
      const sameMonth = seasonDate.getMonth() + 1 === aniMonth;
      const sameEpisodes = !season.episode_count || season.episode_count === aniEpisodes;
      return sameYear && sameMonth && sameEpisodes;
    });

    // 6️⃣ Optional: if multiple seasons match, prefer one with "FINAL" in name
    if (!matchingSeason && titleFinal) {
      matchingSeason = seasons.find((season) =>
        season.name.toUpperCase().includes("FINAL")
      );
    }

    // 7️⃣ Fallback: closest season by year/month
    if (!matchingSeason) {
      matchingSeason = seasons.find((season) => {
        if (!season.air_date) return false;
        const seasonDate = new Date(season.air_date);
        return seasonDate.getFullYear() === aniYear && seasonDate.getMonth() + 1 === aniMonth;
      });
    }

    const currentSeason = matchingSeason?.season_number || 1;

    return NextResponse.json({ tmdb_id: tmdbId, current_season: currentSeason });
  } catch (err) {
    console.error("Error fetching TMDB & season:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
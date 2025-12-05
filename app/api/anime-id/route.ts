// app/api/anime-id/route.ts
"use server";

import { NextResponse } from "next/server";

// ⚠️ Move API keys to .env.local in production
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const ANIME_LIST_URL =
  "https://raw.githubusercontent.com/Fribb/anime-lists/refs/heads/master/anime-list-full.json";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const anilistId = url.searchParams.get("id");

    if (!anilistId) {
      return NextResponse.json({ error: "Missing anime ID" }, { status: 400 });
    }

    // 1️⃣ Fetch TMDB ID from JSON list
    const listRes = await fetch(ANIME_LIST_URL);
    if (!listRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch anime list" },
        { status: 500 }
      );
    }

    const animeList: Array<{ anilist_id: number; themoviedb_id?: number }> =
      await listRes.json();

    const anime = animeList.find(
      (a) => a.anilist_id === Number(anilistId)
    );

    if (!anime?.themoviedb_id) {
      return NextResponse.json({ error: "TMDb ID not found" }, { status: 404 });
    }

    const tmdbId = anime.themoviedb_id;

    // 2️⃣ Fetch AniList anime details
    const aniRes = await fetch(
      `${url.origin}/api/anime-info?id=${anilistId}`
    );

    if (!aniRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch AniList info" },
        { status: 500 }
      );
    }

    const aniData = await aniRes.json();
    const media = aniData?.Media;

    if (!media) {
      return NextResponse.json(
        { error: "AniList media not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Movie
    if (media.format === "MOVIE") {
      return NextResponse.json({ tmdb_id: tmdbId, current_season: null });
    }

    // 4️⃣ Fetch TMDB TV show details
    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: "Missing TMDB_API_KEY environment variable" },
        { status: 500 }
      );
    }

    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`
    );

    if (!tmdbRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch TMDB TV details" },
        { status: 500 }
      );
    }

    const tmdbData = await tmdbRes.json();
    const seasons = tmdbData?.seasons ?? [];

    const aniYear = media.startDate?.year;
    const aniMonth = media.startDate?.month ?? 1;
    const aniEpisodes = media.episodes ?? 0;
    const titleFinal =
      media.title?.romaji?.toUpperCase()?.includes("FINAL") ?? false;

    // 5️⃣ Match by exact year/month/episode count
    let matchingSeason = seasons.find((season: any) => {
      if (!season.air_date) return false;

      const d = new Date(season.air_date);
      const sameYear = d.getFullYear() === aniYear;
      const sameMonth = d.getMonth() + 1 === aniMonth;
      const sameEpisodes =
        !season.episode_count || season.episode_count === aniEpisodes;

      return sameYear && sameMonth && sameEpisodes;
    });

    // 6️⃣ Prefer "FINAL" if no match
    if (!matchingSeason && titleFinal) {
      matchingSeason = seasons.find((season: any) =>
        season.name?.toUpperCase()?.includes("FINAL")
      );
    }

    // 7️⃣ Fallback: match just year + month
    if (!matchingSeason) {
      matchingSeason = seasons.find((season: any) => {
        if (!season.air_date) return false;
        const d = new Date(season.air_date);
        return d.getFullYear() === aniYear && d.getMonth() + 1 === aniMonth;
      });
    }

    const currentSeason = matchingSeason?.season_number ?? 1;

    return NextResponse.json({
      tmdb_id: tmdbId,
      current_season: currentSeason,
    });
  } catch (err: any) {
    console.error("Error fetching TMDB & season:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}

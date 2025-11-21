"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Episodes from "../../components/Episodes";
import Image from "next/image";
import parse from "html-react-parser";
import { useQuery } from "@tanstack/react-query";

import { FaStar, FaPlayCircle } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

// Fetch anime episodes
const fetchAnimeEpisodes = async (id: string) => {
  const response = await fetch(`/api/anime-episodes?id=${id}`);
  if (!response.ok) throw new Error("Network response was not ok for anime episodes");
  return response.json();
};

// Fetch anime details
const fetchAnimeDetails = async (id: string) => {
  const response = await fetch(`/api/anime-info?id=${id}`);
  if (!response.ok) throw new Error("Network response was not ok for anime details");
  const data = await response.json();
  return data.Media;
};

function getSeasonNumberFromTitle(title: string | null | undefined): number {
  if (!title) return 1;
  const match = title.match(/Season\s+(\d+)/i);
  return match && match[1] ? parseInt(match[1], 10) : 1;
}

const PlayerPageContent = () => {
  const searchParams = useSearchParams();
  const [iframeUrl, setIframeUrl] = useState("");

  const tmdbId = searchParams.get("tmdbId");
  const type = searchParams.get("type");
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
  const anilistId = searchParams.get("anilistId");

  // Episodes
  const { data: episodes } = useQuery({
    queryKey: ["animeEpisodes", anilistId],
    queryFn: () => fetchAnimeEpisodes(anilistId!),
    enabled: !!anilistId,
  });

  // Anime details
  const { data: animeDetails } = useQuery({
    queryKey: ["animeDetails", anilistId],
    queryFn: () => fetchAnimeDetails(anilistId!),
    enabled: !!anilistId,
  });

  // Set iframe player link
  useEffect(() => {
    if (tmdbId) {
      if (type === "MOVIE") {
        setIframeUrl(`https://vidsrcme.ru/embed/movie?tmdb=${tmdbId}`);
      } else if (type === "TV" && season && episode) {
        setIframeUrl(`https://vidsrcme.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`);
      }
    }
  }, [tmdbId, type, season, episode]);

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Player */}
      <div className="mb-4 w-full h-[500px]">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            title={type === "MOVIE" ? "Movie Player" : `Episode ${episode}`}
            className="w-full h-full"
            frameBorder="0"
            referrerPolicy="origin"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <p className="text-white">Loading player...</p>
          </div>
        )}
      </div>

      {/* === REPLACEMENT FOR <PlayerInfo /> === */}
      {animeDetails && (
        <div className="container bg-zinc-900 p-4 rounded-xl shadow-lg mb-6">

          <Image
            src={animeDetails.coverImage.extraLarge}
            alt={animeDetails.title.english || animeDetails.title.romaji || "Unknown Title"}
            width={500}
            height={300}
            className="rounded-xl w-full"
          />

          <div className="InfoContainer m-4 text-left">

            <h1 className="Title text-xl font-bold">
              {animeDetails.title.english ||
                animeDetails.title.romaji ||
                "Unknown Title"}
            </h1>

            <div className="flex items-center justify-start">
              <FaStar size={15} className="text-yellow-400" />
              <h2 className="Trending font-semibold pl-1 pt-1 text-yellow-400">
                {animeDetails.averageScore ? `${animeDetails.averageScore / 10}` : "N/A"}
              </h2>
            </div>

            <p className="Description text-sm pr-5 mt-1 mb-1 line-clamp-5 text-gray-300">
              {parse(animeDetails.description)}
            </p>

            <div className="Addtion font-semibold mb-2 space-y-1">
              <h1 className="flex items-center gap-2">
                <FaPlayCircle size={13} />
                {animeDetails.format || "Unknown Format"}
              </h1>

              <h1
                className={`State ${
                  animeDetails.status === "RELEASING" ? "text-green-500" : "text-red-500"
                }`}
              >
                {animeDetails.status || "Unknown Status"}
              </h1>

              <h1 className="flex items-center gap-2">
                <MdDateRange size={13} />
                {animeDetails.startDate
                  ? `${animeDetails.startDate.year} ${animeDetails.startDate.month}, ${animeDetails.startDate.day}`
                  : "Unknown Date"}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Episodes */}
      {anilistId && episodes && animeDetails && (
        <Episodes
          episodes={episodes.map((ep: any) => ({
            ...ep,
            season: getSeasonNumberFromTitle(animeDetails?.title?.english),
          }))}
          imgbackup={animeDetails?.coverImage?.extraLarge}
          anilistId={parseInt(anilistId, 10)}
          type={type || "TV"}
        />
      )}
    </div>
  );
};

const PlayerPage = () => (
  <Suspense fallback={<div className="text-white">Loading...</div>}>
    <PlayerPageContent />
  </Suspense>
);

export default PlayerPage;

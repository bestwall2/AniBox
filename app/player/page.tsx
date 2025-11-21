"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Episodes from "../../components/Episodes";
import Image from "next/image";
import parse from "html-react-parser";
import { useQuery } from "@tanstack/react-query";

import { FaStar } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

const fetchAnimeEpisodes = async (id: string) => {
  const response = await fetch(`/api/anime-episodes?id=${id}`);
  if (!response.ok) throw new Error("Failed to fetch episodes");
  return response.json();
};

const fetchAnimeDetails = async (id: string) => {
  const response = await fetch(`/api/anime-info?id=${id}`);
  if (!response.ok) throw new Error("Failed to fetch anime info");
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

  const { data: episodes } = useQuery({
    queryKey: ["animeEpisodes", anilistId],
    queryFn: () => fetchAnimeEpisodes(anilistId!),
    enabled: !!anilistId,
  });

  const { data: animeDetails } = useQuery({
    queryKey: ["animeDetails", anilistId],
    queryFn: () => fetchAnimeDetails(anilistId!),
    enabled: !!anilistId,
  });

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
    <div className="container mx-auto px-4 py-8 flex flex-col gap-6">

      {/* Player */}
      <div className="w-full h-[500px]">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            title={type === "MOVIE" ? "Movie Player" : `Episode ${episode}`}
            className="w-full h-full rounded-xl"
            frameBorder="0"
            referrerPolicy="origin"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center rounded-xl">
            <p className="text-white">Loading player...</p>
          </div>
        )}
      </div>

      {/* Watching Now Panel */}
      {animeDetails && (
        <div className="bg-zinc-900 p-4 rounded-xl shadow-lg text-white">
          <p className="text-sm mb-1">You are Watching</p>
          <h2 className="text-pink-500 font-semibold text-lg mb-1">Episode {episode || "1"}</h2>
          <p className="text-xs text-gray-400 mb-2">
            If current server doesn’t work please try other servers beside.
          </p>
        </div>
      )}

      {/* Episodes List */}
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

      {/* Anime Info (bottom) */}
      {animeDetails && (
        <div className="bg-zinc-900 p-4 rounded-xl shadow-lg flex flex-col gap-4">
          <Image
            src={animeDetails.coverImage.extraLarge}
            alt={animeDetails.title.english || animeDetails.title.romaji || "Unknown Title"}
            width={500}
            height={300}
            className="rounded-xl w-full"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold text-white">
              {animeDetails.title.english || animeDetails.title.romaji || "Unknown Title"}
            </h1>
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              <span className="text-yellow-400 font-semibold">
                {animeDetails.averageScore ? `${animeDetails.averageScore / 10}` : "N/A"}
              </span>
            </div>
            <p className="text-gray-300 text-sm line-clamp-5">
              {animeDetails.description ? parse(animeDetails.description) : "No description available"}
            </p>
            <div className="flex flex-wrap gap-2 text-sm font-semibold">
              <span>{animeDetails.format || "Unknown Format"}</span>
              <span
                className={animeDetails.status === "RELEASING" ? "text-green-500" : "text-red-500"}
              >
                {animeDetails.status || "Unknown Status"}
              </span>
              <span className="flex items-center gap-1">
                <MdDateRange /> 
                {animeDetails.startDate
                  ? `${animeDetails.startDate.year} ${animeDetails.startDate.month}, ${animeDetails.startDate.day}`
                  : "Unknown Date"}
              </span>
            </div>
          </div>
        </div>
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

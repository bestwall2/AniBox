"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Episodes from "../../components/Episodes";
import Image from "next/image";
import parse from "html-react-parser";
import { useQuery } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { Skeleton } from "./../../components/ui/skeleton"; // Adjust path if your Skeleton component is elsewhere
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const fetchAnimeEpisodes = async (id: string) => {
  const response = await fetch(`/api/anime-episodes?id=${id}`);
  if (!response.ok) throw new Error("Failed to fetch episodes");
  const data = await response.json();
  if (Array.isArray(data)) {
    return data.map((episode: any) => ({
      id: episode.number ?? null,
      number: episode.number ?? null,
      title: episode.title ?? "",
      img: episode.image ?? "",
      description: episode.description ?? "",
      isFiller: episode.isFiller ?? false,
    }));
  }
  return [];
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
    <div className="container mx-auto px-2 py-4 flex flex-col gap-4">
      {/* Player */}
      <div className="w-full h-[220px] rounded-xl overflow-hidden">
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

      <div className="flex items-center space-x-2">
          <span className="w-1.5 rounded-full h-6 bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)]"></span>
          <p className="text-md font-semibold">
           ANIME DETAILS
          </p>
      </div>


      <Card className="bg-[#0b0b0c] bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5">
  <CardContent className="p-4">

    {/* IMAGE + TEXT SECTION */}
    {animeDetails && (
      <div className="flex flex-row gap-4"> 
      <div>

     {/* COVER IMAGE */}
        <div className="rounded-xl mt-5 shadow-xl bg-black backdrop-blur-sm">
          {animeDetails?.coverImage?.extraLarge ? (
            <img
              src={animeDetails.coverImage.extraLarge}
              alt="Cover"
              className="min-h-[21vh] min-w-[14vh] max-h-[21vh] max-w-[14vh] rounded-xl object-cover"
            />
          ) : (
            <Skeleton className="h-[160px] w-[110px] rounded-xl" />
          )}
        </div>

      </div>
      
        {/* TITLE + META */}
        <div className="flex flex-col item-start justify-center text-white w-full">

          {/* TITLE */}
          <h1 className="text-2xl font-bold leading-tight line-clamp-2 break-words  drop-shadow-lg">
            {animeDetails?.title?.romaji || "Unknown Title"}
          </h1>

          {/* RATING + STATUS */}
          <div className="flex items-center mt-2 gap-2">
            <FaStar size={18} className="text-yellow-400" />
            <p className="text-md">{animeDetails.averageScore / 10}</p>
            <p
              className={`font-semibold ${
                animeDetails.status === "RELEASING"
                  ? "text-green-400"
                  : "text-red-500"
              }`}
            >
              {animeDetails.status}
            </p>
          </div>

          {/* GENRES + EPISODES */}
          <div className="text-sm text-gray-300 mt-2">
            <p>{animeDetails.genres?.join(", ")}</p>
            <p className="mt-1">
              <span className="font-semibold text-white">Episodes :</span>{" "}
              {animeDetails.episodes || "?"}
            </p>
          </div>

        </div>
      </div>
    )}

    {/* DESCRIPTION BOX */}
    <div className="mt-6 bg-[#0f0f10] rounded-xl p-4 border border-white/5">
      <h2 className="text-lg font-semibold text-white mb-2">Description</h2>

      <p className="text-gray-300 text-sm leading-relaxed line-clamp-[8]">
        {animeDetails?.description
          ? parse(animeDetails.description)
          : <Skeleton className="h-20 w-full rounded" />}
      </p>
    </div>
  </CardContent>
</Card>


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
    </div>
  );
};

const PlayerPage = () => (
  <Suspense fallback={<div className="text-white">Loading...</div>}>
    <PlayerPageContent />
  </Suspense>
);

export default PlayerPage;   
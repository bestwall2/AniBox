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
    <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Player */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden">
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

      {/* Main Info + Cover */}
      {animeDetails && (
                <div className="relative z-10 flex flex-row items-left px-4  space-y-6">
              {/* Cover Image */}
              <div className="rounded-xl mt-5 shadow-xl bg-black backdrop-blur-sm">
                  {animeDetails?.coverImage?.extraLarge ? (
                      <img
                          src={animeDetails.coverImage.extraLarge}
                          alt="Cover Image"
                          className="min-h-[23vh] min-w-[14vh] max-h-[23vh] max-w-[14vh] rounded-xl object-cover"
                          loading="lazy"
                      />
                  ) : (                 
                      <Skeleton className="SkeletonCard min-h-[23vh] min-w-[14vh] max-h-[23vh] max-w-[14vh] rounded-xl " />
                  )}
              </div>

              <div className="InfoContainerPage flex-col ml-1 mt-0 items-center justify-center">
                  {/* Title & Rating */}
                  <div className="text-left px-4">
                      {animeDetails?.title?.romaji ? (
                          <h1 className="text-2xl font-bold line-clamp-2 text-white drop-shadow-lg break-words max-w-[200px]">
                              {animeDetails.title.romaji}
                          </h1>
                      ) : (
                          <Skeleton className="h-6 w-[200px] rounded" />
                      )}
                  </div>
                  
                  <div className="flex ml-3 mt-2 font-semibold items-left justify-start">
                      <FaStar size={20} style={{ color: "yellow", padding: 1 }} />
                      {animeDetails?.averageScore !== undefined && animeDetails?.status ? (
                          <>
                              <p className="text-md ml-1 self-center">
                                  {animeDetails.averageScore / 10} |
                              </p>
                              <p
                                  className={`ml-2 ${
                                      animeDetails.status === "RELEASING" ? "text-green-500" : "text-red-500"
                                  }`}
                              >
                                  {animeDetails.status}
                              </p>
                          </>
                      ) : (
                          <Skeleton className="h-4 w-[100px] ml-2 rounded" />
                      )}
                  </div>
                  
                  <h1 className="flex ml-3 font-semibold items-left justify-start">
                      <MdDateRange className="self-center mr-1" size={20} />
                      {animeDetails?.startDate ? (
                          `${animeDetails.startDate.year} / ${animeDetails.startDate.month} / ${animeDetails.startDate.day}`
                      ) : (
                          <Skeleton className="h-4 w-[120px] rounded" />
                      )}
                  </h1>
                  
                  <h1 className="CardGenres text-sm flex ml-3 items-left justify-start">
                      {animeDetails?.genres?.length ? (
                          animeDetails.genres.join(", ")
                      ) : (
                          <Skeleton className="h-4 w-[150px] rounded" />
                      )}
                  </h1>
                  
                  <h1 className="text-sm flex ml-3 font-semibold items-left justify-start">
                      {animeDetails?.episodes !== undefined ? (
                          `Episodes : ${animeDetails.episodes}`
                      ) : (
                          <Skeleton className="h-4 w-[100px] rounded" />
                      )}
                  </h1>
              </div>
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
    </div>
  );
};

const PlayerPage = () => (
  <Suspense fallback={<div className="text-white">Loading...</div>}>
    <PlayerPageContent />
  </Suspense>
);

export default PlayerPage;

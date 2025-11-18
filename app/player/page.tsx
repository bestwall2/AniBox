"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PlayerInfo from "../../components/PlayerInfo";
import Episodes from "../../components/Episodes";
import { useQuery } from "@tanstack/react-query";

const fetchAnimeEpisodes = async (id: string) => {
  const response = await fetch(`/api/anime-episodes?id=${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok for anime episodes");
  }
  return response.json();
};

const fetchAnimeDetails = async (id: string) => {
  const response = await fetch(`/api/anime-info?id=${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok for anime details");
  }
  const data = await response.json();
  return data.Media; // Assuming the relevant data is in Media object
};

const PlayerPageContent = () => {
  const searchParams = useSearchParams();
  const [iframeUrl, setIframeUrl] = useState("");

  const tmdbId = searchParams.get("tmdbId");
  const type = searchParams.get("type");
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
  const anilistId = searchParams.get("anilistId");

  const { data: episodes, isLoading: episodesLoading } = useQuery({
    queryKey: ["animeEpisodes", anilistId],
    queryFn: () => fetchAnimeEpisodes(anilistId!),
    enabled: !!anilistId,
  });

  const { data: animeDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ['animeDetails', anilistId],
    queryFn: () => fetchAnimeDetails(anilistId!),
    enabled: !!anilistId, // Only run query if id is available
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 w-full h-[500px]">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            title={type === "MOVIE" ? "Movie Player" : `Episode ${episode}`}
            style={{ width: "100%", height: "100%" }}
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
      {anilistId && <PlayerInfo anilistId={anilistId} />}
      {anilistId && episodes && animeDetails && (
        <Episodes
          episodes={episodes}
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

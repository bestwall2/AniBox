"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Episodes from "../../components/Episodes";
import Image from "next/image";
import parse from "html-react-parser";
import { useQuery } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Skeleton } from "./../../components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

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

  // 🔥 ADDED — server state
  const [currentServer, setCurrentServer] = useState("server1");

  const router = useRouter();

  const tmdbId = searchParams.get("tmdbId");
  const type = searchParams.get("type");
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
  const anilistId = searchParams.get("anilistId");

  // 🔥 ADDED — server list
  const serverLinks = {
    server1: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://vidsrcme.ru/embed/movie?tmdb=${id}`
        : `https://vidsrcme.ru/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,

    server2: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://vidsrc.cc/v2/embed/movie/${id}`
        : `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,

    server3: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://player.videasy.net/movie/${id}`
        : `https://player.videasy.net/tv/${id}/${s}/${e}`,

    server4: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://111movies.com/movie/${id}`
        : `https://111movies.com/tv/${id}/${s}/${e}`,

    server5: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://godriveplayer.com/player.php?tmdb=${id}`
        : `https://godriveplayer.com/player.php?type=series&tmdb=${id}&season=${s}&episode=${e}`,

    server6: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://vidsrc.cx/embed/movie/${id}`
        : `https://vidsrc.cx/embed/tv/${id}/${s}/${e}`,

    server7: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://player.vidzee.wtf/embed/movie/${id}`
        : `https://player.vidzee.wtf/embed/tv/${id}/${s}/${e}`,

    server8: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://www.nontongo.win/embed/movie/${id}`
        : `https://www.nontongo.win/embed/tv/${id}/${s}/${e}`,

    server9: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://vidfast.pro/movie/${id}?autoPlay=true`
        : `https://vidfast.pro/tv/${id}/${s}/${e}?autoPlay=true`,

    server10: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://vidlink.pro/movie/${id}`
        : `https://vidlink.pro/tv/${id}/${s}/${e}`,

    server11: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://netplayz.live/watch?type=movie&id=${id}&play=true`
        : `https://netplayz.live/watch?type=tv&id=${id}&s=${s}&e=${e}&play=true`,

    server12: (id: string, s: string, e: string, type: string = "TV") =>
      type === "MOVIE"
        ? `https://mapple.uk/watch/movie/${id}`
        : `https://mapple.uk/watch/tv/${id}-${s}-${e}`,
  };

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

  // ⬇️ ONLY THIS USEEFFECT WAS MODIFIED
  useEffect(() => {
    if (tmdbId) {
      if (type === "MOVIE") {
        setIframeUrl(
          (serverLinks as any)[currentServer](tmdbId, "", "", type)
        );
      } else if (type === "TV" && season && episode) {
        // 🔥 ADDED — dynamic server switching
        setIframeUrl(
          (serverLinks as any)[currentServer](tmdbId, season, episode, type)
        );
      }
    }
  }, [tmdbId, type, season, episode, currentServer]); // 🔥 ADDED currentServer

  return (
    <div className="container mx-auto px-2 py-4 flex flex-col gap-4">
      <div className="BannerbackgroundShadow fixed  z-30 top-0 h-[40px]  w-full" />

      {/* ⭐ FIXED GLASS NAVBAR */}
      <div className="w-full flex items-center justify-between px-2 py-2 fixed  top-0 left-0 z-30">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="transition-all duration-300 hover:scale-90"
        >
          <IoMdArrowRoundBack size={30} className="text-white" />
        </button>

        {/* 🔥 ADDED — server dropdown */}
        <select
          value={currentServer}
          onChange={(e) => setCurrentServer(e.target.value)}
          className="bg-[#111] text-white px-2 py-1 rounded-md border border-gray-500 text-sm"
        >
          <option value="server1">VidsrcMe</option>
          <option value="server2">VidSrc CC</option>
          <option value="server3">Videasy</option>
          <option value="server4">111Movies</option>
          <option value="server5">GDrive</option>
          <option value="server6">VidSrc CX</option>
          <option value="server7">VidZee</option>
          <option value="server8">NonTonGo</option>
          <option value="server9">VidFast</option>
          <option value="server10">VidLink</option>
          <option value="server11">NetPlayz</option>
          <option value="server12">Mapple</option>
        </select>

        {/* Profile */}
        <img
          className="w-9 h-9 rounded-full border-gray-600 border-2 transition-all duration-300 ease-out hover:scale-90"
          src="https://raw.githubusercontent.com/bestwall2/AniBox/refs/heads/main/app/images/profile.jpg"
          alt="User"
        />
      </div>

      {/* PUSH PAGE CONTENT BELOW FIXED NAVBAR */}
      <div className="mt-5" />

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

      {/* (Everything below stays EXACTLY the same — NOT MODIFIED) */}

      <div className="flex items-center space-x-2">
        <span className="w-1.5 rounded-full h-6 bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)]"></span>
        <p className="text-md font-semibold">ANIME DETAILS</p>
      </div>

      <Card className="bg-[#0b0b0c] bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5">
        <CardContent className="p-4">
          {animeDetails && (
            <div className="mt-0 bg-[#0f0f10] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="live-dot"></div>
                <p className="text-lg font-semibold text-white">
                  You are Watching
                </p>
              </div>

              <h2 className="text-green-300 text-m leading-relaxed">
                Episode {episode || "1"}
              </h2>

              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                If current server doesn’t work, switch to another one.
              </p>
              <p className="text-xs text-red-300 font-semibold leading-relaxed">
                Note: Servers are third-party. I have no control over the ads
                they display.
              </p>
            </div>
          )}

          {animeDetails && (
            <div className="flex flex-row gap-4">
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

              <div className="flex flex-col justify-center text-white w-full">
                <h1 className="text-2xl font-bold leading-tight line-clamp-2 break-words">
                  {animeDetails?.title?.romaji || "Unknown Title"}
                </h1>

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

                <div className="text-sm text-gray-300 mt-2">
                  <p>{animeDetails.genres?.join(", ")}</p>
                  <p className="mt-1">
                    <span className="font-semibold text-white">Episodes:</span>{" "}
                    {animeDetails.episodes || "?"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 bg-[#0f0f10] rounded-xl p-4 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-2">
              Description
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed line-clamp-[8]">
              {animeDetails?.description ? (
                parse(animeDetails.description)
              ) : (
                <Skeleton className="h-20 w-full rounded" />
              )}
            </p>
          </div>
        </CardContent>
      </Card>

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

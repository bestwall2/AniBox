"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const fetchAnimeDetails = async (id: string) => {
  const response = await fetch(`/api/anime-info?id=${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok for anime details");
  }
  const data = await response.json();
  return data.Media; // Assuming the relevant data is in Media object
};

const PlayerInfo = ({ anilistId }: { anilistId: string }) => {
  const { data: animeDetails, isLoading } = useQuery({
    queryKey: ["animeDetails", anilistId],
    queryFn: () => fetchAnimeDetails(anilistId),
    enabled: !!anilistId,
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <Skeleton className="h-8 w-1/2 rounded" />
        <Skeleton className="h-4 w-full mt-4 rounded" />
        <Skeleton className="h-4 w-full mt-2 rounded" />
        <Skeleton className="h-4 w-3/4 mt-2 rounded" />
      </div>
    );
  }

  return (
    <div className="mt-8 text-white">
      <h1 className="text-3xl font-bold">{animeDetails?.title?.english || animeDetails?.title?.romaji}</h1>
      <p className="mt-4 text-gray-300">{animeDetails?.description?.replace(/<[^>]*>?/gm, "")}</p>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Relations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
          {animeDetails?.relations?.edges?.map((relation: any) => (
            <Link href={`/anime/info/${relation.node.id}`} key={relation.id}>
              <div className="cursor-pointer">
                <Image
                  src={relation.node.coverImage.large}
                  alt={relation.node.title.romaji}
                  width={200}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
                <p className="mt-2 text-center">{relation.node.title.romaji}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;

"use client";

import React from "react";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import DiscoverCard from "./CardsComp/DiscoverCard";
import Link from "next/link";

interface RelationNode {
  relationType: string;
  node: {
    id: number;
    title: { romaji: string | null; english: string | null; userPreferred?: string };
    format: string;
    coverImage: { large?: string; extraLarge: string; color?: string };
    episodes: number;
    averageScore: number;
    startDate?: { year: number };
    status: string;
  };
}

interface RecommendListProps {
  geners: string;
  data: RelationNode[];
  param: string;
}

const RecommendList = ({ geners, data, param }: RecommendListProps) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="ItemGeners mt-2 mb-2">
      <div className="Geners flex text-gray-200 items-center mb-2 space-x-2">
        <span className="w-1.5 rounded-full h-6 bg-indigo-500"></span>
        <p className={param}>{geners}</p>
      </div>

      <Swiper
        modules={[Navigation, FreeMode]}
        slidesPerView={3}
        spaceBetween={5}
        navigation={true}
        freeMode={true}
        className="swiper-animation"
      >
        {data.map((edge) => {
          const anime = edge.node;
          const animeUrl = `/anime/info/${anime.id}`;

          return (
            <SwiperSlide key={`${anime.id}-${anime.title.romaji}`} className="cursor-pointer">
              <Link href={animeUrl} passHref>
                <DiscoverCard
                  cardbadge={anime.averageScore ? `${anime.averageScore / 10}` : "N/A"}
                  title={anime.title.english || anime.title.romaji || "Unknown Title"}
                  info={`${anime.format} • ${anime.startDate?.year || "Unknown Year"} • ${anime.episodes || "N/A"} Episodes`}
                  img={anime.coverImage.extraLarge}
                  status={anime.status}
                />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

RecommendList.propTypes = {
  geners: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  param: PropTypes.string.isRequired,
};

export default RecommendList;
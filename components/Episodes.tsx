"use client";

import React, { useEffect, useState } from "react";
import EpisodeCard from "./CardsComp/EpisodesCard";
import { FaSearch } from "react-icons/fa";
import SearchInput from "./ui/SearchInput";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  img: string;
  imgb: string;
}

interface EpisodesProps {
  episodes: Episode[];
  imgbackup: string;
  anilistId: number;
  type: string; // "MOVIE" or "TV"
}

const Episodes: React.FC<EpisodesProps> = ({ episodes, imgbackup, anilistId, type }) => {
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tmdbId, setTmdbId] = useState<number | null>(null);
  const [season, setSeason] = useState<number | null>(null);
  const [malId, setMalId] = useState<number | null>(null);
  useEffect(() => {
    const fetchTmdbId = async () => {
      try {
        const res = await fetch(
          `/api/anime-id?id=${anilistId}`
        );
        if (!res.ok) throw new Error("Failed to fetch TMDB ID");
        const data = await res.json();
        setTmdbId(data.tmdb_id);
        setSeason(data.current_season);
        setMalId(data.mal_id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTmdbId();
  }, [anilistId]);

  const handleSearchChange = (value: string) => setSearchValue(value || "");

  const filteredEpisodes = (episodes || []).filter((ep) =>
    ep.number?.toString().includes(searchValue || "")
  );

  // navigation handled via Next.js Link below

  return (
    <div className="EpisodesList mt-2">
      {/* Header */}
      <div className="flex text-gray-200 items-center pr-4 mb-4 justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 rounded-full h-6 bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)]"></span>
          <p className="text-md font-semibold">
            {type === "MOVIE" ? "Movie" : "Episodes"}
          </p>
        </div>

        {type === "TV" && (
          <button onClick={() => setShowSearch((prev) => !prev)}>
            <FaSearch size={18} className="hover:text-white transition" />
          </button>
        )}
      </div>

      {/* Search Input (TV Only) */}
      {type === "TV" && (
        <AnimatePresence initial={false}>
          {showSearch && (
            <motion.div
              key="search"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="EpisodeSearch mb-4 px-1 overflow-hidden"
            >
              <SearchInput value={searchValue} onChange={handleSearchChange} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* EPISODE LIST (TV or MOVIE merged) */}
      <div className="flex flex-col gap-2 max-h-[350px] overflow-y-scroll pr-2">
        {(type === "MOVIE"
          ? [
              {
                id: "movie-1",
                number: 1,
                title: episodes?.[0]?.title || "Movie",
                description: episodes?.[0]?.description || "",
                img: episodes?.[0]?.img || "",
                imgb: episodes?.[0]?.imgb || "",
                season: 1,
              },
            ]
          : filteredEpisodes
        ).map((episode) => {
          const href = tmdbId
            ? `/player?tmdbId=${tmdbId}&type=${type}&season=${season || 1}&episode=${episode.number}&anilistId=${anilistId}&malId=${malId}`
            : "";

          const card = (
            <EpisodeCard
              title={episode.title}
              description={episode.description}
              image={episode.img}
              number={episode.number}
              imgbup={imgbackup}
            />
          );

          return href ? (
            <Link key={episode.id} href={href} className="cursor-pointer">
              {card}
            </Link>
          ) : (
            <div key={episode.id} className="cursor-default">
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Episodes;

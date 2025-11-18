"use client";

import React, { useEffect, useState } from "react";
import EpisodeCard from "./CardsComp/EpisodesCard";
import { FaSearch } from "react-icons/fa";
import SearchInput from "./ui/SearchInput";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  img: string;
  imgb: string;
  season?: number;
}

interface EpisodesProps {
  episodes: Episode[];
  imgbackup: string;
  anilistId: number;
  type: string; // "MOVIE" or "TV"
}

const Episodes: React.FC<EpisodesProps> = ({ episodes, imgbackup, anilistId, type }) => {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tmdbId, setTmdbId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTmdbId = async () => {
      try {
        const res = await fetch(
          `https://ani-box-nine.vercel.app/api/anime-id?id=${anilistId}`
        );
        if (!res.ok) throw new Error("Failed to fetch TMDB ID");
        const data = await res.json();
        setTmdbId(data.tmdb_id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTmdbId();
  }, [anilistId]);

  const handleSearchChange = (value: string) => setSearchValue(value);

  const filteredEpisodes = episodes.filter((ep) =>
    ep.number?.toString().includes(searchValue)
  );

  const handleEpisodeClick = (episode: Episode) => {
    if (tmdbId) {
      router.push(`/player?tmdbId=${tmdbId}&type=TV&season=${episode.season}&episode=${episode.number}&anilistId=${anilistId}`);
    }
  };

  const handleMoviePlay = () => {
    if (tmdbId) {
      router.push(`/player?tmdbId=${tmdbId}&type=MOVIE&anilistId=${anilistId}`);
    }
  };

  return (
    <div className="EpisodesList mt-2">
      {/* Header */}
      {type === "TV" && (
        <div className="flex text-gray-200 items-center pr-4 mb-4 justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 rounded-full h-6 bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)]"></span>
            <p className="text-md font-semibold">Episodes</p>
          </div>
          <button onClick={() => setShowSearch((prev) => !prev)}>
            <FaSearch size={18} className="hover:text-white transition" />
          </button>
        </div>
      )}

      {/* Conditional SearchInput */}
      {type === "TV" && (
        <AnimatePresence initial={false}>
          {showSearch && (
            <motion.div
              key="search"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="EpisodeSearch mb-4 px-1 overflow-hidden"
            >
              <SearchInput value={searchValue} onChange={handleSearchChange} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Play Button for Movies */}
      {type === "MOVIE" && (
        <div className="flex justify-center mb-4">
          <button
            onClick={handleMoviePlay}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Play Movie
          </button>
        </div>
      )}

      {/* Episode List */}
      {type === "TV" && (
        <div className="flex flex-col gap-2 max-h-[350px] overflow-y-scroll pr-2">
          {filteredEpisodes.map((episode) => (
            <div
              key={episode.id}
              onClick={() => handleEpisodeClick(episode)}
              className="cursor-pointer"
            >
              <EpisodeCard
                title={episode.title}
                description={episode.description}
                image={episode.img}
                number={episode.number}
                imgbup={imgbackup}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Episodes;

import React, { useEffect, useState } from "react";
import EpisodeCard from "./CardsComp/EpisodesCard";
import { FaSearch } from "react-icons/fa";
import SearchInput from "./ui/SearchInput";
import { AnimatePresence, motion } from "framer-motion";

interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  img: string;
  imgb: string;
  season?: number; // optional, movies won't have it
}

interface EpisodesProps {
  episodes: Episode[];
  imgbackup: string;
  anilistId: number;
  type: string; // anime type
}

const Episodes: React.FC<EpisodesProps> = ({ episodes, imgbackup, anilistId, type }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
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

  const handleEpisodeClick = (episode: Episode) => setSelectedEpisode(episode);

  // Helper: render iframe URL
  const getIframeUrl = () => {
    if (!tmdbId) return "";
    if (type === "MOVIE") return `https://vidsrcme.ru/embed/movie?tmdb=${tmdbId}`;
    if (type === "TV" && selectedEpisode)
      return `https://vidsrcme.ru/embed/tv?tmdb=${tmdbId}&season=${selectedEpisode.season}&episode=${selectedEpisode.number}`;
    return "";
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

      {/* Video Player */}
      {tmdbId && (type === "MOVIE" || (type === "TV" && selectedEpisode)) && (
        <div className="mb-4 w-full h-[400px]">
          <iframe
            src={getIframeUrl()}
            title={type === "MOVIE" ? "Movie Player" : `Episode ${selectedEpisode?.number}`}
            style={{ width: "100%", height: "100%" }}
            frameBorder="0"
            referrerPolicy="origin"
            allowFullScreen
          />
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

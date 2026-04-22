// components/Episodes.tsx
import React, { useState } from "react";
import EpisodeCard from "./CardsComp/EpisodesCard";
import { FaSearch } from "react-icons/fa";
import SearchInput from "./ui/SearchInput"; // adjust if needed
import { AnimatePresence, motion } from "framer-motion";

interface Episode {
  id: string;
  title: string;
  description: string;
  img: string;
  number: number;
  imgb: string;
}

interface EpisodesProps {
  episodes: Episode[];
  imgbackup: string;
}

const Episodes: React.FC<EpisodesProps> = ({ episodes, imgbackup }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const filteredEpisodes = episodes.filter((episode) =>
    episode.number.toString().includes(searchValue)
  );

  return (
    <div className="EpisodesList mt-2">
      {/* Header */}
      <div className="flex text-gray-200 items-center pr-4 mb-4 justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 rounded-full h-6 bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)]"></span>
          <p className="text-md font-semibold">Episodes</p>
        </div>

        <button onClick={() => setShowSearch((prev) => !prev)}>
          <FaSearch size={18} className="hover:text-white transition" />
        </button>
      </div>

      {/* Conditional SearchInput */}
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

      {/* Filtered Episode List */}
      <div className="flex flex-col gap-2 max-h-[350px] overflow-y-scroll pr-2">
        {filteredEpisodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            title={episode.title}
            description={episode.description}
            image={episode.img}
            number={episode.number}
            imgbup={imgbackup}
          />
        ))}
      </div>
    </div>
  );
};

export default Episodes;
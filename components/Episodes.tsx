// components/Episodes.tsx
import React, { useState } from "react";
import EpisodeCard from "./CardsComp/EpisodesCard";
import { FaSearch } from "react-icons/fa";
import SearchInput from "../ui/SearchInput"; // Adjust this path if necessary

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

  return (
    <div className="EpisodesList mt-2">
      {/* Header */}
      <div className="flex text-gray-200 items-center pr-4 mb-4 justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 rounded-full h-6 bg-indigo-500"></span>
          <p className="text-md font-semibold">Episodes</p>
        </div>

        <button onClick={() => setShowSearch((prev) => !prev)}>
          <FaSearch size={18} className="hover:text-white transition" />
        </button>
      </div>

      {/* Conditional SearchInput */}
      {showSearch && (
        <div className="mb-4 px-1">
          <SearchInput />
        </div>
      )}

      {/* Episode List */}
      <div className="flex flex-col gap-2 max-h-[350px] overflow-y-scroll pr-2">
        {episodes.map((episode) => (
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
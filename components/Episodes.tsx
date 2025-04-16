// components/Episodes.tsx
import React from "react";
import EpisodeCard from "./CardsComp/EpisodesCard";
import { FaSearch } from "react-icons/fa";


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
  return (
    <div className="EpisodesList mt-2 ">
            <div className="flex text-gray-200 items-center mb-4 space-x-2">
                <span className="w-1.5 rounded-full h-6 bg-indigo-500"></span>
                <p className="text-md font-semibold">Anime Episodes</p>
                <FaSearch className=" self-right justify-right" size={18} />
            </div>
    
            <div className="flex flex-col gap-4 max-h-[350px] overflow-y-scroll pr-2">
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
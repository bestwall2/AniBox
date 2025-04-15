// components/Episodes.tsx
import React from "react";
import EpisodeCard from "./CardsComp/EpisodesCard";

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
}

const Episodes: React.FC<EpisodesProps> = ({ episodes }) => {
  return (
    <div className="mt-4 h-[400px]">
      <div className="flex text-gray-200 items-center mb-4 space-x-2">
        <span className="w-1.5 rounded-full h-6 bg-indigo-500"></span>
        <p className="text-md font-semibold">Episodes</p>
      </div>

      <div className="flex flex-col gap-4">
        {episodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            title={episode.title}
            description={episode.description}
            image={episode.img}
            number={episode.number}
            imgbup={episode.imgb}
          />
        ))}
      </div>
    </div>
  );
};

export default Episodes;
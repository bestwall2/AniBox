import Image from "next/image";
import { useState } from "react";

const EpisodeCard = ({ title, description, image, number }) => {
  return (
    <div className="bg-zinc-800 rounded-xl shadow-lg flex items-center p-4 space-x-4">
      <img
        src={image}
        alt={title}
        className="w-24 h-24 object-cover rounded-lg shadow-md"
      />
      <div className="flex flex-col">
        <span className="text-sm text-indigo-400">EP {number}</span>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-300 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default EpisodeCard;
import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa";

interface SearchCardProps {
  title: string;
  format: string;
  year: number;
  img: string;
  rating: number;
}

const SearchCard: React.FC<SearchCardProps> = ({
  title,
  format,
  year,
  img,
  rating,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="relative h-64">
        <Image
          src={`/api/proxy?url=${encodeURIComponent(img)}`}
          alt={title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 rounded-full p-2">
          <p className="text-white text-xs font-bold">+</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate">{title}</h3>
        <div className="flex items-center text-gray-400 text-sm mt-2">
          <span>{format}</span>
          <span className="mx-2">•</span>
          <span>{year}</span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span>{(rating / 10).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;

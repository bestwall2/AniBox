import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

interface SearchCardProps {
  title: string;
  info: string;
  img: string;
  cardbadge: string;
  status: string;
}

const SearchCard: React.FC<SearchCardProps> = ({
  title,
  info,
  img,
  cardbadge,
  status,
}) => {
  return (
    <div className="searchCard  relative overflow-hidden rounded-2x  transition-all duration-300 hover:scale-[0.97]">
      {/* Cover Image */}
      <Image
        src={`/api/proxy?url=${encodeURIComponent(img)}`}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="searchCardOverlay absolute inset-0">
        {/* Title */}
        <p className="searchCardTitle absolute text-center line-clamp-2">
          {title}
        </p>
        {/* Info */}
        <p className="searchCardInfo  absolute bottom-0 text-gray-300 line-clamp-1">
          {info}
        </p>

        {/* Score Badge */}
        <div className="searchCardBadge flex items-center">
          <p className="searchCardBadgeText">{cardbadge}</p>
          <FaStar size={12} className="text-yellow-400 ml-1" />
        </div>

        {/* Status Indicator */}
        <div className="searchCardStatus absolute top-2 left-2">
          {status === "RELEASING" ? (
            <div className="live-dot"></div>
          ) : (
            <GoDotFill size={16} className="text-red-500 drop-shadow" />
          )}
        </div>
      </div>

      {/* Play Button */}
      <FaPlay
        className="searchCardPlay"
        size={28}
        style={{ color: "#3888E7", padding: 1 }}
      />
    </div>
  );
};

export default SearchCard;

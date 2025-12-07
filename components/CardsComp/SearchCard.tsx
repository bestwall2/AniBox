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

// A grid‑friendly version of DiscoverCard WITHOUT redesigning the layout
// Uses your same CSS classes (Listcontainer, Title, MoreInfo, etc.)
// Only changed wrapper class names to avoid conflicts.

const SearchCard: React.FC<SearchCardProps> = ({
  title,
  info,
  img,
  cardbadge,
  status,
}) => {
  return (
    <div className="SearchCard relative transition-all duration-300 ease-out hover:scale-[0.97] rounded-2xl Listcontainer">
      {/* Image */}
      <Image
        src={`/api/proxy?url=${encodeURIComponent(img)}`}
        alt={title}
        layout="fill"
        objectFit="cover"
        priority
      />

      {/* Shadow overlay */}
      <div className="CardShadow absolute">
        <p className="Title absolute text-center line-clamp-2">{title}</p>

        <p className="MoreInfo text-gray-300 absolute line-clamp-1 bottom-0">
          {info}
        </p>

        <div className="CardBadge flex items-center justify-start">
          <p className="CardBadgeText self-center">{cardbadge}</p>
          <FaStar size={12} style={{ color: "yellow", padding: 1 }} />
        </div>

        <div className="CardActive flex items-center justify-start">
          {status === "RELEASING" ? (
            <div className="live-dot absolute top-2 left-2"></div>
          ) : (
            <GoDotFill
              size={17}
              style={{
                color: "#ef4444",
                padding: 1,
                textShadow: "0px 0px 10px black",
              }}
            />
          )}
        </div>
      </div>

      <FaPlay
        className="PlayBtn"
        size={28}
        style={{ color: "#3888E7", padding: 1 }}
      />
    </div>
  );
};

export default SearchCard;

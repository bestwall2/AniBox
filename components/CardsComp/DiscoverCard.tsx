import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

interface ListItemsProps {
  title: string;
  info: string;
  img: string;
  cardbadge: string;
  status: string;
}

const DiscoverCard: React.FC<ListItemsProps> = ({
  title,
  info,
  img,
  cardbadge,
  status,
}) => {
  return (
    <div
      className="
        relative
        rounded-xl
        overflow-hidden
        bg-black
        cursor-pointer
        transition-all
        duration-300
        hover:scale-[0.97]
        group
        pointer-events-auto
      "
    >
      {/* Image */}
      <Image
        src={`/api/proxy?url=${encodeURIComponent(img)}`}
        alt={title}
        fill
        priority
        className="object-cover pointer-events-none"
      />

      {/* Card Overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/90
          via-black/40
          to-transparent
          pointer-events-none
        "
      />

      {/* Title */}
      <p
        className="
          absolute bottom-10 left-2 right-2
          text-sm font-semibold
          text-white
          line-clamp-2
          pointer-events-none
        "
      >
        {title}
      </p>

      {/* Info */}
      <p
        className="
          absolute bottom-4 left-2 right-2
          text-xs text-gray-300
          line-clamp-1
          pointer-events-none
        "
      >
        {info}
      </p>

      {/* Rating */}
      <div
        className="
          absolute top-2 right-2
          bg-black/60 backdrop-blur-md
          px-2 py-1
          rounded-md text-xs
          flex items-center gap-1
          pointer-events-none
        "
      >
        <span className="text-white">{cardbadge}</span>
        <FaStar size={12} className="text-yellow-400" />
      </div>

      {/* Status */}
      <div className="absolute top-2 left-2 pointer-events-none">
        {status === "RELEASING" ? (
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        ) : (
          <GoDotFill size={18} className="text-red-500" />
        )}
      </div>

      {/* Play Button */}
      <FaPlay
        className="
          absolute bottom-1 right-1
          text-blue-400
          opacity-0 group-hover:opacity-100
          transition
          pointer-events-none
        "
        size={26}
      />
    </div>
  );
};

export default DiscoverCard;

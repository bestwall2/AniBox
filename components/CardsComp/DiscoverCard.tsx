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
  // Ensure "boolean" is lowercase in TypeScript
}

const DiscoverCard: React.FC<ListItemsProps> = ({
  title,
  info,
  img,
  cardbadge,
  status,
  
}) => {
  return (
    <div className="Listcontainer relative transition-all duration-300 ease-out hover:scale-[0.97] rounded-2xl">
      {/* Optimized Next.js Image */}
      <Image src={img} alt={title} layout="fill" objectFit="cover" priority />
    
      {/* Card overlay */}
      <div className="CardShadow absolute inset-0 p-3 flex flex-col justify-between">
        
        {/* Green/Red dot in top-left */}
        {status === "RELEASING" ? (
          <div className="live-dot absolute top-2 left-2"></div>
        ) : (
          <GoDotFill
            size={12}
            className="absolute top-2 left-2"
            style={{ color: "#ef4444", textShadow: "0px 0px 10px black" }}
          />
        )}
    
        {/* Title */}
        <p className="Title absolute content-center text-center line-clamp-2">
          {title}
        </p>
    
        {/* Bottom info */}
        <div className="flex justify-between items-center">
          <p className="MoreInfo text-gray-300 line-clamp-1">{info}</p>
          <div className="CardBadge flex items-center gap-1">
            <p className="CardBadgeText">{cardbadge}</p>
            <FaStar size={12} style={{ color: "yellow", padding: 1 }} />
          </div>
        </div>
      </div>
    
      {/* Play button */}
      <FaPlay
        className="PlayBtn absolute bottom-2 right-2"
        size={28}
        style={{ color: "#3888E7", padding: 1 }}
      />
    </div>
    
  );
};

export default DiscoverCard;

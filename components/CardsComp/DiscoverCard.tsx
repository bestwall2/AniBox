import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa6";

interface ListItemsProps {
  title: string;
  info: string;
  img: string;
  cardbadge: string;
  
  // Ensure "boolean" is lowercase in TypeScript
}

const DiscoverCard: React.FC<ListItemsProps> = ({
  title,
  info,
  img,
  cardbadge,
  
}) => {
  return (
    <div className="Listcontainer  relative transition-transform ease-in delay-2 hover:scale-90 rounded-2xl" >
      {/* Optimized Next.js Image */}

      <Image src={img} alt={title} layout="fill" objectFit="cover" priority />

      <div className="CardShadow absolute">
        
        <p className="Title  absolute  content-center  text-center line-clamp-2">
          <h1 className="absolute mr-2">•</h1>
          {title}
        </p>
        <p className="MoreInfo text-gray-300 absolute line-clamp-1 bottom-0">
          {" "}
          {info}{" "}
        </p>
        <div className="CardBadge flex items-center justify-start">
          <p className="CardBadgeText self-center">{cardbadge}</p>
          <FaStar
            className=""
            size={12}
            style={{ color: "yellow", padding: 1 }}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscoverCard;

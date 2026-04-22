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
    <div className="Listcontainer relative group transition-all duration-300 ease-out hover:scale-[1.02] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/20" >
      {/* Optimized Next.js Image */}

      <Image src={img} alt={title} layout="fill" objectFit="cover" priority className="transition-transform duration-500 group-hover:scale-110" />
      
      {/* Gradient Overlay */}
      <div className="CardShadow absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
      
        
        <p className="Title absolute content-center text-center line-clamp-2 px-2 font-semibold text-white drop-shadow-lg">
          {title}
        </p>
              
        <p className="MoreInfo text-gray-300 absolute line-clamp-1 bottom-0 text-xs md:text-sm px-3 py-2 drop-shadow-md">
          {" "}
          {info}{" "}
        </p>
        <div className="CardBadge flex items-center justify-start backdrop-blur-sm bg-black/60 border border-white/10">
          <p className="CardBadgeText self-center font-bold">{cardbadge}</p>
          <FaStar
            
            size={14}
            style={{ color: "#fbbf24", padding: 1 }}
          />
        </div>
        <div className="CardActive flex items-center justify-start">
            <GoDotFill
                size={20}
                style={{
                    color: status === "RELEASING" ? "#84d77b" : "#ef4444", // green or red
                    padding: 1,
                    textShadow: '0px 0px 10px black', // white shadow/glow
                }}
            />
        </div>
      <FaPlay className="PlayBtn opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={40} style={{ color: "#3888E7", filter: 'drop-shadow(0 0 10px rgba(56, 136, 231, 0.5))' }} /> 
    </div>
  );
};

export default DiscoverCard;

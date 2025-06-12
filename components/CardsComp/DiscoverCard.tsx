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
    <div className="Listcontainer  relative transition-all duration-300 ease-out hover:scale-[0.97]  rounded-2xl" >
      {/* Optimized Next.js Image */}

      <Image src={img} alt={title} layout="fill" objectFit="cover" priority />
      

      <div className="CardShadow absolute">
      
        
        <p className="text-sm font-bold absolute content-center text-center line-clamp-2"> {/* Applied text-sm and font-bold directly */}
          {title}
        </p>
              
        <p className="text-xs text-gray-300 absolute line-clamp-1 bottom-0"> {/* Applied text-xs directly */}
          {" "}
          {info}{" "}
        </p>
        <div className="text-xs flex items-center justify-start CardBadge"> {/* Applied text-xs to parent div */}
          <p className="self-center">{cardbadge}</p> {/* Removed CardBadgeText class */}
          <FaStar
            
            size={12}
            style={{ color: "yellow", padding: 1 }}
          />
        </div>
        <div className="CardActive  flex items-center justify-start">
            <GoDotFill
                size={17}
                style={{
                    color: status === "RELEASING" ? "#84d77b" : "#ef4444", // green or red
                    padding: 1,
                    textShadow: '0px 0px 10px black', // white shadow/glow
                }}
            />
        </div>
      </div>
      <FaPlay className="PlayBtn " size={38}  style={{ color: "#a08dff", padding: 1 }} /> 
    </div>
  );
};

export default DiscoverCard;

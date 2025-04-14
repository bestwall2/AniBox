"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { useState } from "react";

const Characters = ({ data }) => {
  return (
    <div className="ItemGeners mt-2 mb-2">
      <div className="Geners flex text-gray-200 items-center mb-2 space-x-2">
        <span className="w-1.5 rounded-full h-6 bg-indigo-500"></span>
        <p className="text-base font-bold">Characters</p>
      </div>

      <Swiper
        modules={[Navigation, FreeMode]}
        slidesPerView={3}
        spaceBetween={5}
        navigation={true}
        freeMode={true}
        className="swiper-animation"
      >
        {data.map((edge, index) => {
          const character = edge.node;
          const va = edge.voiceActorRoles?.[0]?.voiceActor;

          return (
            <SwiperSlide key={index} className="cursor-pointer">
              <CharacterCard
                character={character}
                voiceActor={va}
                role={edge.role}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

const CharacterCard = ({ character, voiceActor, role }) => {
  const [hovered, setHovered] = useState(false);

  const charImage = character?.image?.large;
  const charName = character?.name?.full || "Unknown";
  const vaImage = voiceActor?.image?.large;
  const vaName = voiceActor?.name?.full || "Unknown VA";

  return (
    <div
      className="relative bg-zinc-900 rounded-lg shadow-md overflow-hidden transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image with fade transition */}
      <div className="w-full h-[180px]">
        <img
          src={hovered && vaImage ? vaImage : charImage}
          alt={hovered ? vaName : charName}
          className="w-full h-full object-cover transition-opacity duration-300 opacity-0"
          onLoad={(e) => (e.target.style.opacity = 1)}
        />
      </div>

      {/* Name and Role */}
      <div className="mt-1 text-center px-1">
        <h3 className="text-white text-sm font-semibold truncate">
          {hovered ? vaName : charName}
        </h3>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  );
};

export default Characters;
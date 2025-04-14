"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import CharacterCard from "./CardsComp/CharacterCard"; // path where you save it

const Characters = ({ characters }) => {
  return (
    <div className="ItemGeners mt-2 mb-2">
      <div className="Geners flex text-gray-200 items-center mb-2 space-x-2">
        <span className="w-1.5 rounded-full h-6 bg-indigo-500"></span>
        <p className="text-md font-semibold">Characters</p>
      </div>

      <Swiper
        modules={[Navigation, FreeMode]}
        slidesPerView={3}
        spaceBetween={5}
        navigation={true}
        freeMode={true}
        className="swiper-animation"
      >
        {characters.map((edge, index) => {
          const character = edge.node;
          const voiceActor = edge.voiceActorRoles?.[0]?.voiceActor;
          const role = edge.role;

          return (
            <SwiperSlide key={`${character.id}-${index}`} className="cursor-pointer">
              <CharacterCard character={character} voiceActor={voiceActor} role={role} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Characters;
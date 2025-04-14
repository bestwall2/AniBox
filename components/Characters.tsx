"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { useState } from "react";

const CharactersSwiper = ({ characters }) => {
  return (
    <div className="mt-6 px-4">
      <h2 className="text-white text-lg font-bold mb-3">Characters</h2>
      <Swiper
        spaceBetween={10}
        slidesPerView={2.2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        navigation={true}
        modules={[Navigation]}
        className="character-swiper"
      >
        {characters?.map((char, index) => (
          <SwiperSlide key={index}>
            <CharacterCard char={char} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const CharacterCard = ({ char }) => {
  const [hovered, setHovered] = useState(false);

  const characterImg = char.node?.image?.large;
  const characterName = char.node?.name?.full || "Unknown";

  const va = char.voiceActorRoles?.[0]?.voiceActor;
  const vaImg = va?.image?.large;
  const vaName = va?.name?.full || "Unknown VA";

  return (
    <div
      className="bg-zinc-900 rounded-lg shadow-md p-2 transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered && vaImg ? vaImg : characterImg}
        alt={hovered && vaName ? vaName : characterName}
        className="w-full h-[180px] object-cover rounded-md"
      />
      <div className="mt-2 text-center">
        <h3 className="text-white text-sm font-semibold truncate">
          {hovered ? vaName : characterName}
        </h3>
        <p className="text-xs text-muted-foreground">
          {char.role || "Role"}
        </p>
      </div>
    </div>
  );
};

export default CharactersSwiper;
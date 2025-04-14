import Image from "next/image";
import { useState } from "react";

const CharacterCard = ({ character, voiceActor, role }) => {
  const [hovered, setHovered] = useState(false);

  const charImage = character?.image?.large;
  const charName = character?.name?.full || "Unknown";
  const vaImage = voiceActor?.image?.large;
  const vaName = voiceActor?.name?.full || "Unknown VA";

  return (
    <div
      className="Listcontainer relative transition-transform ease-in delay-2 hover:scale-90 rounded-2xl overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={hovered && vaImage ? vaImage : charImage}
        alt={hovered ? vaName : charName}
        layout="fill"
        objectFit="cover"
        priority
        className="transition-opacity duration-300 ease-in-out"
      />

      <div className="CardShadow absolute">
        <p className="Title absolute content-center text-center line-clamp-2">
          {hovered ? vaName : charName}
        </p>

        <p className="MoreInfo text-gray-300 absolute line-clamp-1 bottom-0">
          Role: {role}
        </p>
      </div>
    </div>
  );
};

export default CharacterCard;
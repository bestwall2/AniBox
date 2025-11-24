import Image from "next/image";
import { useState } from "react";

const CharacterCard = ({ character, voiceActor, role }) => {
  const [hovered, setHovered] = useState(false);

  
  const charName = character?.name?.full || "Unknown";
  const vaImage = `/api/proxy?url=${encodeURIComponent(voiceActor?.image?.large)}`;
  const charImage = character?.image?.large
  ? `/api/proxy?url=${encodeURIComponent(character.image.large)}`
  : null;
  const vaImage = voiceActor?.image?.large
  ? `/api/proxy?url=${encodeURIComponent(voiceActor.image.large)}`
  : null;



  return (
    <div
      className="Listcontainer transition-all duration-300 ease-out hover:scale-[0.97] relative  rounded-2xl overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={hovered && vaImage ? vaImage : charImage}
        alt={hovered ? vaName : charName}
        layout="fill"
        objectFit="cover"
        priority
        className=""
      />

      <div className="CardShadow absolute">
        <p className="Title absolute content-center text-center line-clamp-1">
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
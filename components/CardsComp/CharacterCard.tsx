import Image from "next/image";
import { useState } from "react";

const CharacterCard = ({ character, voiceActor, role }) => {
  const [hovered, setHovered] = useState(false);

  const charName = character?.name?.full || "Unknown";
  const vaName = voiceActor?.name?.full || "Unknown VA";

  const charImage = character?.image?.large
    ? `/api/proxy?url=${encodeURIComponent(character.image.large)}`
    : null;

  const vaImage = voiceActor?.image?.large
    ? `/api/proxy?url=${encodeURIComponent(voiceActor.image.large)}`
    : null;

  return (
    <div
      className="Listcontainer transition-all duration-300 ease-out hover:scale-[0.97] relative rounded-2xl overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        key={hovered ? "va" : "char"}          // 🟢 FIX
        src={hovered && vaImage ? vaImage : charImage}
        alt={hovered ? vaName : charName}
        fill
        style={{ objectFit: "cover" }}
        priority
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

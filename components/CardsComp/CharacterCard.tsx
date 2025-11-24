import Image from "next/image";
import { useState } from "react";

const CharacterCard = ({ character, voiceActor, role }) => {
  const [hovered, setHovered] = useState(false);
  const handleClick = () => {
  setHovered(!hovered);
  };
  
  const charName = character?.name?.full || "Unknown";
  const vaName = voiceActor?.name?.full || "Unknown VA";

  const charImage = character?.image?.large
    ? `/api/proxy?url=${encodeURIComponent(character.image.large)}`
    : null;

  const vaImage = voiceActor?.image?.large
    ? `/api/proxy?url=${encodeURIComponent(voiceActor.image.large)}`
    : null;

  console.log("CHAR:", character);
  console.log("VA:", voiceActor);


  return (
    <div
      className="Listcontainer transition-all duration-300 ease-out hover:scale-[0.97] relative rounded-2xl overflow-hidden"
      onMouseEnter={() => setHovered(true)}   // desktop hover start
      onMouseLeave={() => setHovered(false)}  // desktop hover end
    >
      <Image
        key={hovered ? vaImage : charImage}  // dynamic key ensures new image is mounted
        src={hovered && vaImage ? vaImage : charImage}
        alt={hovered ? vaName : charName}
        fill
        style={{ objectFit: "cover" }}
        unoptimized // optional: avoids Next.js cache issues
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

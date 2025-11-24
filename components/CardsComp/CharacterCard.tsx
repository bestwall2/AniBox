import Image from "next/image";
import { useState } from "react";

const CharacterCard = ({ character, voiceActor, role }) => {
  const [hovered, setHovered] = useState(false);

  // Original image sources
  const charImage = character?.image?.large;
  const vaImage = voiceActor?.image?.large;

  const charName = character?.name?.full || "Unknown";
  const vaName = voiceActor?.name?.full || "Unknown VA";

  const imgbup = "/fallback.png"; // <-- your fallback backup image

  // Proxy images
  const proxiedCharImage = charImage
    ? `/api/proxy?url=${encodeURIComponent(charImage)}`
    : imgbup;

  const proxiedVaImage = vaImage
    ? `/api/proxy?url=${encodeURIComponent(vaImage)}`
    : imgbup;

  return (
    <div
      className="Listcontainer transition-all duration-300 ease-out hover:scale-[0.97] relative rounded-2xl overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={hovered && vaImage ? proxiedVaImage : proxiedCharImage}
        alt={hovered ? vaName : charName}
        layout="fill"
        objectFit="cover"
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

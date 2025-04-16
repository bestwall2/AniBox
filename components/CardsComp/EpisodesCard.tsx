import Image from "next/image";
import { FaPlay } from "react-icons/fa";

const EpisodeCard = ({ title, description, image, number, imgbup }) => {
  return (
    <div className="bg-zinc-800 h-[75px] transition-all duration-300 ease-out hover:scale-[0.97] rounded-xl shadow-xl flex items-center space-x-[0.5]">
        <div className="relative transition-all duration-300 ease-out hover:scale-[0.97] w-[120px] min-h-[75px] max-h-[75px] rounded-lg overflow-hidden flex-shrink-0">
            <Image
            src={image.includes('https://') ? image : imgbup}
            alt={title}
            layout="fill"
            objectFit="cover"
            priority
            className="rounded-lg object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <FaPlay size={18} className="text-white opacity-90" />
            </div>
        </div>
        
        <div className="flex flex-col p-2 mt-3 mb-3 overflow-hidden">
            <h3 className="text-sm font-semibold text-white truncate">{`${number}. ${title}`}</h3>
            <p className="text-sm text-gray-300 line-clamp-3">
            {description.includes('$undefined') ? "" : description}
            </p>
        </div>
    </div>
  );
};

export default EpisodeCard;
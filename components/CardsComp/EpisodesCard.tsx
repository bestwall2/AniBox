import Image from "next/image";
import { FaPlay } from "react-icons/fa";

const EpisodeCard = ({ title, description, image, number, imgbup }) => {
  return (
    <div className="bg-zinc-800 h-[75px] transition-all pt-2 pb-2 duration-300 ease-out hover:scale-[0.97] rounded-xl shadow-xl flex items-center">
        <div className="relative transition-all duration-300 ease-out hover:scale-[0.97] w-[120px] min-h-[75px] max-h-[75px] rounded-lg overflow-hidden flex-shrink-0">
            <Image
            src={typeof image === 'string' && image.includes('https://') ? image : imgbup}
            alt={title}
            layout="fill"
            objectFit="cover"
            priority
            className="rounded-lg object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <FaPlay size={18} className="text-white opacity-90" />
            </div>

            {/* Episode number with dark, semi-transparent background */}
            <div className="absolute font-bold bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-tr-lg">
                EP {number}
            </div>

        </div>

        <div className="flex flex-col pt-2 pb-2 pl-3 overflow-hidden"> {/* Added padding here */}
            <h3 className="text-md font-semibold text-white truncate">{`${number}. ${title}`}</h3>
            <p className="text-sm text-gray-200 line-clamp-2 leading-tight max-h-[3em]"> {/* Adjusted line-clamp and added max-height */}
            {typeof description === 'string' && description.includes('$undefined') ? "" : description}
            </p>
        </div>
    </div>
  );
};

export default EpisodeCard;

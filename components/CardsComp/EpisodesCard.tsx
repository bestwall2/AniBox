import Image from "next/image";

const EpisodeCard = ({ title, description, image, number, imgbup }) => {
  return (
    <div className="bg-zinc-800 transition-all duration-300 ease-out hover:scale-[0.98] rounded-xl shadow-lg flex items-center space-x-1 p-2">
      <div className="relative w-[120px] min-h-[65px]  max-h-[65px] rounded-lg overflow-hidden flex-shrink-0">
        <Image
            src={image.includes('https://') ? image : imgbup}
            alt={title}
            width={120}
            height={65}           
            objectFit="cover"
            priority
            className="rounded-lg object-cover"
        />
      </div>

      <div className="flex flex-col overflow-hidden">
        <h3 className="text-sm font-semibold ml-1  text-white truncate">{`${number}. ${title}`}</h3>
        <p className="text-sm text-gray-300 ml-1 line-clamp-2">{description.includes('$undefined') ? "" : description}</p>
      </div>
    </div>
  );
};

export default EpisodeCard;
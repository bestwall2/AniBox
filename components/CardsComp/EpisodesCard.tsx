import Image from "next/image";

const EpisodeCard = ({ title, description, image, number, imgbup }) => {
  return (
    <div className="bg-zinc-800 transition-all duration-300 ease-out hover:scale-[0.97] rounded-xl shadow-lg flex items-center space-x-2 p-2 h-[100px]">
      <div className="relative w-[160px] h-full rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={image?.includes('https://') ? image : imgbup}
          alt={title}
          layout="fill"
          objectFit="cover"
          priority
          className="rounded-lg object-cover"
        />
      </div>

      <div className="flex flex-col justify-center overflow-hidden h-full">
        <h3 className="text-sm font-semibold text-white truncate">{`${number}. ${title}`}</h3>
        <p className="text-sm text-gray-300 line-clamp-2">{description?.includes('$undefined') ? "" : description}</p>
      </div>
    </div>
  );
};

export default EpisodeCard;
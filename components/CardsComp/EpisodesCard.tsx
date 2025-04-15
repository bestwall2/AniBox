import Image from "next/image";

const EpisodeCard = ({ title, description, image, number, imgbup }) => {
  return (
    <div className="bg-zinc-800 rounded-xl shadow-lg flex items-center space-x-4 p-2">
      <div className="relative w-[100px] h-[80px] rounded-lg overflow-hidden flex-shrink-0">
        <Image
            src={image || imgbup}
            alt={title}
            width={160}
            height={90}
            className="rounded-lg object-cover"
        />
      </div>

      <div className="flex flex-col overflow-hidden">
        <h3 className="text-sm font-semibold text-white truncate">{`${number}. ${title}`}</h3>
        <p className="text-sm text-gray-300 line-clamp-2">{description || ""}</p>
      </div>
    </div>
  );
};

export default EpisodeCard;
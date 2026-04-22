"use client";

// Shadcn styles
import { Button } from "./ui/button";
// Import Swiper styles
import React from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/effect-coverflow";
import { FaPlay } from "react-icons/fa";
import { FaPlayCircle } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { FaStar } from "react-icons/fa6";
import { Skeleton } from "./ui/skeleton";
import { HiOutlineInformationCircle } from "react-icons/hi";
import parse from 'html-react-parser';
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

// Define the type for API response data
interface Anime {
  id: number;
  title: { english: string | null; romaji: string | null };
  coverImage: { large: string | null; extraLarge: string };
  averageScore: number | null;
  format: string;
  status: string;
  description: string;
  startDate: { year: number; month: number; day: number };
}

const fetchPopularAnime = async () => {
  const response = await fetch("/api/popular-anime");
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  const data = await response.json();
  return data.Page?.media.slice(0, 5) || [];
};

const Slider = () => {
  const { data: animeList, isLoading, error } = useQuery<Anime[], Error>({
    queryKey: ["popularAnime"],
    queryFn: fetchPopularAnime,
  });

  if (error) {
    console.error("Error fetching popular anime:", error);
    // Optionally, render an error state here
  }

  return (
    <>
      {isLoading ? (
        <Skeleton className="SkeletonCard h-[60vh] w-[100%]" />
      ) : (
        <Swiper
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={999}
          loop={true}
          modules={[EffectCoverflow, Autoplay]}
          slidesPerView={"auto"}
          effect="coverflow"
          spaceBetween={0}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          className="sliderContainer"
        >
          {animeList?.map((anime) => (
            <SwiperSlide key={`${anime.id}-${anime.title.romaji}`} className="slideItem">
              <div className="container relative overflow-hidden rounded-2xl">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={anime.coverImage.extraLarge}
                    alt={
                      anime.title.english || anime.title.romaji || "Unknown Title"
                    }
                    layout="fill"
                    objectFit="cover"
                    className="opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>
                </div>
                
                {/* Content Container */}
                <div className="relative z-10 flex flex-col justify-end h-[60vh] md:h-[70vh] lg:h-[75vh] p-6 md:p-8 lg:p-12">
                  <div className="InfoContainer max-w-4xl mx-auto w-full">
                    {/* Rating Badge */}
                    <div className="flex items-center justify-start mb-3 animate-fadeIn">
                      <div className="bg-yellow-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 border border-yellow-500/30">
                        <FaStar size={16} className="text-yellow-400" />
                        <h2 className="font-bold text-yellow-400 text-sm md:text-base"> 
                          {anime.averageScore ? `${anime.averageScore / 10}` : "N/A"}
                        </h2>
                      </div>
                    </div>

                    {/* Title */}
                    <h1 className="Title font-bold text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-3 drop-shadow-lg leading-tight">
                      {anime.title.english ||
                      anime.title.romaji ||
                      "Unknown Title"}
                    </h1>

                    {/* Description */}
                    <p className="Description text-sm md:text-base text-gray-300 mb-4 line-clamp-3 md:line-clamp-4 max-w-2xl drop-shadow-md">
                      {parse(anime.description)}
                    </p>

                    {/* Additional Info */}
                    <div className="Addtion flex flex-wrap gap-3 md:gap-4 mb-6 text-xs md:text-sm">
                      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
                        <FaPlayCircle className="text-blue-400" size={16} />
                        <span className="font-medium text-gray-200">{anime.format || "Unknown Format"}</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                          anime.status === "RELEASING" 
                            ? "bg-green-500/20 border-green-500/30 text-green-400" 
                            : "bg-red-500/20 border-red-500/30 text-red-400"
                        }`}
                      >
                        <span className="font-medium">{anime.status || "Unknown Status"}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
                        <MdDateRange className="text-purple-400" size={16} />
                        <span className="font-medium text-gray-200">
                          {anime.startDate
                            ? `${anime.startDate.year}`
                            : "Unknown Date"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      <Button
                        className="SliderButton bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)] hover:opacity-90 font-semibold rounded-xl px-6 py-3 md:px-8 md:py-4 text-sm md:text-base shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                        variant="styled"
                      >
                        <FaPlay size={14} className="mr-2" /> Play Now 
                      </Button>
                      
                      <Link href={`/anime/info/${anime.id}`} passHref>
                        <Button
                          className="SliderButton bg-white/10 hover:bg-white/20 backdrop-blur-sm font-semibold rounded-xl px-6 py-3 md:px-8 md:py-4 text-sm md:text-base border border-white/20 transition-all duration-300 hover:scale-105"
                          variant="outline"
                        >
                          <HiOutlineInformationCircle size={20} className="mr-2" /> More Info 
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};
export default Slider;

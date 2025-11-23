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
          

        >
          {animeList?.map((anime) => (
            <SwiperSlide key={`${anime.id}-${anime.title.romaji}`}>
            
  
                <div className="container">
                    <Image
                    src={anime.coverImage.extraLarge}
                    alt={
                        anime.title.english || anime.title.romaji || "Unknown Title"
                    }
                    layout="responsive"
                    width={500}
                    height={300}
    
                    />
                    <div className="ContainerLayout"></div>
                    <div className="InfoContainer m-4 text-left">
                        
                        <h1 className="Title tex-xl t font-bold">
                            {anime.title.english ||
                            anime.title.romaji ||
                            "Unknown Title"}
                        </h1>
                        <div className="flex items-center justify-start ">
                            <FaStar size={15} style={{ color: "yellow" }} />
                            <h2 className="Trending font-semibold pl-1 pt-1 text-yellow-400"> 
                            {
                                anime.averageScore ? `${anime.averageScore / 10}` : N/A
                            }
                            </h2>
                        </div>
                        <p className="Description  text-sm w-auto block-words pr-5 mt-1 mb-1  line-clamp-5 text-gray-400">
                            {parse(anime.description)}
                        </p>
                        <div className="Addtion font-semibold mb-2 space-x-3 h-auto">
                            <h1>
                            <FaPlayCircle className="m-1 self-center" size={13} />
                            {anime.format || "Unknown Format"}
                            </h1>
                            <h1
                            className={`State ${anime.status === "RELEASING" ? "text-green-500" : "text-red-500"}`}
                            >
                            {anime.status || "Unknown Status"}
                            </h1>
                            <h1>
                            <MdDateRange className="m-1 self-center" size={13} />
                            {anime.startDate
                                ? `${anime.startDate.year} ${anime.startDate.month}, ${anime.startDate.day}`
                                : "Unknown Date"}     
                            </h1>
                        </div>
                        <Button
                            className="SliderButton p-4 bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)] font-semibold rounded-xl mr-2"
                            variant="styled"
                        >
                            <FaPlay size={12} /> Play Now 
                        </Button>
                        
                        <Link href={ `/anime/info/${anime.id}`} passHref>
                            <Button
                                className="SliderButton p-4 font-semibold rounded-xl "
                                variant="outline" >
                                <HiOutlineInformationCircle size={22} /> More Info 
                            </Button>
                        </Link>
                    
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

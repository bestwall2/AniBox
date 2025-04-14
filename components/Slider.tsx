"use client";

// Shadcn styles
import { Button } from "./ui/button";
// Import Swiper styles
import React, { useEffect, useState } from "react";
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

const Slider = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch popular anime data from the API
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch("/api/popular-anime");
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setAnimeList(data.Page?.media.slice(0, 5) || []); // Ensure data is extracted correctly
      } catch (error) {
        console.error("Error fetching popular anime:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  return (
    <>
      {loading ? (
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
          {animeList.map((anime) => (
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
                        <div className="flex items-center justify-start ">
                            <FaStar size={15} style={{ color: "yellow" }} />
                            <h2 className="Trending font-semibold pl-1 pt-1 text-yellow-400"> 
                            {
                                anime.averageScore ? `${anime.averageScore / 10}` : N/A
                            }
                            </h2>
                        </div>
                        <h1 className="Title font-bold">
                            {anime.title.english ||
                            anime.title.romaji ||
                            "Unknown Title"}
                        </h1>
                        <p className="Description  text-sm w-auto block-words mt-2 mb-1  line-clamp-5 text-gray-400">
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
                            className="SliderButton font-semibold rounded-xl mr-2"
                            variant="styled"
                        >
                            <FaPlay size={12} /> Play Now 
                        </Button>
                        
                        <Link href={ `/anime/info/${anime.id}`} passHref>
                            <Button
                                className="SliderButton font-semibold rounded-xl "
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

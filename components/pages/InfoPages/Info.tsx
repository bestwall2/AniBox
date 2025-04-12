"use client";

import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import  MyTabs  from "../../ui/tabs";

function Info({ id }) {
  const [coverImage, setCoverImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [genres, setGenres] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/anime-info?id=${id}`);
        
        const data = await response.json();
        console.log(data);
        const media = data?.Media;

        if (media) {
          setCoverImage(media.coverImage.extraLarge);
          setBannerImage(media.bannerImage);
          setTitle(media.title.romaji);
          setRating(media.averageScore);
          setEpisodes(media.episodes);
          setGenres(media.genres);
          setStartDate(media.startDate);
          setStatus(media.status || "Unknown Status");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!bannerImage && !coverImage) {
    return <div className="text-center text-white mt-20">Loading...</div>;
  }

  return (
    <>
    <div className="h-[100vh]">
        <div className="CoverPage">
            <div className="h-[210px] overflow-hidden absolute inset-0 z-0">
            <img
                src={bannerImage || coverImage}
                alt="Banner Image"
                className="w-full h-full object-cover opacity-60"
                loading="lazy"
            />
            <div className="Bannerbackground absolute" />
            </div>
        </div>
        
        {/* Back Arrow Button */}
        <div className="absolute top-4 left-4 z-20">
            <IoMdArrowRoundBack
            size={30}
            style={{
                color: "white",
                margin: 5,
            }}
            />
        </div>
        
        <div className="relative z-10 flex flex-row items-left justify-center px-4 pt-24 space-y-6">
            {/* Cover Image */}
            <div className="h-[180px] w-[120px] rounded-xl overflow-hidden shadow-xl bg-black backdrop-blur-sm">
            {coverImage ? (
                <img
                src={coverImage}
                alt="Cover Image"
                className="h-full w-full object-fill"
                loading="lazy"
                />
            ) : (
                <div className="h-full w-full bg-gray-700 flex items-center justify-center text-white">
                No Image
                </div>
            )}
            </div>
        
            <div className="flex-col ml-1 mt-0 items-center justify-center">
                {/* Title & Rating */}
                <div className="text-left px-4">
                    <h1 className="text-2xl font-bold line-clamp-2 text-white drop-shadow-lg break-words max-w-[200px]">
                    {title || "Unknown Title"}
                    </h1>
                </div>
            
                <div className="flex ml-3 mt-2 font-bold items-left justify-start">
                    <FaStar size={20} style={{ color: "yellow", padding: 1 }} />
                    <p className="text-md ml-1 self-center">
                    {rating ? rating / 10 : "N/A"} |
                    </p>
                    <p
                    className={`ml-2 ${
                        status === "RELEASING" ? "text-green-500" : "text-red-500"
                    }`}
                    >
                    {status}
                    </p>
                </div>
            
                <h1 className="flex ml-3 font-bold items-left justify-start">
                    <MdDateRange className="self-center mr-1" size={20} />
                    {startDate
                    ? `${startDate.year} / ${startDate.month} / ${startDate.day}`
                    : "Unknown Date"}
                </h1>
            
                <h1 className="CardGenres text-sm flex ml-3 font-bold items-left justify-start">
                    {genres.length ? genres.join(", ") : ""}
                </h1>
                <h1 className="text-sm flex ml-3 font-bold items-left justify-start">
                    {`Episodes : ${episodes}`}
                </h1>
            </div>
            
        </div>
        <MyTabs/>
    </div>
    </>
  );
}

export default Info;
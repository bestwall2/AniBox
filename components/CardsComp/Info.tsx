"use client";

import React, { useState, useEffect } from "react";

function Info({ id }) {
  const [coverImage, setCoverImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query ($id: Int) {
                Media(id: $id) {
                  title {
                    romaji
                  }
                  coverImage {
                    extraLarge
                  }
                  bannerImage
                  averageScore
                }
              }
            `,
            variables: { id: parseInt(id) },
          }),
        });
        const data = await response.json();
        const media = data?.data?.Media;

        if (media) {
          setCoverImage(media.coverImage.extraLarge);
          setBannerImage(media.bannerImage);
          setTitle(media.title.romaji);
          setRating(media.averageScore);
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
        <div className="relative w-full h-auto text-white overflow-hidden">
        {/* Banner background */}
        <div className=" absolute inset-0 z-0">
            <img
            src={bannerImage || coverImage}
            alt="Banner"
            className="w-full h-full object-cover opacity-60"
            />
            <div className="Bannerbackground absolute " />
        </div>
    
        {/* Foreground content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-24 space-y-6">
            {/* Cover Image Card */}
            <div className="h-[200px] w-auto rounded-xl overflow-hidden shadow-xl border-2 border-white/20 backdrop-blur-sm bg-white/10">
            <img
                src={coverImage}
                alt="Cover"
                className="h-full w-auto object-fill"
            />
            </div>
    
            {/* Title & Rating */}
            <div className="text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {title}
            </h1>
            {rating && (
                <p className="text-green-400 font-medium text-lg mt-1 drop-shadow">
                ⭐ {rating / 10} / 10
                </p>
            )}
            </div>
    
            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
            <button className="bg-white text-black py-2 px-6 rounded-full font-semibold hover:bg-gray-300 transition">
                Play Now
            </button>
            <button className="bg-gray-800 bg-opacity-80 text-white py-2 px-6 rounded-full font-semibold hover:bg-gray-700 transition">
                Add to List
            </button>
            </div>
        </div>
        </div>
        <div className="h-[400px]">
        
        </div>
    </>
  );
}

export default Info;
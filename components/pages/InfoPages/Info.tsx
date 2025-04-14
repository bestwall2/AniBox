"use client";

import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import parse from 'html-react-parser';
import RecommendList from "../../Recommend";
import Characters from "../../Characters";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";


function Info({ id }) {
  const router = useRouter();
  
  const TabsPara = "data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-gl px-4 py-2  font-medium text-gray-700 data-[state=active]:text-white";
  const [coverImage, setCoverImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [genres, setGenres] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [data, setData] = useState([]);
  
  const [showMore, setShowMore] = useState(false);
  const formattedText = data?.description || "";
  const shortText = formattedText.slice(0, 300); // adjust the limit as needed
  
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
          setData(media);
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
    return <div className="bg-black h-full text-center justify-center text-white mt-20">
    
    
    </div>;
  }

  return (
    <>
    
    <div className=" bg-black">
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
        <button onClick={() => router.back()}>
            <IoMdArrowRoundBack
            size={30}
            style={{
                color: "white",
                margin: 5,
            }}
            />
        </button>
        </div>
        
        <div className="relative z-10 flex flex-row items-left justify-center px-4 pt-24 space-y-6">
            {/* Cover Image */}
            <div className="rounded-xl mt-5 shadow-xl bg-black backdrop-blur-sm">
                {coverImage ? (
                    <img
                    src={coverImage}
                    alt="Cover Image"
                    className="min-h-[23vh] min-w-[14vh] max-h-[23vh] max-w-[14vh] rounded-xl object-cover"
                    loading="lazy"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-700 flex items-center justify-center text-white">
                    No Image
                    </div>
                )}
            </div>
        
            <div className="InfoContainerPage flex-col ml-1 mt-0 items-center justify-center">
                {/* Title & Rating */}
                <div className="text-left px-4">
                    <h1 className="text-2xl font-bold line-clamp-2 text-white drop-shadow-lg break-words max-w-[200px]">
                    {title || "Unknown Title"}
                    </h1>
                </div>
            
                <div className="flex ml-3 mt-2 font-semibold items-left justify-start">
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
            
                <h1 className="flex ml-3 font-semibold items-left justify-start">
                    <MdDateRange className="self-center mr-1" size={20} />
                    {startDate
                    ? `${startDate.year} / ${startDate.month} / ${startDate.day}`
                    : "Unknown Date"}
                </h1>
            
                <h1 className="CardGenres  text-sm flex ml-3  items-left justify-start">
                    {genres.length ? genres.join(", ") : ""}
                </h1>
                <h1 className="text-sm flex ml-3 font-semibold items-left justify-start">
                    {`Episodes : ${episodes}`}
                </h1>
            </div>
            
        </div>
        <div className="m-2 w-auto flex flex-row gap-4 mt-2 items-center justify-center pt-5">

            <Tabs defaultValue="overview" className="w-full flex flex-col">
                <TabsList className="">
                    <TabsTrigger
                        value="overview"
                        className={TabsPara}
                    >
                        Overview
                    </TabsTrigger>
                    
                    <TabsTrigger
                        value="Relations"
                        className={TabsPara}
                    >
                        Relations
                    </TabsTrigger>
                    <TabsTrigger
                        value="Characters"
                        className={TabsPara}
                    >
                        Characters
                    </TabsTrigger>
                </TabsList>
            
                <TabsContent value="overview" className="mt-4 mb-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                            
                            <CardDescription className="font-small whitespace-pre-line">
                                <AnimatePresence initial={false} mode="wait">
                                    <motion.div
                                        key={showMore ? "expanded" : "collapsed"}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                        className="overflow-hidden"
                                    >
                                        {showMore
                                        ? parse(formattedText)
                                        : parse(shortText + (formattedText.length > 200 ? "..." : ""))}
                                    </motion.div>
                                </AnimatePresence>
                                    
                                {formattedText.length > 300 && (
                                    <button
                                        onClick={() => setShowMore(!showMore)}
                                        className="ml-2 text-blue-600 hover:underline text-sm font-medium transition-all duration-200"
                                    >
                                        {showMore ? "Show less" : "Show more"}
                                    </button>
                                )}
                                
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="font-bold  mb-2 leading-none tracking-tight">Details</h1>
                            
                            <ul className="flex flex-col gap-2 mt-4 ">
                                <li>
                                    <strong className="text-white text-sm font-semibold">Airing</strong> :{" "}
                                    <span className="text-sm font-semibold text-white">
                                    {data?.nextAiringEpisode?.airingAt
                                        ? new Date(data.nextAiringEpisode.airingAt * 1000).toLocaleString()
                                        : "FINISHED"}
                                    </span>
                                </li>
                                
                                <li>
                                    <strong className="text-white text-sm font-semibold">Type</strong> :{" "}
                                    <span className="text-sm text-muted-foreground">{data?.type || "Unknown"}</span>
                                </li>
                                
                                <li>
                                    <strong className="text-white text-sm font-semibold">Aired</strong> :{" "}
                                    <span className="text-sm text-muted-foreground">{data?.seasonYear || "N/A"}</span>
                                </li>
                                
                                <li>
                                    <strong className="text-white text-sm font-semibold">Season</strong> :{" "}
                                    <span className="text-sm text-muted-foreground">{data?.season || "Unknown"}</span>
                                </li>
                                
                                <li>
                                    <strong className="text-white text-sm font-semibold">Country</strong> :{" "}
                                    <span className="text-sm text-muted-foreground">{data?.countryOfOrigin || "Unknown"}</span>
                                </li>
                                
                                <li>
                                    <strong className="text-white text-sm font-semibold">Studios</strong> :{" "}
                                    <span className="text-sm text-muted-foreground">
                                    {data?.studios?.nodes?.length
                                        ? data.studios.nodes.map((studio) => studio.name).join(", ")
                                        : "Unknown"}
                                    </span>
                                </li>
                                
                                <li>
                                    <strong className="text-white text-sm font-semibold">Source</strong> :{" "}
                                    <span className="text-sm text-muted-foreground">{data?.source || "Unknown"}</span>
                                </li>
                                
                                <li>
                                    <strong className="text-white text-sm font-semibold">Duration</strong> :{" "}
                                    <span className="text-sm text-muted-foreground">
                                    {data?.duration ? `${data.duration} min` : "N/A"}
                                    </span>
                                </li>
                                
                                <li>
                                    <strong className="text-white text-sm font-semibold">Popularity</strong> :{" "}
                                    <span className="text-sm text-muted-foreground">{data?.popularity || "N/A"}</span>
                                </li>
                            </ul>
                            
                        </CardContent>
                    </Card>             
                </TabsContent>
                <TabsContent value="Relations" className="mt-4 mb-2">
                     <RecommendList
                            geners="Chronology"
                            data={data.relations?.edges || []}
                            param="font-semibold text-md mt-2 mb-2"
                        />
                </TabsContent>
                <TabsContent value="Characters" className="mt-4">
                     {data?.characters?.edges && (
                            <Characters characters={data.characters.edges} />
                     )}
                </TabsContent>
                <RecommendList
                    geners="Recommended"
                    data={
                    data.recommendations?.nodes?.map((rec) => ({
                    relationType: "RECOMMENDATION",
                    node: rec.mediaRecommendation,
                    })) || []
                    }
                    param="font-semibold text-md mt-2 mb-2"
                />  
            </Tabs>
        
        </div>
    </div>
  </>
  );
}

export default Info;
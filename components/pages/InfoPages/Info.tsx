"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import parse from 'html-react-parser';
import { motion, AnimatePresence } from "framer-motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import RecommendList from "../../Recommend";
import Characters from "../../Characters";
import Episodes from "../../Episodes";

function Info({ id }) {
  const router = useRouter();
  const [animeInfo, setAnimeInfo] = useState({});
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const {
    coverImage,
    bannerImage,
    title,
    rating,
    status,
    startDate,
    genres,
    episodes,
    description,
    nextAiringEpisode,
    type,
    season,
    seasonYear,
    countryOfOrigin,
    studios,
    source,
    duration,
    popularity,
    characters,
    relations,
    recommendations,
  } = animeInfo;

  const shortText = description?.slice(0, 300) || "";
  const formattedText = description || "";

  const TabsPara =
    "data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-gl px-4 py-2 font-medium text-gray-700 data-[state=active]:text-white";

  useEffect(() => {
    if (!id) return;

    const fetchAnimeData = async () => {
      try {
        // Anime info
        const infoRes = await fetch(`/api/anime-info?id=${id}`);
        const infoJson = await infoRes.json();
        const media = infoJson?.Media;

        if (media) {
          setAnimeInfo(media);
        }

        // Episodes data
        const episodesRes = await fetch(`/api/anime-episodes?id=${id}`);
        const raw = await episodesRes.text();
        const parts = raw.split("\n");

        const providersRaw = parts.find((p) => p.startsWith("1:"));
        if (!providersRaw) return;

        const providersJson = providersRaw.replace(/^1:/, "");
        const epiData = JSON.parse(providersJson);

        let provider = epiData.find(
          (p) => p.providerId === "pahe" && p.episodes.length > 0
        );

        if (!provider) {
          provider = epiData.find(
            (p) => p.providerId === "yuki" && p.episodes.length > 0
          );
        }

        if (provider) {
          const episodes = provider.episodes.map((ep) => ({
            id: ep.id,
            number: ep.number,
            title: ep.title,
            img: ep.img,
            description: ep.description,
          }));

          setAllEpisodes(episodes);
        }
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };

    fetchAnimeData();
  }, [id]);

  if (!bannerImage && !coverImage) {
    return (
      <div className="bg-black h-full text-center justify-center text-white mt-20">
        {/* Loading or empty state */}
      </div>
    );
  }

  return (
    <div className="bg-black">
      {/* Banner Section */}
      <div className="CoverPage">
        <div className="h-[210px] overflow-hidden absolute inset-0 z-0">
          <img
            src={bannerImage || coverImage}
            alt="Banner"
            className="w-full h-full object-cover opacity-60"
            loading="lazy"
          />
          <div className="Bannerbackground absolute" />
        </div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <button onClick={() => router.back()}>
          <IoMdArrowRoundBack size={30} style={{ color: "white", margin: 5 }} />
        </button>
      </div>

      {/* Profile Avatar */}
      <div className="absolute m-1 top-4 right-4 z-20 flex items-center space-x-3">
        <img
          className="w-9 h-9 transition-transform hover:scale-90 rounded-full border-gray-600 border-2"
          src="https://raw.githubusercontent.com/bestwall2/AniPlay/refs/heads/main/app/images/profile.jpg"
          alt="user"
        />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-row items-left justify-center px-4 pt-24 space-y-6">
        <div className="rounded-xl mt-5 shadow-xl bg-black backdrop-blur-sm">
          {coverImage ? (
            <img
              src={coverImage}
              alt="Cover"
              className="min-h-[23vh] min-w-[14vh] max-h-[23vh] max-w-[14vh] rounded-xl object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gray-700 flex items-center justify-center text-white">
              No Image
            </div>
          )}
        </div>

        {/* Anime Info */}
        <div className="InfoContainerPage flex-col ml-1 mt-0 items-center justify-center">
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
            <p className={`ml-2 ${status === "RELEASING" ? "text-green-500" : "text-red-500"}`}>
              {status}
            </p>
          </div>

          <h1 className="flex ml-3 font-semibold items-left justify-start">
            <MdDateRange className="self-center mr-1" size={20} />
            {startDate
              ? `${startDate.year} / ${startDate.month} / ${startDate.day}`
              : "Unknown Date"}
          </h1>

          <h1 className="CardGenres text-sm flex ml-3 items-left justify-start">
            {genres?.join(", ")}
          </h1>
          <h1 className="text-sm flex ml-3 font-semibold items-left justify-start">
            {`Episodes : ${episodes}`}
          </h1>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="m-2 w-auto flex flex-row gap-4 mt-2 items-center justify-center pt-5">
        <Tabs defaultValue="overview" className="w-full flex flex-col">
          <TabsList>
            <TabsTrigger value="overview" className={TabsPara}>Overview</TabsTrigger>
            <TabsTrigger value="Relations" className={TabsPara}>Relations</TabsTrigger>
            <TabsTrigger value="Characters" className={TabsPara}>Characters</TabsTrigger>
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
                      transition={{ duration: 0.35 }}
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
                      className="ml-2 text-blue-600 hover:underline text-sm font-medium"
                    >
                      {showMore ? "Show less" : "Show more"}
                    </button>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <h1 className="font-bold mb-2">Details</h1>
                <ul className="flex flex-col gap-2 mt-4 text-sm text-white">
                  <li><strong>Airing</strong>: {nextAiringEpisode?.airingAt ? new Date(nextAiringEpisode.airingAt * 1000).toLocaleString() : "FINISHED"}</li>
                  <li><strong>Type</strong>: {type || "Unknown"}</li>
                  <li><strong>Aired</strong>: {seasonYear || "N/A"}</li>
                  <li><strong>Season</strong>: {season || "Unknown"}</li>
                  <li><strong>Country</strong>: {countryOfOrigin || "Unknown"}</li>
                  <li><strong>Studios</strong>: {studios?.nodes?.map((studio) => studio.name).join(", ") || "Unknown"}</li>
                  <li><strong>Source</strong>: {source || "Unknown"}</li>
                  <li><strong>Duration</strong>: {duration ? `${duration} min` : "N/A"}</li>
                  <li><strong>Popularity</strong>: {popularity || "N/A"}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Relations" className="mt-4 mb-2">
            <RecommendList
              geners="Chronology"
              data={relations?.edges || []}
              param="font-semibold text-md mt-2 mb-2"
              className="InfoListsForAni"
            />
          </TabsContent>

          <TabsContent value="Characters" className="mt-4">
            {characters?.edges && (
              <Characters className="InfoListsForAni" characters={characters.edges} />
            )}
          </TabsContent>

          <RecommendList
            geners="Recommended"
            data={recommendations?.nodes?.map((rec) => ({
              relationType: "RECOMMENDATION",
              node: rec.mediaRecommendation,
            })) || []}
            param="font-semibold text-md mt-2 mb-2"
            className="InfoListsForAni"
          />


        </Tabs>
      </div>
    </div>
  );
}

export default Info;
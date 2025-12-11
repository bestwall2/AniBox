"use client";

import React, { useState } from "react"; // Removed useEffect
import { useQuery } from "@tanstack/react-query"; // Added useQuery
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
} from "@/components/ui/card";
import parse from "html-react-parser";
import RecommendList from "../../Recommend";
import { Skeleton } from "../../ui/skeleton";
import Episodes from "../../Episodes";
import Characters from "../../Characters";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import profile from "../../app/images/profile.jpg";

// Helper function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};

// Helper function to format date
const formatDate = (dateObj: {
  year?: number;
  month?: number;
  day?: number;
}): string | undefined => {
  if (dateObj && dateObj.year && dateObj.month && dateObj.day) {
    return `${dateObj.year}-${String(dateObj.month).padStart(2, "0")}-${String(
      dateObj.day
    ).padStart(2, "0")}`;
  }
  return undefined;
};

// Fetch function for anime details
const fetchAnimeDetails = async (id: any) => {
  const response = await fetch(`/api/anime-info?id=${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok for anime details");
  }
  const data = await response.json();
  return data.Media; // Assuming the relevant data is in Media object
};


// Fetch function for anime episodes
const fetchAnimeEpisodes = async (id: any) => {
  const response = await fetch(`/api/anime-episodes?id=${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok for anime episodes");
  }

  const epi_data = await response.json();

  // Now the data is a simple array of episodes
  if (Array.isArray(epi_data)) {
    return epi_data.map((episode) => ({
      id: episode.number ?? null, // You can use number as ID if original ID not present
      number: episode.number ?? null,
      title: episode.title ?? "",
      img: episode.image ?? "",
      description: episode.description ?? "",
      isFiller: episode.isFiller ?? false,
    }));
  }

  return []; // Return empty array if no episodes found
};

function Info({ id }) {
  const router = useRouter();
  const TabsPara =
    " transition-all duration-300 ease-out hover:scale-[0.90] data-[state=active]:border-b-2 data-[state=active]:border-[#3888E7] rounded-gl px-4 py-2  font-medium text-gray-700 data-[state=active]:text-white";

  const [showMore, setShowMore] = useState(false);

  const {
    data: animeDetails,
    isLoading: isDetailsLoading,
    error: detailsError,
  } = useQuery({
    queryKey: ["animeDetails", id],
    queryFn: () => fetchAnimeDetails(id),
    enabled: !!id, // Only run query if id is available
  });

  const {
    data: processedEpisodes,
    isLoading: isEpisodesLoading,
    error: episodesError,
  } = useQuery({
    queryKey: ["animeEpisodes", id],
    queryFn: () => fetchAnimeEpisodes(id),
    enabled: !!id, // Only run query if id is available
  });

  const formattedText = animeDetails?.description || "";
  const shortText = formattedText.slice(0, 300); // adjust the limit as needed
  const animeType = animeDetails?.format; // "MOVIE" or "TV"
  /*if (isDetailsLoading || isEpisodesLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white text-xl">
        <div className="test">AniBox Loading...</div>
      </div>
    );
  }*/

  if (detailsError) {
    console.error("Error fetching anime details:", detailsError);
    // Optionally return an error component or message
    return (
      <div className="text-red-500 text-center">
        Error loading anime details.
      </div>
    );
  }

  if (episodesError) {
    console.error("Error fetching anime episodes:", episodesError);
    // Optionally return an error component or message for episodes
    // You might still want to render details if they loaded successfully
  }

  // Construct JSON-LD data
  let structuredDataObject = null;
  if (animeDetails && Object.keys(animeDetails).length > 0) {
    const schemaType = animeDetails.type === "MOVIE" ? "Movie" : "TVSeries";
    const name =
      animeDetails.title?.english || animeDetails.title?.romaji || "Untitled";
    const description = stripHtmlTags(animeDetails.description || "");
    const image = animeDetails.coverImage?.extraLarge;

    structuredDataObject = {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: name,
      description: description,
      image: image ? [image] : undefined,
      datePublished: formatDate(animeDetails.startDate),
      genre:
        animeDetails.genres && animeDetails.genres.length > 0
          ? animeDetails.genres
          : undefined,
    };

    if (schemaType === "TVSeries" && animeDetails.episodes) {
      structuredDataObject.numberOfEpisodes = animeDetails.episodes;
    }

    if (animeDetails.averageScore && animeDetails.averageScore > 0) {
      structuredDataObject.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: (animeDetails.averageScore / 10).toFixed(1),
        bestRating: "10",
      };
    }
  }

  return (
    <>
      {structuredDataObject && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataObject),
          }}
        />
      )}
      <div className=" bg-black">
        <div className="CoverPage">
          <div className="h-[210px] overflow-hidden absolute inset-0 z-0">
            {animeDetails?.bannerImage ||
            animeDetails?.coverImage?.extraLarge ? (
              <Image
                src={
                  animeDetails.bannerImage || animeDetails.coverImage.extraLarge
                }
                alt="Banner Image"
                layout="fill"
                objectFit="cover"
                className="opacity-60"
                priority
              />
            ) : (
              <Skeleton className="SkeletonCard w-full h-full " />
            )}

            <div className="Bannerbackground absolute" />
          </div>
        </div>
        <div className="BannerbackgroundShadow fixed z-20 top-0 h-[40px]  w-full" />

        {/* Back Arrow Button */}
        <div className="fixed transition-all duration-300 ease-out hover:scale-[0.90] top-4 left-4 z-20">
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
        <div className="fixed m-1 top-4 right-4 z-20 flex items-center space-x-3">
          <Image
            className="w-9 h-9 transition-all duration-300 ease-out hover:scale-[0.90] rounded-full border-gray-600 border-2"
            src={profile}
            alt="user photo"
            width={36}
            height={36}
          />
        </div>
        <div className="relative z-10 flex flex-row items-left  px-4 pt-24 space-y-6">
          {/* Cover Image */}
          <div className="rounded-xl mt-5 shadow-xl bg-black backdrop-blur-sm">
            {animeDetails?.coverImage?.extraLarge ? (
              <Image
                src={animeDetails.coverImage.extraLarge}
                alt="Cover Image"
                width={140}
                height={230}
                className="min-h-[23vh] min-w-[14vh] max-h-[23vh] max-w-[14vh] rounded-xl object-cover"
              />
            ) : (
              <Skeleton className="SkeletonCard min-h-[23vh] min-w-[14vh] max-h-[23vh] max-w-[14vh] rounded-xl " />
            )}
          </div>

          <div className="InfoContainerPage flex-col ml-1 mt-0 items-center justify-center">
            {/* Title & Rating */}
            <div className="text-left px-4">
              {animeDetails?.title?.romaji ? (
                <h1 className="text-2xl font-bold line-clamp-2 text-white drop-shadow-lg break-words max-w-[200px]">
                  {animeDetails.title.romaji}
                </h1>
              ) : (
                <Skeleton className="h-6 w-[200px] rounded" />
              )}
            </div>

            <div className="flex ml-3 mt-2 font-semibold items-left justify-start">
              <FaStar size={20} style={{ color: "yellow", padding: 1 }} />
              {animeDetails?.averageScore !== undefined &&
              animeDetails?.status ? (
                <>
                  <p className="text-md ml-1 self-center">
                    {animeDetails.averageScore / 10} |
                  </p>
                  <p
                    className={`ml-2 ${
                      animeDetails.status === "RELEASING"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {animeDetails.status}
                  </p>
                </>
              ) : (
                <Skeleton className="h-4 w-[100px] ml-2 rounded" />
              )}
            </div>

            <h1 className="flex ml-3 font-semibold items-left justify-start">
              <MdDateRange className="self-center mr-1" size={20} />
              {animeDetails?.startDate ? (
                `${animeDetails.startDate.year} / ${animeDetails.startDate.month} / ${animeDetails.startDate.day}`
              ) : (
                <Skeleton className="h-4 w-[120px] rounded" />
              )}
            </h1>

            <h1 className="CardGenres text-sm flex ml-3 items-left justify-start">
              {animeDetails?.genres?.length ? (
                animeDetails.genres.join(", ")
              ) : (
                <Skeleton className="h-4 w-[150px] rounded" />
              )}
            </h1>

            <h1 className="text-sm flex ml-3 font-semibold items-left justify-start">
              {animeDetails?.episodes !== undefined ? (
                `Episodes : ${animeDetails.episodes}`
              ) : (
                <Skeleton className="h-4 w-[100px] rounded" />
              )}
            </h1>
          </div>
        </div>
        <div className="m-2 w-auto flex flex-row gap-4 mt-2 items-center justify-center pt-5">
          <Tabs defaultValue="overview" className="w-full flex flex-col">
            <TabsList className="">
              <TabsTrigger value="overview" className={TabsPara}>
                Overview
              </TabsTrigger>

              <TabsTrigger value="Relations" className={TabsPara}>
                Relations
              </TabsTrigger>
              <TabsTrigger value="Characters" className={TabsPara}>
                Characters
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 mb-5">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>

                  <CardDescription className="font-small whitespace-pre-line">
                    {formattedText ? (
                      <>
                        <AnimatePresence initial={false} mode="wait">
                          <motion.div
                            key={showMore ? "expanded" : "collapsed"}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.35,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                            className="overflow-hidden"
                          >
                            {showMore
                              ? parse(formattedText)
                              : parse(
                                  shortText +
                                    (formattedText.length > 200 ? "..." : "")
                                )}
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
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-11/12 rounded" />
                        <Skeleton className="h-4 w-10/12 rounded" />
                        <Skeleton className="h-4 w-8/12 rounded" />
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h1 className="font-bold  mb-2 leading-none tracking-tight">
                    Details
                  </h1>

                  <ul className="flex flex-col gap-2 mt-4 ">
                    <li>
                      <strong className="text-white text-sm font-semibold">
                        Airing
                      </strong>{" "}
                      :{" "}
                      <span className="lighting-text text-sm font-semibold text-white">
                        {animeDetails?.nextAiringEpisode?.airingAt
                          ? new Date(
                              animeDetails.nextAiringEpisode.airingAt * 1000
                            ).toLocaleString()
                          : "FINISHED"}
                      </span>
                    </li>

                    <li>
                      <strong className="text-white text-sm font-semibold">
                        Type
                      </strong>{" "}
                      :{" "}
                      <span className="text-sm text-muted-foreground">
                        {animeDetails?.type || "Unknown"}
                      </span>
                    </li>

                    <li>
                      <strong className="text-white text-sm font-semibold">
                        Aired
                      </strong>{" "}
                      :{" "}
                      <span className="text-sm text-muted-foreground">
                        {animeDetails?.seasonYear || "N/A"}
                      </span>
                    </li>

                    <li>
                      <strong className="text-white text-sm font-semibold">
                        Season
                      </strong>{" "}
                      :{" "}
                      <span className="text-sm text-muted-foreground">
                        {animeDetails?.season || "Unknown"}
                      </span>
                    </li>

                    <li>
                      <strong className="text-white text-sm font-semibold">
                        Country
                      </strong>{" "}
                      :{" "}
                      <span className="text-sm text-muted-foreground">
                        {animeDetails?.countryOfOrigin || "Unknown"}
                      </span>
                    </li>

                    <li>
                      <strong className="text-white text-sm font-semibold">
                        Studios
                      </strong>{" "}
                      :{" "}
                      <span className="text-sm text-muted-foreground">
                        {animeDetails?.studios?.nodes?.length
                          ? animeDetails.studios.nodes
                              .map((studio) => studio.name)
                              .join(", ")
                          : "Unknown"}
                      </span>
                    </li>

                    <li>
                      <strong className="text-white text-sm font-semibold">
                        Source
                      </strong>{" "}
                      :{" "}
                      <span className="text-sm text-muted-foreground">
                        {animeDetails?.source || "Unknown"}
                      </span>
                    </li>

                    <li>
                      <strong className="text-white text-sm font-semibold">
                        Duration
                      </strong>{" "}
                      :{" "}
                      <span className="text-sm text-muted-foreground">
                        {animeDetails?.duration
                          ? `${animeDetails.duration} min`
                          : "N/A"}
                      </span>
                    </li>

                    <li>
                      <strong className="text-white text-sm font-semibold">
                        Popularity
                      </strong>{" "}
                      :{" "}
                      <span className="text-sm text-muted-foreground">
                        {animeDetails?.popularity || "N/A"}
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Relations" className="mt-4">
              <RecommendList
                geners="Chronology"
                data={animeDetails?.relations?.edges || []}
                param="font-semibold text-md"
                className="InfoListsForAni"
              />
            </TabsContent>
            <TabsContent value="Characters" className="mt-4">
              {animeDetails?.characters?.edges && (
                <Characters
                  className="InfoListsForAni"
                  characters={animeDetails.characters.edges}
                />
              )}
            </TabsContent>
            <div className="flex flex-col gap-2">
              <Episodes
                episodes={processedEpisodes}
                imgbackup={animeDetails?.coverImage?.extraLarge}
                anilistId={id}
                type={animeType === "MOVIE" ? "MOVIE" : "TV"} // default to TV
              />

              <RecommendList
                geners="Recommended"
                data={
                  animeDetails?.recommendations?.nodes?.map((rec) => ({
                    relationType: "RECOMMENDATION",
                    node: rec.mediaRecommendation,
                  })) || []
                }
                param="font-semibold text-md"
                className="InfoListsForAni"
              />
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default Info;

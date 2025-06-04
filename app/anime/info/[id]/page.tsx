import React from "react";
import { Metadata } from 'next';
import Info from "../../../../components/pages/InfoPages/Info";
import Navbar from "../../../../components/NavBar";
import { fetchAnimeInfo } from "../../../../actions/ApiData.js";

interface AnimeInfoParams {
  id: string;
}

// Function to strip HTML tags (basic implementation)
const stripHtmlTags = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

export async function generateMetadata({ params }: { params: AnimeInfoParams }): Promise<Metadata> {
  const id = params.id;

  try {
    const response = await fetch(`/api/anime-info?id=${id}`);           
    const data = await response.json();
    const media = data?.Media;
    //const data = await fetchAnimeInfo(id);

    if (!media) {
      return {
        title: "Anime Not Found - AniPlay",
        description: "The requested anime could not be found.",
      };
    }

    const title = media.title.english || media.title.romaji || "Untitled Anime";
    const pageTitle = `${title} - Details | AniPlay`;
    const description = stripHtmlTags(media.description || "No description available.");
    const imageUrl = media.coverImage.extraLarge || ""; // Default to empty string if no image

    return {
      title: pageTitle,
      description: description,
      openGraph: {
        title: pageTitle,
        description: description,
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching anime info for metadata:", error);
    return {
      title: "Error - AniPlay",
      description: "An error occurred while fetching anime details.",
    };
  }
}

export default async function AnimeInfoLayout({
  params,
}: {
  // The params prop is recognized by Next.js as a Promise in this context,
  // but the actual type passed to the page after resolution will be AnimeInfoParams.
  // However, generateMetadata expects params directly, not a Promise.
  // For the page component itself, if you are accessing `id` directly,
  // it's better to type `params` as `AnimeInfoParams` and handle the Promise resolution
  // if Next.js passes it as a Promise (which is typical for server components).
  // For this specific case, since `id` is extracted after `await params`,
  // the `params` type for the function argument can be `Promise<AnimeInfoParams>`.
  // But `generateMetadata` receives `params` directly as `{ id: string }`.
  params: AnimeInfoParams; // Corrected based on how generateMetadata receives it.
}) {
  // If Next.js actually passes `params` as a Promise to the page component:
  // const { id } = await params; // This line would be needed if params was Promise<AnimeInfoParams>
  // But since generateMetadata defines it as AnimeInfoParams, and for consistency,
  // we'll assume params is directly AnimeInfoParams here.
  // If you log `params` in this component and see it's a Promise, then `await` is needed.
  const id = params.id;


  return (
    <div>     
      <Info id={id} />   
      
    </div>
  );
}
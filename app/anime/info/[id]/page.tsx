import React from "react";
import { Metadata } from "next";
import Info from "../../../../components/pages/InfoPages/Info";

interface AnimeInfoParams {
  id: string;
}

const stripHtmlTags = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};

export async function generateMetadata({
  params,
}: {
  params: Promise<AnimeInfoParams>;
}): Promise<Metadata> {
  // ✅ params هو Promise → لازم await
  const { id } = await params;

  // ✅ base URL ضروري
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ani-box-nine.vercel.app";

  try {
    // fetch يحتاج absolute URL
    const response = await fetch(`${base}/api/anime-info?id=${id}`);
    const data = await response.json();
    const media = data?.Media;

    if (!media) {
      return {
        title: "Anime Not Found - AniBox",
        description: "The requested anime could not be found.",
      };
    }

    const title = media.title.english || media.title.romaji || "Untitled Anime";
    const pageTitle = `${title} | AniBox`;

    const rawDescription = stripHtmlTags(media.description || "");
    const description =
      rawDescription.length > 160
        ? rawDescription.substring(0, 160) + "..."
        : rawDescription;

    const imageUrl = media.coverImage?.extraLarge || "";

    return {
      metadataBase: new URL(base), // ❗ مهم جدا
      title: pageTitle,
      description,
      openGraph: {
        title: pageTitle,
        description,
        url: `${base}/anime/info/${id}`,
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (err) {
    console.error("Error fetching metadata:", err);
    return {
      title: "Error - AniBox",
      description: "Failed to load anime data.",
    };
  }
}

export default async function AnimeInfo({
  params,
}: {
  params: Promise<AnimeInfoParams>;
}) {
  // params هو Promise → لازم await
  const { id } = await params;

  return (
    <div>
      <Info id={id} />
    </div>
  );
}

import {
  seasonal,
  favouritesAnimeQuery,
  TrendingAnimeQuery,
  top100AnimeQuery,
  animeinfo,
} from "../actions/QueryActions";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";


const API_URL = "https://graphql.anilist.co";

// for Trending Anime
export const fetchTrendingAnime = async () => {
  try {
    const response = await fetchAniList({
      query: TrendingAnimeQuery,
    });
    return response.data || []; // Return data if present
  } catch (error) {
    console.error("Error fetching trending anime:", error);
    return []; // Fallback in case of failure
  }
};

//for Popular Anime
export const fetchPopularAnime = async () => {
  try {
    const response = await fetchAniList({
      query: seasonal,
    });
    return response.data || []; // Return data if present
  } catch (error) {
    console.error("Error fetching trending anime:", error);
    return []; // Fallback in case of failure
  }
};

// for 100 best Anime
export const fetchTopAnime = async () => {
  try {
    const response = await fetchAniList({
      query: top100AnimeQuery,
    });
    return response.data || []; // Return data if present
  } catch (error) {
    console.error("Error fetching trending anime:", error);
    return []; // Fallback in case of failure
  }
};
// for Favorite Anime list
export const fetchFavouritesAnime = async () => {
  try {
    const response = await fetchAniList({
      query: favouritesAnimeQuery,
    });
    return response.data || []; // Return data if present
  } catch (error) {
    console.error("Error fetching trending anime:", error);
    return []; // Fallback in case of failure
  }
};

// for  Anime info
export const fetchAnimeInfo = async (id) => {
  try {
    const response = await fetchAniList({
      query: animeinfo,
      variables: { id: parseInt(id) },
    });
    return response.data || []; // Return data if present
  } catch (error) {
    console.error("Error fetching anime info :", error);
    return []; // Fallback in case of failure
  }
};

//fetching func
const fetchAniList = async ({ query, variables = {} }) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      throw new Error("Failed to fetch GraphQL data");
    }

    return result;
  } catch (error) {
    console.error("Fetch AniList Error:", error);
    throw error;
  }
};

export const getEpisodeServers = async (animeName, epNumber) => {
  // make the anime name suitable for URL slug
  const nameSlug = animeName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const url = `https://animelek.live/episode/${nameSlug}-${epNumber}-الحلقة/`;

  try {
    const res = await fetch(url);
    const html = await res.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;

    // All servers inside watch tab
    const listItems = document.querySelectorAll(
      "#watch #episode-servers li a[data-ep-url]"
    );

    const servers = [];

    listItems.forEach((a) => {
      servers.push({
        serverName: a.textContent.trim(), // "mega HD"
        quality: a.querySelector("small")?.textContent || "",
        url: a.getAttribute("data-ep-url"), // iframe server link
      });
    });

    return servers;
  } catch (error) {
    console.error("Error fetching servers:", error);
    return [];
  }
}

import {
  seasonal,
  favouritesAnimeQuery,
  TrendingAnimeQuery,
  top100AnimeQuery,
  animeinfo,
} from "../actions/QueryActions";

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
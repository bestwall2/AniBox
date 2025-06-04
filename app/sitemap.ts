import { MetadataRoute } from 'next';
import { fetchPopularAnime } from '../actions/ApiData'; // Assuming this function fetches a list of anime with their IDs

// Define the base URL, ideally from an environment variable
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // Add other static routes here if any
    // e.g. { url: `${BASE_URL}/about`, lastModified: new Date().toISOString() }
  ];

  // Dynamic pages (anime details)
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const popularAnime = await fetchPopularAnime({ page: 1, perPage: 200 }); // Adjust params as needed, aim to get many/all

    // Check if popularAnime and popularAnime.results are available
    if (popularAnime && popularAnime.results && Array.isArray(popularAnime.results)) {
      dynamicRoutes = popularAnime.results.map((anime: any) => ({ // Add 'any' type for anime if its structure is not strictly defined here
        url: `${BASE_URL}/anime/info/${anime.id}`,
        lastModified: anime.updatedAt || new Date().toISOString(), // Use anime's updatedAt if available, otherwise current date
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    } else {
      console.warn('Sitemap: Could not fetch popular anime or results are not in expected format.');
    }
  } catch (error) {
    console.error('Sitemap: Error fetching anime list for sitemap:', error);
    // Optionally, return only static routes or an empty array if fetching dynamic routes fails critically
  }

  return [...staticRoutes, ...dynamicRoutes];
}

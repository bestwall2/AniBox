"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchSearch } from "@/actions/ApiData";
import DiscoverCard from "@/components/CardsComp/DiscoverCard";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

interface Anime {
  id: number;
  title: {
    english: string | null;
    romaji: string | null;
  };
  format: string;
  startDate: {
    year: number | null;
  };
  coverImage: {
    large: string;
  };
  averageScore: number | null;
  status: string;
}

const SearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setLoading(true);
      fetchSearch(initialQuery).then(({ data, error }) => {
        if (error) {
          setError(error);
        } else {
          setResults(data.Page.media);
        }
        setLoading(false);
      });
    } else {
      setLoading(false)
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="Geners flex text-white items-center mb-4 space-x-2">
          <span className="w-1.5 rounded-full h-6 bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)]"></span>
          <p className="font-bold text-2xl">Search</p>
        </div>
        <form onSubmit={handleSearch} className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anime..."
            className="w-full bg-gray-800 text-white rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </form>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((anime) => (
              <Link href={`/anime/info/${anime.id}`} key={anime.id}>
                <DiscoverCard
                  title={anime.title.english || anime.title.romaji || "No title"}
                  info={`${anime.format} • ${anime.startDate?.year || "Unknown Year"}`}
                  img={anime.coverImage.large}
                  cardbadge={anime.averageScore ? `${anime.averageScore / 10}` : "N/A"}
                  status={anime.status}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">No results found for "{initialQuery}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchPage = () => (
  <Suspense fallback={<div className="bg-black text-white min-h-screen flex justify-center items-center"><p>Loading...</p></div>}>
    <SearchResults />
  </Suspense>
);

export default SearchPage;

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchSearch } from "@/actions/ApiData";
import DiscoverCard from "@/components/CardsComp/DiscoverCard";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import Navbar from "@/components/NavBar";
import SearchCard from "@/components/CardsComp/SearchCard";

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

  // Fetch Data
  useEffect(() => {
    if (initialQuery) {
      setLoading(true);
      fetchSearch(initialQuery).then(({ data, error }) => {
        if (error) setError(error);
        else setResults(data.Page.media);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [initialQuery]);

  // Handle Search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen pb-10">
      {/* Space for Navbar */}
      {/* Navbar without search button */}
      <Navbar showSearch={false} />

      <div className="h-20 mt-4" />
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="flex items-center mb-6 space-x-2">
          
          {/* <span className="w-1.5 h-6 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-pink-500" /> */}
          <p className="text-2xl font-bold">Search</p>
        </div>

        {/* Search Input */}
        <form
          onSubmit={handleSearch}
          className="relative mb-10 max-w-2xl mx-auto"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anime..."
            className="
              w-full
              bg-[#13131a]
              text-white
              rounded-xl
              py-3 pl-12 pr-4
              border border-white/10
              focus:outline-none focus:ring-2 focus:ring-gray-500
              transition-all
            "
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </form>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl animate-pulse text-gray-300">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-400">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <>
            {/* Results grid */}
            <div className="relative pointer-events-auto">
              <div className="grid gap-y-4 gap-x-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {results.map((anime) => (
                  <Link href={`/anime/info/${anime.id}`} key={anime.id}>
                    <SearchCard
                      title={
                        anime.title.english || anime.title.romaji || "No title"
                      }
                      info={`${anime.format} • ${
                        anime.startDate?.year || "Unknown Year"
                      }`}
                      img={anime.coverImage.large}
                      cardbadge={
                        anime.averageScore
                          ? `${anime.averageScore / 10}`
                          : "N/A"
                      }
                      status={anime.status}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-400">
              No results found for "{initialQuery}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchPage = () => (
  <Suspense fallback={
    <div className="bg-black text-white min-h-screen flex justify-center items-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  }>
    <SearchResults />
  </Suspense>
);

export default SearchPage;

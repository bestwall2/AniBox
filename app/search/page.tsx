"use client";

import React, { useState, useEffect, Suspense } from "react";
import { fetchSearch } from "@/actions/ApiData";
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
    extraLarge: string;
  };
  averageScore: number | null;
  status: string;
}

const SearchResults = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trending, setTrending] = useState<Anime[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // 🔥  FETCH TRENDING ANIME ON PAGE LOAD
  useEffect(() => {
    fetch("/api/trending-anime")
      .then((res) => res.json())
      .then((data) => {
        setTrending(data?.Page?.media || []);
        setLoadingTrending(false);
      })
      .catch(() => {
        setLoadingTrending(false);
      });
  }, []);

  // 🔥 LIVE SEARCH WITH DEBOUNCE
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    const delay = setTimeout(() => {
      fetchSearch(query.trim()).then(({ data, error }) => {
        if (error) setError(error);
        else setResults(data.Page.media);
        setLoading(false);
      });
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="bg-black text-white min-h-screen pb-10">
      {/* Navbar */}
      <Navbar showSearch={false} hideOnScroll={false} />

      <div className="h-20 mt-4" />
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="flex items-center mb-[12px] space-x-2">
          <span className="w-1.5 rounded-full h-6 bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)]"></span>
          <p className="text-2xl font-bold">Search</p>
        </div>

        {/* Search Input */}
        <div className="relative mb-[15px] max-w-2xl mx-auto">
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
        </div>

        {/* Loading Search */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl animate-pulse text-gray-300">Searching...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-400">{error}</p>
          </div>
        ) : query.trim().length > 0 ? (
          results.length > 0 ? (
            <div className="grid gap-y-4 gap-x-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {results.map((anime) => (
                <Link href={`/anime/info/${anime.id}`} key={anime.id}>
                  <SearchCard
                    title={
                      anime.title.english ?? anime.title.romaji ?? "No title"
                    }
                    info={`${anime.format} • ${
                      anime.startDate?.year || "Unknown Year"
                    }`}
                    img={anime.coverImage.extraLarge}
                    cardbadge={
                      anime.averageScore ? anime.averageScore / 10 + "" : "N/A"
                    }
                    status={anime.status}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl text-gray-400">
                No results found for "{query}".
              </p>
            </div>
          )
        ) : (
          // ⭐ SHOW TRENDING WHEN NO SEARCH QUERY
          <>
            {loadingTrending ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Loading anime...</p>
              </div>
            ) : (
              <div className="grid gap-y-4 gap-x-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {trending.map((anime) => (
                  <Link href={`/anime/info/${anime.id}`} key={anime.id}>
                    <SearchCard
                      title={
                        anime.title.english ?? anime.title.romaji ?? "No title"
                      }
                      info={`${anime.format} • ${
                        anime.startDate?.year || "Unknown Year"
                      }`}
                      img={anime.coverImage.extraLarge}
                      cardbadge={
                        anime.averageScore
                          ? anime.averageScore / 10 + ""
                          : "N/A"
                      }
                      status={anime.status}
                    />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const SearchPage = () => (
  <Suspense
    fallback={
      <div className="bg-black text-white min-h-screen flex justify-center items-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    }
  >
    <SearchResults />
  </Suspense>
);

export default SearchPage;

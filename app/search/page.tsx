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
  // 🔄 Reload trending when search input is cleared
  useEffect(() => {
    if (query.trim().length === 0) {
      setLoadingTrending(true);
      fetch("/api/trending-anime")
        .then((res) => res.json())
        .then((data) => {
          setTrending(data?.Page?.media || []);
          setLoadingTrending(false);
        })
        .catch(() => {
          setLoadingTrending(false);
        });
    }
  }, [query]);

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
      {/* 🔹 Top Section with Rounded Bottom Only */}
      <div className="bg-[#0b0b0e] border rounded-b-2xl   p-[1rem]  pt-[4.5rem]">
        {/* Navbar */}
        <Navbar showSearch={false} hideOnScroll={false} />

        {/* Spacer */}

        <div className="mx-[-1rem] relative overflow-hidden rounded-t-2xl">
          {/* Top and bottom shadow overlays */}
          <div className="absolute top-0 left-0 w-full h-14 bg-gradient-to-b from-[#0b0b0e] to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0b0b0e] to-transparent pointer-events-none"></div>
          {/* Left shadow */}
          <div className="absolute top-0 left-0 h-full w-14 bg-gradient-to-r from-[#0b0b0e] to-transparent pointer-events-none"></div>
          {/* Right shadow */}
          <div className="absolute top-0 right-0 h-full w-14 bg-gradient-to-l from-[#0b0b0e] to-transparent pointer-events-none"></div>

          <img
            src="https://github.com/bestwall2/AniBox/blob/main/app/images/newShareSaveImage.jpg?raw=true"
            alt="HH"
            className="w-full object-cover rounded-t-2xl"
          />
        </div>

        {/* Title */}
        <div className="flex items-center mt-1 mb-4 space-x-2">
          <span className="w-1.5 h-6 rounded-full bg-[linear-gradient(135deg,_#3888E7,_#04DFFF,_#FE1491)]"></span>
          <p className="text-2xl font-bold">Search</p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anime..."
            className="
          w-full
          bg-[#161622]
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
      </div>

      {/* 🔹 Space between top section and list */}
      <div className="h-5 md:h-10"></div>

      {/* 🔹 Anime List / Search Results */}
      <div className="container mx-auto px-4">
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
        ) : loadingTrending ? (
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
                    anime.averageScore ? anime.averageScore / 10 + "" : "N/A"
                  }
                  status={anime.status}
                />
              </Link>
            ))}
          </div>
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

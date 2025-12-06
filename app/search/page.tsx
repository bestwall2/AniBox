"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchSearch } from "@/actions/ApiData";
// NOTE: The SearchCard component was created to match the new design provided by the user in a screenshot.
// This new design requirement superseded the initial request to reuse existing card components.
import SearchCard from "@/components/CardsComp/SearchCard";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

const SearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
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
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((anime: any) => (
              <Link href={`/anime/${anime.id}`} key={anime.id}>
                <SearchCard
                  title={anime.title.english || anime.title.romaji}
                  format={anime.format}
                  year={anime.startDate.year}
                  img={anime.coverImage.large}
                  rating={anime.averageScore}
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

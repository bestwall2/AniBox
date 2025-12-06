"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchSearch } from "@/actions/ApiData";
import DiscoverCard from "@/components/CardsComp/DiscoverCard";
import Link from "next/link";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      fetchSearch(query).then(({ data, error }) => {
        if (error) {
          setError(error);
        } else {
          setResults(data.Page.media);
        }
        setLoading(false);
      });
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Search Results for "{query}"</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {results.map((anime) => (
            <Link href={`/anime/${anime.id}`} key={anime.id}>
              <DiscoverCard
                title={anime.title.english || anime.title.romaji}
                info={`${anime.format} • ${anime.episodes || "N/A"} episodes`}
                img={anime.coverImage.large}
                cardbadge={anime.averageScore}
                status={anime.status}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">No results found.</p>
        </div>
      )}
    </div>
  );
};

const SearchPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SearchResults />
  </Suspense>
);

export default SearchPage;

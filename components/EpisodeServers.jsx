"use client";
import { useEffect, useState } from "react";

export default function EpisodeServers({ animeName, episodeNumber }) {
  const [servers, setServers] = useState([]);
  const [activeServer, setActiveServer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServers() {
      try {
        const res = await fetch(
          `/api/getServers?anime=${encodeURIComponent(
            animeName
          )}&ep=${episodeNumber}`
        );
        const data = await res.json();
        setServers(data);
      } catch (err) {
        console.error("Failed to load servers:", err);
      } finally {
        setLoading(false);
      }
    }

    loadServers();
  }, [animeName, episodeNumber]);

  return (
    <div className="p-4">
      {/* Title */}
      <h1 className="text-xl font-bold text-white mb-4">
        Servers for Episode {episodeNumber}
      </h1>

      {/* Loading State */}
      {loading && (
        <p className="text-gray-300 animate-pulse">Loading servers...</p>
      )}

      {/* Server Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 my-4">
        {servers.map((server, index) => (
          <button
            key={index}
            onClick={() => setActiveServer(server.url)}
            className={`p-3 rounded-xl border border-white/10 shadow-md transition 
              bg-[#1c1c1f] hover:bg-[#27272c] hover:shadow-lg text-white text-sm
              ${activeServer === server.url ? "ring-2 ring-blue-500" : ""}
            `}
          >
            <span className="font-semibold">{server.serverName}</span>
            {server.quality && (
              <span className="ml-2 text-blue-400">{server.quality}</span>
            )}
          </button>
        ))}
      </div>

      {/* Video Player */}
      {activeServer && (
        <div className="mt-6 bg-black p-3 rounded-xl shadow-lg">
          <iframe
            src={activeServer}
            allowFullScreen
            className="w-full h-[420px] rounded-lg border border-white/10"
          />
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";

export default function EpisodeServers({ animeName, episodeNumber }) {
  const [servers, setServers] = useState([]); // no type annotations
  const [activeServer, setActiveServer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServers() {
      try {
        const res = await fetch(
          `/api/ep-servers?anime=${encodeURIComponent(animeName)}&ep=${episodeNumber}`
        );
        const data = await res.json();

        if (data.servers && Array.isArray(data.servers)) {
          setServers(data.servers);
          setActiveServer(data.servers[0] || null); // optional: default to first server
        }
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
      <h1 className="text-xl font-bold text-white mb-4">
        Servers for Episode {episodeNumber}
      </h1>

      {loading && <p className="text-gray-300 animate-pulse">Loading servers...</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 my-4">
        {servers.map((url, index) => {
          const hostname = (() => {
            try {
              return new URL(url).hostname.replace("www.", "");
            } catch {
              return `Server ${index + 1}`;
            }
          })();

          return (
            <button
              key={index}
              onClick={() => setActiveServer(url)}
              className={`p-3 rounded-xl border border-white/10 shadow-md transition 
                bg-[#1c1c1f] hover:bg-[#27272c] hover:shadow-lg text-white text-sm
                ${activeServer === url ? "ring-2 ring-blue-500" : ""}
              `}
            >
              <span className="font-semibold">{hostname}</span>
            </button>
          );
        })}
      </div>

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

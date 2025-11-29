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
          `/api/ep-servers?anime=${encodeURIComponent(animeName)}&ep=${episodeNumber}`
        );
        const data = await res.json();

        if (data.servers && Array.isArray(data.servers)) {
          setServers(data.servers);
        }
      } catch (err) {
        console.error("Failed to load servers:", err);
      } finally {
        setLoading(false);
      }
    }

    loadServers();
  }, [animeName, episodeNumber]);

  // If a server is selected → show ONLY fullscreen iframe
  if (activeServer) {
    return (
      <iframe
        src={activeServer}
        allowFullScreen
        className="w-full h-screen border-0"
        style={{ display: "block" }}
      />
    );
  }

  return (
    <div className="p-4">
      {/* Loading */}
      {loading && <p className="text-gray-300 animate-pulse">Loading servers...</p>}

      {/* Server Buttons */}
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
              className="p-3 rounded-xl border border-white/10 bg-[#1c1c1f] text-white text-sm hover:bg-[#27272c]"
            >
              {hostname}
            </button>
          );
        })}
      </div>
    </div>
  );
}

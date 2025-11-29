"use client";
import { useEffect, useState } from "react";

export default function EpisodeServers({ animeName, episodeNumber, onSelect }) {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(false); // Hide buttons after click

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

  if (selected) return null; // hide selector after choosing

  return (
    <div className="p-4">
      {loading && (
        <p className="text-gray-300 animate-pulse">Loading servers...</p>
      )}

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
              onClick={() => {
                onSelect(url);  // send URL to parent
                setSelected(true); // hide server buttons
              }}
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

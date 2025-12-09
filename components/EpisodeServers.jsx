"use client";

import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function EpisodeServers({ animeName, episodeNumber }) {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUrl, setSelectedUrl] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);

  useEffect(() => {
    async function loadServers() {
      try {
        const res = await fetch(
          `/api/ep-servers?anime=${encodeURIComponent(animeName)}&ep=${episodeNumber}`
        );

        const data = await res.json();
        setServers(data.servers || []);

        /** AUTO-SELECT FIRST SERVER */
        if (data.servers?.length > 0) {
          setSelectedServer(data.servers[0].name);
          setSelectedUrl(data.servers[0].url);
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
    <div className="w-full h-full flex flex-col gap-5">

     
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* ░░░ FLOATING DROPDOWN OVER IFRAME ░░░ */}
          {selectedUrl && (
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10">

              {/* Floating dropdown */}
              <div className="absolute top-3 right-3 z-50">
                <select
                  value={selectedServer}
                  onChange={(e) => {
                    const server = servers.find((s) => s.name === e.target.value);
                    setSelectedServer(server.name);
                    setSelectedUrl(server.url);
                  }}
                  className="px-1 py-2 bg-[#111] text-white rounded-md border border-gray-500 text-xs backdrop-blur-md"
                > 
                  {servers.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Video Iframe */}
              <iframe
                src={selectedUrl}
                className="w-full h-full"
                allowFullScreen
                frameBorder="0"
                referrerPolicy="origin"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

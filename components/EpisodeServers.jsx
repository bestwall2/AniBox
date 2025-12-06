"use client";

import { useEffect, useState } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { FaPlay } from "react-icons/fa";

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

      <h2 className="text-white text-lg font-semibold">Arabic Sub Servers</h2>

      {/* ░░░ Loading skeleton ░░░ */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* ░░░ Server Buttons ░░░ */}
          <ToggleGroup.Root
            type="single"
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            value={selectedServer}
            onValueChange={(value) => {
              if (value) {
                const server = servers.find((s) => s.name === value);
                setSelectedUrl(server.url);
                setSelectedServer(value);
              }
            }}
          >
            {servers.map((server) => (
              <ToggleGroup.Item
                key={server.name}
                value={server.name}
                className={`
                  p-3 rounded-xl border border-white/10
                  text-white bg-[#1c1c1f]
                  transition-all flex items-center justify-center gap-2
                  hover:bg-[#27272c]
                  radix-state-on:bg-white/20
                  radix-state-on:border-white/20
                  radix-state-on:scale-[0.98]
                `}
              >
                <FaPlay className="text-white text-sm" />
                <span>
                  {server.name.charAt(0).toUpperCase() + server.name.slice(1)}
                </span>
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>

          {/* ░░░ Inline Video Player (No Dialog) ░░░ */}
          {selectedUrl && (
            <div className="w-full h-[70vh] rounded-xl overflow-hidden border border-white/10">
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

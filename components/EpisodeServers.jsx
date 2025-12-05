"use client";

import { useEffect, useState } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import * as Dialog from "@radix-ui/react-dialog";
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
          {/* ░░░ Server Select Buttons ░░░ */}
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

          {/* ░░░ Player Dialog ░░░ */}
          <Dialog.Root open={!!selectedUrl} onOpenChange={() => setSelectedUrl(null)}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

              <Dialog.Content
                className="
                  fixed top-1/2 left-1/2 
                  -translate-x-1/2 -translate-y-1/2 
                  w-[90%] max-w-4xl h-[80vh]
                  bg-black/90 border border-white/10 rounded-xl
                  shadow-xl animate-fadeIn
                  flex flex-col
                "
              >
                <Dialog.Close className="absolute top-3 right-3 text-white text-xl">
                  ✕
                </Dialog.Close>

                {selectedUrl && (
                  <iframe
                    src={selectedUrl}
                    className="w-full h-full rounded-b-xl"
                    allowFullScreen
                    frameBorder="0"
                    referrerPolicy="origin"
                  />
                )}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </>
      )}
    </div>
  );
}

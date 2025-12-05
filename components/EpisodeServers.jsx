"use client";
import { useEffect, useState } from "react";

export default function EpisodeServers({ animeName, episodeNumber, malId }) {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  // When user selects a server → show iframe
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [sername, setSername] = useState(null);

  useEffect(() => {
    async function loadServers() {
      try {
        const res = await fetch(
          `/api/ep-servers?anime=${encodeURIComponent(animeName)}&ep=${episodeNumber}&malId=${malId}`
        );

        const data = await res.json();
        setServers(data.servers || []);
        setSername(data.servers?.map(server => server.name) || []);
      } catch (err) {
        console.error("Failed to load servers:", err);
      } finally {
        setLoading(false);
      }
    }

    loadServers();
  }, [animeName, episodeNumber]);

  // 👉 If a server is chosen → show full iframe (fills parent's height)
  if (selectedUrl) {
    return (
      <iframe
        src={selectedUrl}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        referrerPolicy="origin"
      />
    );
  }

  if (loading) {
    return <p className="text-gray-300 animate-pulse">Loading servers...</p>;
  }

  return (
    <div className="w-full h-full p-0 m-0 flex flex-col gap-4 bg-transparent">

      <h2 className="text-white text-lg font-semibold">Arabic Sub Servers</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {servers.map((server, index) => (
          <button
            key={index}
            onClick={() => setSelectedUrl(server.url)}
            className="p-3 rounded-xl border border-white/10
                       bg-[#1c1c1f] text-white hover:bg-[#27272c]"
          >
            {server.name.charAt(0).toUpperCase() + server.name.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

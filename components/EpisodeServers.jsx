"use client";
import { useState } from "react";

export default function ServerPlayer({ servers }) {
  const [selectedUrl, setSelectedUrl] = useState("");

  const handleSelect = (url) => {
    setSelectedUrl(url);
  };

  const handleBack = () => {
    setSelectedUrl("");
  };

  // Extract domain as clean server name
  const getDomainName = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace("www.", "");
    } catch {
      return "Unknown Server";
    }
  };

  return (
    <div className="w-full">
      {selectedUrl ? (
        <div className="w-full">
          <button
            onClick={handleBack}
            className="mb-3 w-full py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700 transition"
          >
            ⬅️ Back to Servers
          </button>

          <div className="w-full h-[75vh] bg-black">
            <iframe
              src={selectedUrl}
              allowFullScreen
              className="w-full h-full border-0 p-0 m-0"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          {servers.map((server, index) => {
            const serverName = getDomainName(server.url);
            return (
              <button
                key={index}
                onClick={() => handleSelect(server.url)}
                className="w-full py-4 rounded-xl bg-[#0f0f10] text-white text-lg font-medium border border-white/10 hover:border-white/30 hover:bg-[#1a1a1c] transition shadow-lg"
              >
                {serverName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import VideoPlayer from "../../components/Player/VideoPlayer";
// import "plyr/dist/plyr.css"; // Removed

type Caption = {
  label: string;
  srcLang: string;
  src: string;
  default?: boolean;
};

type IntroOutro = {
  start: number;
  end: number;
};

export default function TestPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [intro, setIntro] = useState<IntroOutro | null>(null);
  const [outro, setOutro] = useState<IntroOutro | null>(null);

  const requestBody = {
    id: "178680",
    host: "pahe",
    slug: "69177-6075",
    ep: "1",
    type: "sub",
  };

  useEffect(() => {
    fetch("https://ani-box-nine.vercel.app/api/anime-source", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length < 2) {
          console.error("Unexpected response structure:", data);
          return;
        }

        const payload = data[1];

        const source = payload.sources?.[0]?.url;
        if (source) setVideoSrc(source);

        if (Array.isArray(payload.subtitles)) {
          const mappedSubs = payload.subtitles.map((sub: any, i: number) => ({
            label: sub.lang || "Unknown",
            srclang: (sub.lang || "en").toLowerCase(), // Changed srcLang to srclang
            src: sub.url,
            default: i === 0,
          }));
          setCaptions(mappedSubs);
        }

        if (payload.intro) setIntro(payload.intro);
        if (payload.outro) setOutro(payload.outro);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  const handleEpisodesClick = () => {
    alert("Episodes button clicked! Open episode list here.");
  };

  if (!videoSrc) return <div>Loading video...</div>;

  return (
    <div style={{ padding: 10 }}>
      <h1>Plyr React Video Player Demo</h1>
      <VideoPlayer
        source={videoSrc}
        subtitles={captions}
        intro={intro}
        outro={outro}
        onEpisodesClick={handleEpisodesClick}
        plyrOptions={{ seekTime: 10 }}
        width={720}
      />
    </div>
  );
}
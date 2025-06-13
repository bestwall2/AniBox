'use client';

import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import 'plyr-react/plyr.css';

const Plyr = dynamic(() => import('plyr-react'), { ssr: false });

interface SubtitleTrack {
  kind: string;
  label: string;
  src: string;
  srcLang: string;
  default?: boolean;
}

interface VideoPlayerProps {
  title?: string;
  src: string;
  type?: string;
  poster?: string;
  autoplay?: boolean;
  ratio?: string;
  controls?: string[];
  subtitles?: SubtitleTrack[];
  customButtons?: ReactNode;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title = 'Untitled Video',
  src,
  type = 'video/mp4',
  poster,
  autoplay = false,
  ratio = '16:9',
  controls = [
    'play',
    'progress',
    'current-time',
    'mute',
    'volume',
    'settings',
    'fullscreen',
  ],
  subtitles = [],
  customButtons,
}) => {
  const source = {
    type: 'video',
    title,
    sources: [
      {
        src,
        type,
      },
    ],
    poster,
    tracks: subtitles,
  };

  const options = {
    controls,
    ratio,
    autoplay,
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg max-w-full">
      {/* Video Player */}
      <Plyr source={source} options={options} />

      {/* Custom Buttons Overlay */}
      {customButtons && (
        <div className="absolute bottom-4 right-4 z-10 space-x-2">
          {customButtons}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
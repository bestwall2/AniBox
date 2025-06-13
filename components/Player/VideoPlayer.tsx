import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

type Subtitle = {
  label: string;
  kind?: string;
  src: string;
  srclang: string;
  default?: boolean;
};

type VideoPlayerProps = {
  source: string;
  subtitles?: Subtitle[];
  intro?: string | null;
  outro?: string | null;
  onEpisodesClick?: () => void;
  plyrOptions?: Record<string, any>; // مثال: { seekTime: 10 }
  width?: string | number;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  source,
  subtitles = [],
  intro,
  outro,
  onEpisodesClick,
  plyrOptions,
  width = "100%",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // دعم HLS عبر hls.js إذا كان المصدر m3u8 ومتصفح لا يدعمه
    if (source.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      }
    } else {
      video.src = source;
    }
  }, [source]);

  return (
    <div style={{ maxWidth: width }}>
      {intro && <div className="video-intro">{intro}</div>}

      <video
        ref={videoRef}
        className="main-video"
        controls
        preload="metadata"
        style={{ width: "100%", height: "auto" }}
        {...plyrOptions} // تمرير خيارات إضافية (يمكن تعديل حسب الحاجة)
      >
        {subtitles.map(({ label, kind = "subtitles", src, srclang, default: def }, i) => (
          <track
            key={i}
            label={label}
            kind={kind}
            src={src}
            srclang={srclang}
            default={def}
          />
        ))}
        متصفحك لا يدعم عرض الفيديو
      </video>

      {outro && <div className="video-outro">{outro}</div>}

      {onEpisodesClick && (
        <button onClick={onEpisodesClick} style={{ marginTop: 10 }}>
          Episodes
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
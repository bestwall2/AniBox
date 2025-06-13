import React, { useEffect, useRef } from 'react';
import 'plyr/dist/plyr.css';
import Hls from 'hls.js';

const VideoPlayer = ({
  videoSrc,
  captions = [],
  controls = [
    'play-large',
    'rewind',
    'fast-forward',
    'play',
    'progress',
    'current-time',
    'duration',
    'mute',
    'volume',
    'captions',
    'settings',
    'fullscreen',
  ],
  onEpisodesClick,
  plyrOptions = {},
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    let Plyr;

    async function setupPlayer() {
      Plyr = (await import('plyr')).default;

      if (!videoRef.current) return;

      const video = videoRef.current;

      // Clean up previous instance
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      // Handle HLS (.m3u8)
      if (Hls.isSupported() && videoSrc.endsWith('.m3u8')) {
        const hls = new Hls();
        hlsRef.current = hls;

        hls.loadSource(videoSrc);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          playerRef.current = new Plyr(video, {
            controls,
            captions: {
              active: true,
              update: true,
              language: captions.find(c => c.default)?.srcLang || 'en',
            },
            ...plyrOptions,
          });
          setupEpisodesButton();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS.js error:', data);
        });
      } else {
        playerRef.current = new Plyr(video, {
          controls,
          captions: {
            active: true,
            update: true,
            language: captions.find(c => c.default)?.srcLang || 'en',
          },
          ...plyrOptions,
        });
        setupEpisodesButton();
      }
    }

    function setupEpisodesButton() {
      playerRef.current.on('ready', () => {
        const controlsElem = document.querySelector('.plyr__controls');
        if (!controlsElem) return;

        const captionsBtn = controlsElem.querySelector('[data-plyr="captions"]');
        if (!captionsBtn || controlsElem.querySelector('[data-plyr="episodes"]')) return;

        const episodesBtn = document.createElement('button');
        episodesBtn.className = 'plyr__control';
        episodesBtn.setAttribute('type', 'button');
        episodesBtn.setAttribute('aria-label', 'Episodes');
        episodesBtn.setAttribute('data-plyr', 'episodes');
        episodesBtn.style.cursor = 'pointer';
        episodesBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1" ry="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1" ry="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1" ry="1"/>
          </svg>
        `;
        episodesBtn.addEventListener('click', () => {
          if (typeof onEpisodesClick === 'function') {
            onEpisodesClick();
          } else {
            alert('Episodes button clicked!');
          }
        });

        captionsBtn.insertAdjacentElement('afterend', episodesBtn);
      });
    }

    setupPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoSrc, captions, controls, onEpisodesClick, plyrOptions]);

  return (
    <div className="container" style={{ maxWidth: '720px', margin: 'auto' }}>
      <video
        ref={videoRef}
        controls
        crossOrigin="anonymous"
        playsInline
        style={{ width: '100%' }}
      >
        {videoSrc.endsWith('.mp4') && (
          <source src={videoSrc} type="video/mp4" />
        )}
        {captions.map(({ label, srcLang, src, default: isDefault }, i) => (
          <track
            key={i}
            kind="captions"
            label={label}
            srcLang={srcLang}
            src={src}
            default={isDefault}
          />
        ))}
      </video>
    </div>
  );
};

export default VideoPlayer;
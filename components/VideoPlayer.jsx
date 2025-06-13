import React, { useEffect, useRef } from 'react';
import 'plyr/dist/plyr.css';

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

  useEffect(() => {
    let Plyr;

    async function setupPlayer() {
      // Dynamically import Plyr only in client-side
      Plyr = (await import('plyr')).default;

      if (!videoRef.current) return;

      playerRef.current = new Plyr(videoRef.current, {
        controls,
        captions: {
          active: true,
          update: true,
          language: captions.find(c => c.default)?.srcLang || 'en',
        },
        ...plyrOptions,
      });

      playerRef.current.on('ready', () => {
        const controlsElem = document.querySelector('.plyr__controls');
        if (!controlsElem) return;

        const captionsBtn = controlsElem.querySelector('[data-plyr="captions"]');
        if (!captionsBtn) return;

        // Avoid duplicate episodes button
        if (controlsElem.querySelector('[data-plyr="episodes"]')) return;

        const episodesBtn = document.createElement('button');
        episodesBtn.className = 'plyr__control';
        episodesBtn.setAttribute('type', 'button');
        episodesBtn.setAttribute('aria-label', 'Episodes');
        episodesBtn.setAttribute('data-plyr', 'episodes');
        episodesBtn.style.cursor = 'pointer';

        episodesBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
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
        <source src={videoSrc} type="video/mp4" />
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
        <a href={videoSrc} download>
          Download video
        </a>
      </video>
    </div>
  );
};

export default VideoPlayer;
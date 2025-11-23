import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import PlayerControls from "./PlayerControls"; // Import the new component

type Subtitle = {
  label: string;
  kind?: string;
  src: string;
  srclang: string;
  default?: boolean;
};

type IntroOutro = {
  start: number;
  end: number;
};

type VideoPlayerProps = {
  source: string;
  subtitles?: Subtitle[];
  intro?: IntroOutro | null;
  outro?: IntroOutro | null;
  onEpisodesClick?: () => void;
  plyrOptions?: Record<string, any> & { seekTime?: number }; // Added seekTime to plyrOptions
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
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  // controlsRef might still be needed if loader, caption_text etc. are not in PlayerControls
  // For now, let's assume PlayerControls will render these or they are handled differently.

  // Refs that are still managed by VideoPlayer (e.g., for direct video events or parts of UI not in PlayerControls)
  const loaderRef = useRef<HTMLDivElement>(null); // Assuming loader is not in PlayerControls
  const captionTextRef = useRef<HTMLParagraphElement | null>(null); // Assuming caption_text is not in PlayerControls
  const qualityUlRef = useRef<HTMLUListElement | null>(null); // Still needed for HLS quality population
  // Most other control-specific refs (playPauseBtnRef, etc.) are removed as PlayerControls will handle its own internal elements.

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const [activeSettingsMenu, setActiveSettingsMenu] = useState<'home' | 'speed' | 'quality'>('home');
  const [isCaptionsActive, setIsCaptionsActive] = useState(false);
  const [currentCaptionTrackLabel, setCurrentCaptionTrackLabel] = useState<string>("OFF");
  const [isAutoplayActive, setIsAutoplayActive] = useState(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);

  const playerSeekTime = plyrOptions?.seekTime || 10; // Extract seekTime or default to 10
  // ... (add more state variables as needed) ...

  // This useEffect was for initializing refs from the injected HTML.
  // It's largely replaced by PlayerControls managing its own elements.
  // However, we still need to initialize qualityUlRef for HLS, loaderRef, and captionTextRef
  // if they remain in VideoPlayer's direct render path or are part of a minimal injected HTML.
  // For now, let's assume video_player_html is no longer injected here for controls.
  // We will need a way to get qualityUlRef if it's inside PlayerControls, or VideoPlayer passes quality items.
  // The current PlayerControls.tsx has qualityUlRef internal. VideoPlayer.tsx populates it.
  // This interaction needs to be clean.
  // Let's assume for now qualityUlRef will be passed as a prop to PlayerControls, or handled via a callback.
  // For simplicity in this step, we'll keep qualityUlRef here and assume it's found after PlayerControls mounts.
  // This is a temporary measure for the diff.

  useEffect(() => {
    // If PlayerControls creates the .settings and .quality ul, VideoPlayer needs a way to access qualityUlRef.
    // This might involve passing a ref-setting function as a prop to PlayerControls.
    // Or, VideoPlayer can continue to create the quality list itself and pass it as data.
    // The HLS quality population logic is still here.
    const pc = document.querySelector(".video_player"); // A bit of a hack to find PlayerControls rendered elements
    if (pc) { // This is not ideal, direct refs or context would be better
        loaderRef.current = pc.querySelector(".loader");
        captionTextRef.current = pc.querySelector(".caption_text");
        // This is problematic: qualityUlRef is inside PlayerControls's shadow DOM (conceptually)
        // qualityUlRef.current = pc.querySelector("[data-label='quality'] ul");
    }
    // The above querying is fragile. It's better if PlayerControls exposes these elements via refs passed as props,
    // or if VideoPlayer creates these elements itself and PlayerControls positions them.
    // For now, the HLS quality population will likely break until this is resolved.
    // Let's assume loaderRef and captionTextRef are found if they are rendered by VideoPlayer directly.

  }, []);


  // HLS instance ref
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = mainVideoRef.current;
    if (!video) return;

    if (source.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hlsInstance = new Hls();
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsRef.current = hlsInstance; // Store HLS instance

        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          if (qualityUlRef.current && hlsRef.current) {
            const levels = hlsRef.current.levels;
            qualityUlRef.current.innerHTML = ""; // Clear existing

            // Add "auto" option
            const autoLi = document.createElement('li');
            autoLi.textContent = 'Auto';
            autoLi.dataset.quality = 'auto';
            autoLi.classList.add('active'); // Auto is active by default
            autoLi.onclick = () => handleQualityChangeHLS(-1); // -1 for auto
            qualityUlRef.current.appendChild(autoLi);

            levels.forEach((level, index) => {
              const qualityLi = document.createElement('li');
              qualityLi.textContent = `${level.height}p`;
              qualityLi.dataset.quality = String(index);
              qualityLi.onclick = () => handleQualityChangeHLS(index);
              qualityUlRef.current?.appendChild(qualityLi);
            });
          }
        });

        return () => {
          hlsInstance.destroy();
          hlsRef.current = null;
        };
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      }
    } else {
      // For non-HLS sources, populate quality from <source> tags if available
      // This part might need adjustment based on how non-HLS qualities are provided
      const sourceElements = video.querySelectorAll("source[size]");
      if (qualityUlRef.current && sourceElements.length > 0) {
        qualityUlRef.current.innerHTML = ""; // Clear existing
         const autoLi = document.createElement('li');
         autoLi.textContent = 'Auto'; // Or the current source's resolution
         autoLi.dataset.quality = 'auto';
         autoLi.classList.add('active');
         autoLi.onclick = () => handleQualityChangeNonHLS('auto', source); // 'auto' might just be the initial src
         qualityUlRef.current.appendChild(autoLi);

        sourceElements.forEach(sourceEl => {
          const size = sourceEl.getAttribute("size");
          const src = sourceEl.getAttribute("src");
          if (size && src) {
            const qualityLi = document.createElement('li');
            qualityLi.textContent = `${size}p`;
            qualityLi.dataset.quality = size;
            qualityLi.dataset.src = src;
            qualityLi.onclick = () => handleQualityChangeNonHLS(size, src);
            qualityUlRef.current?.appendChild(qualityLi);
          }
        });
      }
      video.src = source; // Default source
    }
  }, [source]); // Re-run when source changes

  // Helper to format time (e.g., 0:00)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Event Handlers (Corrected: Removed duplicate simpler handlers)
  const handlePlayPause = () => {
    if (mainVideoRef.current) {
      if (isPlaying) {
        mainVideoRef.current.pause();
      } else {
        mainVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event?: React.ChangeEvent<HTMLInputElement>) => {
    if (mainVideoRef.current && volumeRangeRef.current) {
      const newVolume = event ? parseFloat(event.target.value) / 100 : parseFloat(volumeRangeRef.current.value) / 100;
      mainVideoRef.current.volume = newVolume;
      setCurrentVolume(newVolume);

      if (volumeBtnRef.current) {
        if (newVolume === 0) {
          volumeBtnRef.current.innerHTML = "volume_off";
        } else if (newVolume < 0.4) {
          volumeBtnRef.current.innerHTML = "volume_down";
        } else {
          volumeBtnRef.current.innerHTML = "volume_up";
        }
      }
    }
  };

  const handleMuteToggle = () => {
    if (mainVideoRef.current && volumeRangeRef.current && volumeBtnRef.current) {
      if (mainVideoRef.current.volume > 0) {
        mainVideoRef.current.volume = 0;
        volumeRangeRef.current.value = "0";
        volumeBtnRef.current.innerHTML = "volume_off";
        setCurrentVolume(0);
      } else {
        const previousVolume = currentVolume > 0 ? currentVolume : 0.8; // Default to 0.8 if unmuted from 0
        mainVideoRef.current.volume = previousVolume;
        volumeRangeRef.current.value = String(previousVolume * 100);
        volumeBtnRef.current.innerHTML = previousVolume < 0.4 ? "volume_down" : "volume_up";
        setCurrentVolume(previousVolume);
      }
    }
  };

  const handleFastRewind = () => {
    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime -= playerSeekTime;
    }
  };

  const handleFastForward = () => {
    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime += playerSeekTime;
    }
  };

  const handleTimelineUpdate = (e: PointerEvent | React.PointerEvent<HTMLDivElement>) => {
    if (!mainVideoRef.current || !progressAreaRef.current || !duration) return;

    const clientX = (e as React.PointerEvent<HTMLDivElement>).clientX || (e as PointerEvent).clientX;
    const rect = progressAreaRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const progressWidthVal = progressAreaRef.current.clientWidth;
    let newTime = (offsetX / progressWidthVal) * duration;
    newTime = Math.max(0, Math.min(newTime, duration));
    mainVideoRef.current.currentTime = newTime;

    if (currentTimeRef.current) {
      currentTimeRef.current.textContent = formatTime(newTime);
    }
    if (progressBarRef.current) {
      const progressPercent = (newTime / duration) * 100;
      progressBarRef.current.style.width = `${progressPercent}%`;
    }
  };

  const handlePointerDownOnProgress = (e: PointerEvent | React.PointerEvent<HTMLDivElement>) => {
    if (progressAreaRef.current && mainVideoRef.current && duration > 0) {
      setIsDraggingProgress(true);
      if ((e as PointerEvent).pointerId && progressAreaRef.current.setPointerCapture) {
         progressAreaRef.current.setPointerCapture((e as PointerEvent).pointerId);
      }
      handleTimelineUpdate(e);
    }
  };

  const handlePointerMoveOnProgress = (e: PointerEvent | React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingProgress && mainVideoRef.current && duration > 0) {
      handleTimelineUpdate(e);
    }
  };

  const handlePointerUpOnProgress = (e: PointerEvent | React.PointerEvent<HTMLDivElement>) => {
    if (progressAreaRef.current && isDraggingProgress) {
       if ((e as PointerEvent).pointerId && progressAreaRef.current.releasePointerCapture) {
        progressAreaRef.current.releasePointerCapture((e as PointerEvent).pointerId);
      }
      setIsDraggingProgress(false);
      if (mainVideoRef.current) setCurrentTime(mainVideoRef.current.currentTime);
    }
  };

  const handleToggleSettings = () => {
    if (isCaptionsActive) setIsCaptionsActive(false);
    setIsSettingsActive(!isSettingsActive);
    // Reset to home menu when closing, or if already active and clicked again to toggle off
    if (isSettingsActive || !isSettingsActive) {
        setActiveSettingsMenu('home');
    }
  };

  const handleSettingsNavigation = (menu: 'home' | 'speed' | 'quality') => {
    setActiveSettingsMenu(menu);
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    if (mainVideoRef.current) {
      mainVideoRef.current.playbackRate = speed;
      if (playbackSpeedBtnsRef.current) {
        playbackSpeedBtnsRef.current.forEach(btn => {
          btn.classList.remove("active");
          if (parseFloat(btn.dataset.speed || "0") === speed) {
            btn.classList.add("active");
          }
        });
      }
      // Optionally, navigate back to home or close settings after selection
      // setActiveSettingsMenu('home');
    }
  };

  const handleQualityChangeHLS = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex; // -1 for auto, or specific index
      // Update UI to show active quality
      if (qualityUlRef.current) {
        qualityUlRef.current.querySelectorAll('li').forEach(li => {
          li.classList.remove('active');
          if (li.dataset.quality === (levelIndex === -1 ? 'auto' : String(levelIndex))) {
            li.classList.add('active');
          }
        });
      }
    }
    setActiveSettingsMenu('home');
  };

  const handleQualityChangeNonHLS = (quality: string, newSource: string) => {
    if(mainVideoRef.current) {
        const currentTimeValue = mainVideoRef.current.currentTime;
        const isPaused = mainVideoRef.current.paused;
        mainVideoRef.current.src = newSource;
        mainVideoRef.current.load();
        mainVideoRef.current.onloadeddata = () => {
            if(mainVideoRef.current) mainVideoRef.current.currentTime = currentTimeValue;
            if(!isPaused && mainVideoRef.current) mainVideoRef.current.play();
        };

        if (qualityUlRef.current) {
            qualityUlRef.current.querySelectorAll('li').forEach(li => {
                li.classList.remove('active');
                if (li.dataset.quality === quality) {
                    li.classList.add('active');
                }
            });
        }
    }
    setActiveSettingsMenu('home');
  };

  // Removed duplicate handleToggleCaptions and handleChangeCaptionTrack, the ones below are more complete.

  const handleToggleCaptions = () => {
    if (isSettingsActive) setIsSettingsActive(false);
    setIsCaptionsActive(!isCaptionsActive);
  };

  const handleChangeCaptionTrack = (trackLabel: string) => {
    setCurrentCaptionTrackLabel(trackLabel);
    // Actual track mode switching and cue display will be handled by another useEffect
    if (captionTextRef.current && trackLabel === "OFF") {
        captionTextRef.current.innerHTML = "";
    }
  };

  const handleToggleAutoplay = () => {
    setIsAutoplayActive(!isAutoplayActive);
  };

  const handleTogglePictureInPicture = () => {
    if (mainVideoRef.current) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        mainVideoRef.current.requestPictureInPicture().catch(error => {
          console.error("Error entering Picture-in-Picture mode:", error);
        });
      }
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleLoadedData = () => {
    if (mainVideoRef.current) {
      setDuration(mainVideoRef.current.duration);
      if (totalDurationRef.current) {
        totalDurationRef.current.textContent = formatTime(mainVideoRef.current.duration);
      }
      // Set initial volume
      mainVideoRef.current.volume = currentVolume;
      if(volumeRangeRef.current) {
        volumeRangeRef.current.value = String(currentVolume * 100);
      }
      handleVolumeChange(); // Update volume icon
    }
  };

  const handleTimeUpdate = () => {
    if (mainVideoRef.current) {
      setCurrentTime(mainVideoRef.current.currentTime);
      if (currentTimeRef.current) {
        currentTimeRef.current.textContent = formatTime(mainVideoRef.current.currentTime);
      }
      if (progressBarRef.current && mainVideoRef.current.duration) {
        const progressPercent = (mainVideoRef.current.currentTime / mainVideoRef.current.duration) * 100;
        progressBarRef.current.style.width = `${progressPercent}%`;
      }
    }
  };

  // Effect for managing settings menu display and sub-menu navigation
  useEffect(() => {
    if (!settingsContainerRef.current || !settingsBtnRef.current) return;

    if (isSettingsActive) {
      settingsContainerRef.current.classList.add("active");
      settingsBtnRef.current.classList.add("active");
      if (captionsContainerRef.current?.classList.contains("active")) {
        captionsContainerRef.current.classList.remove("active");
        captionsBtnRef.current?.classList.remove("active");
        setIsCaptionsActive(false);
      }

      const allSubMenus = settingsContainerRef.current.querySelectorAll<HTMLDivElement>(".settings > div[data-label]");
      allSubMenus.forEach(menuDiv => {
        if (menuDiv.dataset.label === activeSettingsMenu) {
          menuDiv.removeAttribute("hidden");
        } else {
          menuDiv.setAttribute("hidden", "");
        }
      });
    } else {
      settingsContainerRef.current.classList.remove("active");
      settingsBtnRef.current.classList.remove("active");
      const allSubMenus = settingsContainerRef.current.querySelectorAll<HTMLDivElement>(".settings > div[data-label]");
      allSubMenus.forEach(menuDiv => menuDiv.setAttribute("hidden", ""));
      const homeMenu = settingsContainerRef.current.querySelector<HTMLDivElement>(".settings > div[data-label='settingHome']");
      if (homeMenu) homeMenu.removeAttribute("hidden");
    }
  }, [isSettingsActive, activeSettingsMenu]);

   // Effect for managing captions menu display
  useEffect(() => {
    if (!captionsContainerRef.current || !captionsBtnRef.current) return;

    if (isCaptionsActive) {
      captionsContainerRef.current.classList.add("active");
      captionsBtnRef.current.classList.add("active");
      if (settingsContainerRef.current?.classList.contains("active")) {
        settingsContainerRef.current.classList.remove("active");
        settingsBtnRef.current?.classList.remove("active");
        setIsSettingsActive(false);
      }
    } else {
      captionsContainerRef.current.classList.remove("active");
      captionsBtnRef.current.classList.remove("active");
    }
  }, [isCaptionsActive]);

  // Effect for populating caption list
  useEffect(() => {
    if (!captionListUlRef.current) {
        if (subtitles.length > 0) {
            console.warn("Caption list UI element (.caption ul) not found, but subtitles were provided.");
        }
        return;
    }

    captionListUlRef.current.innerHTML = "";

    const offLi = document.createElement('li');
    offLi.textContent = "OFF";
    offLi.dataset.track = "OFF";
    if (currentCaptionTrackLabel === "OFF") offLi.classList.add("active");
    offLi.onclick = () => handleChangeCaptionTrack("OFF");
    captionListUlRef.current.appendChild(offLi);

    subtitles.forEach((sub) => {
        const trackLi = document.createElement('li');
        trackLi.textContent = sub.label;
        trackLi.dataset.track = sub.label;
        if (sub.label === currentCaptionTrackLabel) trackLi.classList.add("active");
        trackLi.onclick = () => handleChangeCaptionTrack(sub.label);
        captionListUlRef.current?.appendChild(trackLi);
    });
  }, [subtitles, currentCaptionTrackLabel, handleChangeCaptionTrack]);

  // Effect for activating selected caption track and handling cue changes
  useEffect(() => {
    const video = mainVideoRef.current;
    if (!video || !video.textTracks) return;

    const tracks = video.textTracks;
    const cueChangeListeners: Array<{track: TextTrack, listener: EventListener}> = [];

    const handleCueChange = (event: Event) => {
      const track = event.target as TextTrack;
      if (track.mode === 'showing' && captionTextRef.current) {
        const cue = track.activeCues?.[0];
        captionTextRef.current.innerHTML = cue ? (cue as VTTCue).text.replace(/\\n/g, '<br>') : '';
      }
    };

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      // Detach any old listeners first to be safe, though ideally this effect runs once per track change.
      // track.removeEventListener('cuechange', handleCueChange); // Might be problematic if handleCueChange is redefined.

      if (track.label === currentCaptionTrackLabel && currentCaptionTrackLabel !== "OFF") {
        track.mode = 'showing';
        track.addEventListener('cuechange', handleCueChange);
        cueChangeListeners.push({track, listener: handleCueChange});
        // Initial cue display if already active
        if (track.activeCues?.[0] && captionTextRef.current) {
           captionTextRef.current.innerHTML = (track.activeCues[0] as VTTCue).text.replace(/\\n/g, '<br>');
        }
      } else {
        track.mode = 'disabled';
      }
    }

    if (currentCaptionTrackLabel === "OFF" && captionTextRef.current) {
      captionTextRef.current.innerHTML = ""; // Clear caption text
    }

    return () => {
      cueChangeListeners.forEach(item => item.track.removeEventListener('cuechange', item.listener));
    };
  }, [currentCaptionTrackLabel, subtitles]); // Re-run when selected track or subtitles (which might re-create tracks) change


  // Effect for attaching event listeners to video element (mostly for video state changes)
  useEffect(() => {
    const video = mainVideoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      if (isAutoplayActive) {
        video.play();
      } else {
        setIsPlaying(false);
      }
    };

    const handleWaiting = () => {
      if (loaderRef.current) loaderRef.current.style.display = "block";
    };
    const handleCanPlay = () => {
      if (loaderRef.current) loaderRef.current.style.display = "none";
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", () => setIsPlaying(true));
    video.addEventListener("pause", () => setIsPlaying(false));
    video.addEventListener("ended", handleVideoEnd);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);

    if (playerContainerRef.current) {
        if(isPlaying) playerContainerRef.current.classList.add("paused");
        else playerContainerRef.current.classList.remove("paused");
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", () => setIsPlaying(true));
      video.removeEventListener("pause", () => setIsPlaying(false));
      video.removeEventListener("ended", handleVideoEnd);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [isPlaying, duration, isAutoplayActive, handleLoadedData, handleTimeUpdate]); // Added isAutoplayActive and handlers


  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreenActive(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Prevent context menu on video
  useEffect(() => {
    const videoElement = mainVideoRef.current;
    if (videoElement) {
      const preventContextMenu = (event: MouseEvent) => {
        event.preventDefault();
      };
      videoElement.addEventListener("contextmenu", preventContextMenu);
      return () => {
        videoElement.removeEventListener("contextmenu", preventContextMenu);
      };
    }
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  // The large useEffect for attaching listeners to controls is removed.
  // That responsibility is now largely within PlayerControls or handled by passing handlers as props.

  return (
    <div className="video_player" ref={playerContainerRef} style={{ maxWidth: width }}>
      {/* Loader and Caption Text might still be rendered here if not part of PlayerControls */}
      <div ref={loaderRef} className="loader" style={{display: "none"}}></div>
      <p ref={captionTextRef} className="caption_text"></p>

      {intro && (
        <div className="video-intro">
          Intro: {intro.start}s - {intro.end}s
        </div>
      )}

      <video
        ref={mainVideoRef}
        className="main-video"
        controls={false}
        preload="metadata"
        style={{ width: "100%", height: "auto" }}
        {...plyrOptions}
      >
        <source src={source} type={source.endsWith(".m3u8") ? "application/x-mpegURL" : "video/mp4"} />
        {subtitles.map(
          ({ label, kind = "subtitles", src, srclang, default: def }, i) => (
            <track
              key={i}
              label={label}
              kind={kind}
              src={src}
              srclang={srclang}
              default={def}
            />
          )
        )}
        Your browser does not support the video tag.
      </video>

      <PlayerControls
        isPlaying={isPlaying}
        volume={currentVolume}
        currentTime={currentTime}
        duration={duration}
        isSettingsActive={isSettingsActive}
        activeSettingsMenu={activeSettingsMenu}
        isCaptionsActive={isCaptionsActive}
        currentCaptionTrackLabel={currentCaptionTrackLabel}
        subtitles={subtitles}
        isAutoplayActive={isAutoplayActive}
        isFullscreenActive={isFullscreenActive}

        onPlayPause={handlePlayPause}
        onVolumeChange={(newVolume) => {
            if (mainVideoRef.current) mainVideoRef.current.volume = newVolume;
            setCurrentVolume(newVolume);
        }}
        onMuteToggle={handleMuteToggle}
        onFastRewind={handleFastRewind}
        onFastForward={handleFastForward}

        onSeekPointerDown={handlePointerDownOnProgress}
        onSeekPointerMove={handlePointerMoveOnProgress}
        onSeekPointerUp={handlePointerUpOnProgress}

        onToggleSettings={handleToggleSettings}
        onSettingsNavigate={handleSettingsNavigation}
        onPlaybackSpeedChange={handlePlaybackSpeedChange}
        onQualityChangeHLS={handleQualityChangeHLS}
        onQualityChangeNonHLS={handleQualityChangeNonHLS}

        onToggleCaptions={handleToggleCaptions}
        onChangeCaptionTrack={handleChangeCaptionTrack}

        onToggleAutoplay={handleToggleAutoplay}
        onTogglePictureInPicture={handleTogglePictureInPicture}
        onToggleFullscreen={handleToggleFullscreen}

        playerContainerRef={playerContainerRef}
        playerSeekTime={playerSeekTime} // Pass down playerSeekTime
      />

      {outro && (
        <div className="video-outro">
          Outro: {outro.start}s - {outro.end}s
        </div>
      )}

      {onEpisodesClick && (
        <button onClick={onEpisodesClick} style={{ marginTop: 10 }}>
          Episodes
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
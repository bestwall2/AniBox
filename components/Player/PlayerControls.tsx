import React, { useRef, useEffect } from 'react';

interface PlayerControlsProps {
  playerContainerRef: React.RefObject<HTMLDivElement>; // For mouse move events to show/hide controls
  // State props
  isPlaying: boolean;
  volume: number; // Range 0-1
  currentTime: number;
  duration: number;
  isSettingsActive: boolean;
  activeSettingsMenu: 'home' | 'speed' | 'quality';
  isCaptionsActive: boolean;
  currentCaptionTrackLabel: string;
  subtitles: Array<{ label: string; src: string }>;

  // Event handlers from VideoPlayer
  onPlayPause: () => void;
  onVolumeChange: (newVolume: number) => void; // User changes input range
  onMuteToggle: () => void;
  onFastRewind: () => void;
  onFastForward: () => void;
  onSeek: (e: PointerEvent | React.PointerEvent<HTMLDivElement>) => void; // For progress bar click/drag
  onSeekPointerDown: (e: PointerEvent | React.PointerEvent<HTMLDivElement>) => void;
  onSeekPointerMove: (e: PointerEvent | React.PointerEvent<HTMLDivElement>) => void;
  onSeekPointerUp: (e: PointerEvent | React.PointerEvent<HTMLDivElement>) => void;

  onToggleSettings: () => void;
  onSettingsNavigate: (menu: 'home' | 'speed' | 'quality') => void;
  onPlaybackSpeedChange: (speed: number) => void;
  onQualityChangeHLS: (level: number) => void; // Or a more generic onQualityChange
  onQualityChangeNonHLS: (quality: string, source: string) => void;

  onToggleCaptions: () => void;
  onChangeCaptionTrack: (trackLabel: string) => void;

  // New props for Fullscreen, PiP, Autoplay
  isAutoplayActive?: boolean;
  isFullscreenActive?: boolean;
  onToggleAutoplay?: () => void;
  onTogglePictureInPicture?: () => void;
  onToggleFullscreen?: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = (props) => {
  const {
    isPlaying,
    volume,
    currentTime,
    duration,
    isSettingsActive,
    activeSettingsMenu,
    isCaptionsActive,
    currentCaptionTrackLabel,
    subtitles,
    onPlayPause,
    onVolumeChange,
    onMuteToggle,
    onFastRewind,
    onFastForward,
    onSeek,
    onSeekPointerDown,
    onSeekPointerMove,
    onSeekPointerUp,
    onToggleSettings,
    onSettingsNavigate,
    onPlaybackSpeedChange,
    onQualityChangeHLS,
    onQualityChangeNonHLS,
    onToggleCaptions,
    onChangeCaptionTrack,
    isAutoplayActive,
    isFullscreenActive,
    onToggleAutoplay,
    onTogglePictureInPicture,
    onToggleFullscreen,
  } = props;

  // Refs for DOM elements within PlayerControls
  const progressAreaRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const bufferedBarRef = useRef<HTMLCanvasElement>(null);
  const currentTimeRef = useRef<HTMLSpanElement>(null);
  const totalDurationRef = useRef<HTMLSpanElement>(null);
  const playPauseBtnIconRef = useRef<HTMLElement>(null);
  const volumeBtnIconRef = useRef<HTMLElement>(null);
  const volumeRangeInputRef = useRef<HTMLInputElement>(null);

  const settingsContainerRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLElement>(null);
  const playbackSpeedBtnsRef = useRef<NodeListOf<HTMLLIElement> | null>(null);
  const qualityUlRef = useRef<HTMLUListElement | null>(null);

  const captionsContainerRef = useRef<HTMLDivElement>(null);
  const captionsBtnRef = useRef<HTMLElement>(null);
  const captionListUlRef = useRef<HTMLUListElement | null>(null);
  const progressAreaTimeRef = useRef<HTMLDivElement>(null);
  const controlsElementRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoplayBtnIconRef = useRef<HTMLElement>(null);
  const fullscreenBtnIconRef = useRef<HTMLElement>(null);


  // Format time utility (could be imported from a utils file if shared)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Update visual elements based on props
  useEffect(() => {
    if (progressBarRef.current && duration > 0) {
      progressBarRef.current.style.width = `${(currentTime / duration) * 100}%`;
    }
    if (currentTimeRef.current) {
      currentTimeRef.current.textContent = formatTime(currentTime);
    }
    if (totalDurationRef.current && duration > 0) {
      totalDurationRef.current.textContent = formatTime(duration);
    }
  }, [currentTime, duration]);

  useEffect(() => {
    if (playPauseBtnIconRef.current) {
      playPauseBtnIconRef.current.innerHTML = isPlaying ? 'pause' : 'play_arrow';
      playPauseBtnIconRef.current.title = isPlaying ? 'Pause' : 'Play';
    }
  }, [isPlaying]);

  useEffect(() => {
    if (volumeBtnIconRef.current) {
      if (volume === 0) {
        volumeBtnIconRef.current.innerHTML = 'volume_off';
      } else if (volume < 0.4) {
        volumeBtnIconRef.current.innerHTML = 'volume_down';
      } else {
        volumeBtnIconRef.current.innerHTML = 'volume_up';
      }
    }
    if (volumeRangeInputRef.current) {
      volumeRangeInputRef.current.value = String(volume * 100);
    }
  }, [volume]);

  // Settings Menu display logic
   useEffect(() => {
    if (!settingsContainerRef.current || !settingsBtnRef.current) return;

    if (isSettingsActive) {
      settingsContainerRef.current.classList.add("active");
      settingsBtnRef.current.classList.add("active");
      // Ensure sub-menus are correctly shown/hidden based on activeSettingsMenu
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
      if (homeMenu) homeMenu.removeAttribute("hidden"); // Default to home
    }
  }, [isSettingsActive, activeSettingsMenu]);

  // Captions Menu display logic
  useEffect(() => {
    if (!captionsContainerRef.current || !captionsBtnRef.current) return;
    if (isCaptionsActive) {
      captionsContainerRef.current.classList.add("active");
      captionsBtnRef.current.classList.add("active");
    } else {
      captionsContainerRef.current.classList.remove("active");
      captionsBtnRef.current.classList.remove("active");
    }
  }, [isCaptionsActive]);

  // Populate captions list
   useEffect(() => {
    if (!captionListUlRef.current) return;
    captionListUlRef.current.innerHTML = "";

    const offLi = document.createElement('li');
    offLi.textContent = "OFF";
    offLi.dataset.track = "OFF";
    if (currentCaptionTrackLabel === "OFF") offLi.classList.add("active");
    offLi.onclick = () => onChangeCaptionTrack("OFF");
    captionListUlRef.current.appendChild(offLi);

    props.subtitles.forEach((sub) => {
        const trackLi = document.createElement('li');
        trackLi.textContent = sub.label;
        trackLi.dataset.track = sub.label;
        if (sub.label === currentCaptionTrackLabel) trackLi.classList.add("active");
        trackLi.onclick = () => onChangeCaptionTrack(sub.label);
        captionListUlRef.current?.appendChild(trackLi);
    });
  }, [props.subtitles, currentCaptionTrackLabel, onChangeCaptionTrack]);

  // Populate playback speed options (assuming they are static in the HTML structure)
  // This effect is to attach listeners to pre-existing items from HTML
  useEffect(() => {
    if (settingsContainerRef.current) { // Ensure settings container is there
        const speedOptions = settingsContainerRef.current.querySelectorAll<HTMLLIElement>(".playback li[data-speed]");
        speedOptions.forEach(li => {
            const speed = parseFloat(li.dataset.speed!);
            // Important: Remove old listener before adding new one if this effect can re-run with different handlers
            // For now, assuming onPlaybackSpeedChange is stable or this effect runs once for these static items.
            li.onclick = () => props.onPlaybackSpeedChange(speed);
        });

        // Attach listeners for settings navigation (Home links and Back arrows)
        const homeLinks = settingsContainerRef.current.querySelectorAll<HTMLLIElement>(".settings > div[data-label='settingHome'] > ul > li");
        homeLinks.forEach(link => {
            const targetMenu = link.dataset.label as 'speed' | 'quality';
            if (targetMenu) {
                link.onclick = () => props.onSettingsNavigate(targetMenu);
            }
        });

        const backArrows = settingsContainerRef.current.querySelectorAll<HTMLElement>(".settings .back_arrow");
        backArrows.forEach(arrow => {
            const targetMenu = arrow.dataset.label as 'home';
            if (targetMenu) {
                 arrow.onclick = () => props.onSettingsNavigate(targetMenu);
            }
        });
    }
  }, [props.onPlaybackSpeedChange, props.onSettingsNavigate]); // Add dependencies

  // Note: Quality options are populated dynamically by VideoPlayer.tsx when HLS manifest is parsed.
  // The onClick handlers for quality are also attached at that time.

  // Update Autoplay and Fullscreen button icons based on props
  useEffect(() => {
    if (autoplayBtnIconRef.current) {
      if (isAutoplayActive) {
        autoplayBtnIconRef.current.classList.add("active");
        autoplayBtnIconRef.current.title = "Autoplay is ON";
      } else {
        autoplayBtnIconRef.current.classList.remove("active");
        autoplayBtnIconRef.current.title = "Autoplay is OFF";
      }
    }
  }, [isAutoplayActive]);

  useEffect(() => {
    if (fullscreenBtnIconRef.current) {
      fullscreenBtnIconRef.current.innerHTML = isFullscreenActive ? 'fullscreen_exit' : 'fullscreen';
    }
  }, [isFullscreenActive]);

  // Controls Visibility Logic
  const showControls = () => {
    if (controlsElementRef.current) {
      controlsElementRef.current.classList.add("active");
    }
    // Logic for caption_text visibility (if it were part of PlayerControls)
    // if (captionTextRef.current && props.subtitles.length > 0) {
    //   captionTextRef.current.classList.remove("active");
    // }
  };

  const resetHideControlsTimer = () => {
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    if (!props.isPlaying) { // Don't hide if paused
        showControls(); // Ensure they are shown if paused
        return;
    }
    hideControlsTimerRef.current = setTimeout(() => {
      if (controlsElementRef.current && !props.isSettingsActive && !props.isCaptionsActive && props.isPlaying) {
        controlsElementRef.current.classList.remove("active");
        // if (captionTextRef.current && props.subtitles.length > 0) {
        //   captionTextRef.current.classList.add("active");
        // }
      }
    }, 3000);
  };

  useEffect(() => {
    const playerDiv = props.playerContainerRef.current;
    if (playerDiv) {
      playerDiv.addEventListener("mousemove", () => {
        showControls();
        resetHideControlsTimer();
      });
      // Initial call to start timer
      resetHideControlsTimer();
    }
    return () => {
      if (playerDiv) {
        playerDiv.removeEventListener("mousemove", () => {
            showControls();
            resetHideControlsTimer();
        });
      }
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, [props.playerContainerRef, props.isPlaying, props.isSettingsActive, props.isCaptionsActive]);


  // Progress Area Hover Time Display Logic
  useEffect(() => {
    const progArea = progressAreaRef.current;
    const progAreaTime = progressAreaTimeRef.current;

    if (!progArea || !progAreaTime) return;

    const handleProgressAreaMousemove = (e: MouseEvent) => {
        if (!props.duration) return;
        const progressWidthVal = progArea.clientWidth;
        const x = e.offsetX;
        const videoDuration = props.duration;
        const progressTimeVal = Math.floor((x / progressWidthVal) * videoDuration);

        const currentMin = Math.floor(progressTimeVal / 60);
        let currentSec = Math.floor(progressTimeVal % 60);
        currentSec = currentSec < 10 ? (`0${currentSec}` as unknown as number) : currentSec; // type hack
        progAreaTime.innerHTML = `${currentMin}:${currentSec}`;

        progAreaTime.style.setProperty("--x", `${x}px`);
        progAreaTime.style.display = "block";
    };

    const handleProgressAreaMouseleave = () => {
        progAreaTime.style.display = "none";
    };

    progArea.addEventListener("mousemove", handleProgressAreaMousemove);
    progArea.addEventListener("mouseleave", handleProgressAreaMouseleave);

    return () => {
        progArea.removeEventListener("mousemove", handleProgressAreaMousemove);
        progArea.removeEventListener("mouseleave", handleProgressAreaMouseleave);
    };
  }, [props.duration]);


  return (
    <>
      <div className="progressAreaTime" ref={progressAreaTimeRef}>0:00</div>

      <div className="controls active" ref={controlsElementRef}> {/* Initial active, managed by timer */}
        <div className="progress-area" ref={progressAreaRef}
            onPointerDown={onSeekPointerDown}
            // onPointerMove={onSeekPointerMove} // This is for DRAGGING, not hover time
            onPointerUp={onSeekPointerUp}
            onPointerLeave={onSeekPointerUp}
        >
          <canvas className="bufferedBar" ref={bufferedBarRef}></canvas>
          <div className="progress-bar" ref={progressBarRef}>
            <span></span>
          </div>
        </div>

        <div className="controls-list">
          <div className="controls-left">
            <span className="icon">
              <i className="material-icons fast-rewind" onClick={onFastRewind}>replay_10</i>
            </span>
            <span className="icon">
              <i className="material-icons play_pause" onClick={onPlayPause} ref={playPauseBtnIconRef}>play_arrow</i>
            </span>
            <span className="icon">
              <i className="material-icons fast-forward" onClick={onFastForward}>forward_10</i>
            </span>
            <span className="icon">
              <i className="material-icons volume" onClick={onMuteToggle} ref={volumeBtnIconRef}>volume_up</i>
              <input type="range" min="0" max="100" className="volume_range" ref={volumeRangeInputRef} onChange={(e) => onVolumeChange(parseFloat(e.target.value) / 100)} />
            </span>
            <div className="timer">
              <span className="current" ref={currentTimeRef}>0:00</span> /
              <span className="duration" ref={totalDurationRef}>0:00</span>
            </div>
          </div>

          <div className="controls-right">
            <span className="icon" onClick={onToggleAutoplay}>
              <i className="material-icons auto-play" ref={autoplayBtnIconRef}></i>
            </span>
            <span className="icon" onClick={onToggleCaptions}>
              <i className="material-icons captionsBtn" ref={captionsBtnRef}>closed_caption</i>
            </span>
            <span className="icon" onClick={onToggleSettings}>
              <i className="material-icons settingsBtn" ref={settingsBtnRef}>settings</i>
            </span>
            <span className="icon" onClick={onTogglePictureInPicture}>
              <i className="material-icons picture_in_picutre">picture_in_picture_alt</i>
            </span>
            <span className="icon" onClick={onToggleFullscreen}>
              <i className="material-icons fullscreen" ref={fullscreenBtnIconRef}>fullscreen</i>
            </span>
          </div>
        </div>
      </div>

      {/* Settings Menu Structure */}
      <div className="settings" ref={settingsContainerRef}>
        <div data-label="settingHome">
          <ul>
            <li data-label="speed">
              <span> Speed </span>
              <span className="material-symbols-outlined icon">arrow_forward_ios</span>
            </li>
            <li data-label="quality">
              <span> Quality </span>
              <span className="material-symbols-outlined icon">arrow_forward_ios</span>
            </li>
          </ul>
        </div>
        <div className="playback" data-label="speed" hidden>
          <span>
            <i className="material-symbols-outlined icon back_arrow" data-label="settingHome">arrow_back</i>
            <span>Playback Speed </span>
          </span>
          <ul>
            <li data-speed="0.25">0.25</li>
            <li data-speed="0.5">0.5</li>
            <li data-speed="0.75">0.75</li>
            <li data-speed="1" className="active">Normal</li>
            <li data-speed="1.25">1.25</li>
            <li data-speed="1.5">1.5</li>
            <li data-speed="1.75">1.75</li>
            <li data-speed="2">2</li>
          </ul>
        </div>
        <div data-label="quality" hidden ref={qualityUlRef_wrapper => {
            // This is a bit of a hack to assign the ul to qualityUlRef
            // since the HTML structure has the ul as a direct child.
            // A better way would be to pass the qualityUlRef directly to the <ul>
            // if we were writing this JSX from scratch.
            if (qualityUlRef_wrapper) qualityUlRef.current = qualityUlRef_wrapper.querySelector('ul');
        }}>
          <span>
            <i className="material-symbols-outlined icon back_arrow" data-label="settingHome">arrow_back</i>
            <span>Playback Quality </span>
          </span>
          <ul>
            {/* Quality options are dynamically populated by VideoPlayer.tsx */}
            <li data-quality="auto" className="active">auto</li>
          </ul>
        </div>
      </div>

      {/* Captions Menu Structure */}
      <div className="captions" ref={captionsContainerRef}>
        <div className="caption">
          <span>Select Subtitle</span>
          <ul ref={captionListUlRef}>
            {/* Captions list items are dynamically populated */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PlayerControls;

// Note: The progressAreaTime, loader, and caption_text <p> are still part of the original
// video_player_html. VideoPlayer.tsx will need to decide if it keeps injecting those,
// or if they also become part of this or another sub-component.
// For this task, PlayerControls focuses on the main control bar and settings/captions menus.
// Also, some icons like autoplay, PiP, fullscreen still need their onClick handlers wired up.
// The dynamic population of quality and caption lists, and attaching their event handlers,
// will primarily be managed by effects within PlayerControls, using props passed from VideoPlayer.
// However, for quality list with HLS, VideoPlayer might still need to trigger re-population
// when HLS manifest is parsed.

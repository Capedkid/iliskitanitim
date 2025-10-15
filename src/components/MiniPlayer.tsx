"use client";

import { useEffect, useRef, useState } from "react";

type MiniPlayerProps = {
  getAudio: () => HTMLAudioElement | null;
  currentTrack?: {
    title: string;
    artist: string;
  };
  isPlayingProp?: boolean;
  playlist?: Array<{ title: string; artist: string }>;
  currentIndex?: number;
  onSelectTrack?: (index: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  isShuffled?: boolean;
  repeatMode?: 'none' | 'one' | 'all';
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  onTogglePlay?: () => void; // Hero'daki aynı fonksiyon
};

export default function MiniPlayer({ 
  getAudio, 
  currentTrack,
  isPlayingProp,
  playlist,
  currentIndex,
  onSelectTrack,
  onNext,
  onPrevious,
  onVolumeChange,
  volume = 0.7,
  isShuffled = false,
  repeatMode = 'none',
  onToggleShuffle,
  onToggleRepeat,
  onTogglePlay
}: MiniPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const rafRef = useRef<number | null>(null);
  const [enter, setEnter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // removed auto-hide

  useEffect(() => {
    // Sync initial playing state immediately on mount
    const a0 = getAudio();
    if (a0) {
      try {
        setIsPlaying(!a0.paused);
      } catch {}
    }

    const audio = getAudio();
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onLoaded = () => {
      setIsLoading(false);
    };
    const onPlaying = () => setIsLoading(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("playing", onPlaying);

    const tick = () => {
      const a = getAudio();
      if (a && a.duration) {
        setProgress((a.currentTime / a.duration) * 100);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("playing", onPlaying);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [getAudio]);

  useEffect(() => {
    // Trigger enter animation on mount
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // removed auto-hide lifecycle

  const toggle = async () => {
    // Hero'daki aynı fonksiyonu kullan
    if (onTogglePlay) {
      const a = getAudio();
      if (a && a.readyState < 2 && a.paused) setIsLoading(true);
      onTogglePlay();
    } else {
      // Fallback: eski yöntem
      const audio = getAudio();
      if (!audio) return;
      if (audio.paused) {
        if (audio.readyState < 2) setIsLoading(true);
        await audio.play();
      } else {
        audio.pause();
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = (target?.tagName || '').toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable;
      if (isTyping) return;
      if (e.code === 'Space') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'ArrowLeft') {
        const a = getAudio();
        if (!a) return;
        const delta = e.shiftKey ? 10 : 5;
        a.currentTime = Math.max(0, (a.currentTime || 0) - delta);
      } else if (e.key === 'ArrowRight') {
        const a = getAudio();
        if (!a) return;
        const delta = e.shiftKey ? 10 : 5;
        if (a.duration) a.currentTime = Math.min(a.duration, (a.currentTime || 0) + delta);
      } else if (e.key.toLowerCase() === 'm') {
        if (typeof volume === 'number') onVolumeChange?.(volume > 0 ? 0 : 0.7);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [getAudio, toggle, onVolumeChange, volume]);

  

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = getAudio();
    if (!audio || !audio.duration) return;
    const pct = Number(e.target.value);
    audio.currentTime = (pct / 100) * audio.duration;
    setProgress(pct);
  };

  return (
    <div 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(560px,92vw)] rounded-2xl bg-black/60 backdrop-blur ring-1 ring-rose-300/40 shadow-lg transition-all duration-500 ease-out ${isExpanded ? 'h-[108px]' : 'h-12'} group ${enter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      onMouseEnter={() => {
        if (window.innerWidth >= 768) setIsExpanded(true);
      }}
      onMouseMove={() => {
        if (window.innerWidth >= 768 && matchMedia('(hover: hover)').matches) setIsExpanded(true);
      }}
      onMouseLeave={() => {
        if (window.innerWidth >= 768) setIsExpanded(false);
      }}
    >
      {/* Compact View */}
      <div className="flex items-center gap-3 px-4 py-2 h-12">
        <button onClick={toggle} className="relative h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors overflow-hidden" aria-label="Play/Pause">
          {/* short pulse wave */}
          <span className="pointer-events-none absolute inset-0 rounded-full scale-0 opacity-0" />
          {isLoading ? (
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
              <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : ( (typeof isPlayingProp === 'boolean' ? isPlayingProp : isPlaying) ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M8 5l10 7-10 7V5z" fill="currentColor" />
            </svg>
          ))}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {currentTrack?.title || "Şarkı Seçilmedi"}
          </div>
          <div className="text-xs text-white/70 truncate">
            {currentTrack?.artist || "Henüz müzik çalmadınız"}
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center md:hidden text-white"
          aria-label="Expand"
        >
          {isExpanded ? "▼" : "▲"}
        </button>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="px-4 pb-5 space-y-3">
          {/* Progress Bar (custom visual, same theme colors) */}
          <div className="flex-1">
            <div className="relative h-2 rounded-full bg-white/10 overflow-hidden group cursor-pointer"
              onMouseDown={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                const rect = el.getBoundingClientRect();
                const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                const audio = getAudio();
                if (audio && audio.duration) {
                  audio.currentTime = pct * audio.duration;
                  setProgress(pct * 100);
                }
                const onMove = (ev: MouseEvent) => {
                  const r = el.getBoundingClientRect();
                  const p = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
                  const a = getAudio();
                  if (a && a.duration) {
                    a.currentTime = p * a.duration;
                    setProgress(p * 100);
                  }
                };
                const onUp = () => {
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
              onTouchStart={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                const rect = el.getBoundingClientRect();
                const t = e.touches[0];
                const pct = Math.min(1, Math.max(0, (t.clientX - rect.left) / rect.width));
                const audio = getAudio();
                if (audio && audio.duration) {
                  audio.currentTime = pct * audio.duration;
                  setProgress(pct * 100);
                }
              }}
            >
              <div className="absolute inset-y-0 left-0 bg-rose-500" style={{ width: `${progress}%` }} />
              <div className="absolute -top-1.5 h-5 w-5 rounded-full border-2 border-rose-500 bg-white opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `max(0%, min(100%, ${progress}%))`, transform: 'translateX(-50%)' }} />
              <input 
                aria-label="Seek"
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={onSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Controls Row */}
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={onToggleShuffle}
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                  isShuffled ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label="Shuffle"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 7h4l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 7l-3 3M20 7l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 17h4l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button 
                onClick={onPrevious}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 5L10 12l10 7V5z" fill="currentColor" />
                </svg>
              </button>
              <button 
                onClick={onNext}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M18 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 5l10 7-10 7V5z" fill="currentColor" />
                </svg>
              </button>
              <button 
                onClick={onToggleRepeat}
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                  repeatMode !== 'none' ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label="Repeat"
              >
                {repeatMode === 'one' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M7 7h7a4 4 0 0 1 0 8H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7 7l3-3M7 7l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <text x="12" y="14" textAnchor="middle" fontSize="8" fill="currentColor">1</text>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M7 7h7a4 4 0 0 1 0 8H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7 7l3-3M7 7l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label="Mute"
                onClick={() => {
                  if (volume > 0) {
                    onVolumeChange?.(0);
                  } else {
                    onVolumeChange?.(0.7);
                  }
                }}
              >
                {volume === 0 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 10h4l5-4v12l-5-4H5z" fill="currentColor" />
                    <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 10h4l5-4v12l-5-4H5z" fill="currentColor" />
                    <path d="M16 8c2 1 2 7 0 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              <input 
                type="range" 
                min={0} 
                max={1} 
                step={0.05} 
                value={volume} 
                onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
                className="w-24 sm:w-28 accent-rose-500"
                aria-label="Volume"
              />
            </div>
          </div>

          {/* Time display and mini playlist removed as requested */}
        </div>
      )}
    </div>
  );
}



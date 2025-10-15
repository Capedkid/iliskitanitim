"use client";

import { useEffect, useRef, useState } from "react";

type MiniPlayerProps = {
  getAudio: () => HTMLAudioElement | null;
  currentTrack?: {
    title: string;
    artist: string;
  };
  isPlayingProp?: boolean;
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
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    const tick = () => {
      const a = getAudio();
      if (a && a.duration) setProgress((a.currentTime / a.duration) * 100);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [getAudio]);

  useEffect(() => {
    // Trigger enter animation on mount
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = async () => {
    // Hero'daki aynı fonksiyonu kullan
    if (onTogglePlay) {
      onTogglePlay();
    } else {
      // Fallback: eski yöntem
      const audio = getAudio();
      if (!audio) return;
      if (audio.paused) await audio.play(); else audio.pause();
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = getAudio();
    if (!audio || !audio.duration) return;
    const pct = Number(e.target.value);
    audio.currentTime = (pct / 100) * audio.duration;
    setProgress(pct);
  };

  return (
    <div 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(560px,92vw)] rounded-2xl bg-black/60 backdrop-blur ring-1 ring-rose-300/40 shadow-lg transition-all duration-500 ease-out ${isExpanded ? 'h-32' : 'h-12'} group ${enter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      onMouseEnter={() => {
        // Sadece masaüstünde otomatik aç
        if (window.innerWidth >= 768) {
          setIsExpanded(true);
        }
      }}
      onMouseLeave={() => {
        // Sadece masaüstünde otomatik kapat
        if (window.innerWidth >= 768) {
          setIsExpanded(false);
        }
      }}
    >
      {/* Compact View */}
      <div className="flex items-center gap-3 px-4 py-2 h-12">
        <button onClick={toggle} className="h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors" aria-label="Play/Pause">
          {(typeof isPlayingProp === 'boolean' ? isPlayingProp : isPlaying) ? "❚❚" : "▶"}
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
        <div className="px-4 pb-4 space-y-3">
          {/* Progress Bar */}
          <div className="flex-1">
            <input 
              aria-label="Seek" 
              type="range" 
              min={0} 
              max={100} 
              value={progress} 
              onChange={onSeek} 
              className="w-full accent-rose-500" 
            />
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
                🔀
              </button>
              <button 
                onClick={onPrevious}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
                aria-label="Previous"
              >
                ⏮
              </button>
              <button 
                onClick={onNext}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
                aria-label="Next"
              >
                ⏭
              </button>
              <button 
                onClick={onToggleRepeat}
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                  repeatMode !== 'none' ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label="Repeat"
              >
                {repeatMode === 'one' ? '🔁' : '🔂'}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70">🔊</span>
              <input 
                type="range" 
                min={0} 
                max={1} 
                step={0.1} 
                value={volume} 
                onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
                className="w-16 accent-rose-500"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



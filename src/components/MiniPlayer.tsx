"use client";

import { useEffect, useRef, useState } from "react";

type MiniPlayerProps = {
  getAudio: () => HTMLAudioElement | null;
};

export default function MiniPlayer({ getAudio }: MiniPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
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

  const toggle = async () => {
    const audio = getAudio();
    if (!audio) return;
    if (audio.paused) await audio.play(); else audio.pause();
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = getAudio();
    if (!audio || !audio.duration) return;
    const pct = Number(e.target.value);
    audio.currentTime = (pct / 100) * audio.duration;
    setProgress(pct);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(560px,92vw)] rounded-full bg-white/80 backdrop-blur ring-1 ring-black/10 shadow-lg flex items-center gap-3 px-4 py-2">
      <button onClick={toggle} className="h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors" aria-label="Play/Pause">
        {isPlaying ? "❚❚" : "▶"}
      </button>
      <div className="flex-1">
        <input aria-label="Seek" type="range" min={0} max={100} value={progress} onChange={onSeek} className="w-full accent-rose-500" />
      </div>
      <div className="text-xs text-black/70">Mavi</div>
    </div>
  );
}



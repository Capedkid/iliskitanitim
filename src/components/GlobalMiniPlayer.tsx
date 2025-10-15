"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useMiniPlayer } from "@/contexts/MiniPlayerContext";
import MiniPlayer from "./MiniPlayer";

export default function GlobalMiniPlayer() {
  const [isClient, setIsClient] = useState(false);
  const {
    hasStartedPlaying,
    isPlaying,
    audioRef,
    currentTrackIndex,
    playlist,
    onTogglePlay,
    playNext,
    playPrevious,
    handleVolumeChange,
    volume,
    isShuffled,
    repeatMode,
    toggleShuffle,
    toggleRepeat,
    setIsPlaying,
    setHasStartedPlaying,
  } = useMiniPlayer();

  const pathname = usePathname();
  const inGame = pathname?.startsWith('/game');

  const currentTrack = playlist[currentTrackIndex] || playlist[0] || {
    id: 1,
    title: "Şarkı Seçilmedi",
    artist: "Henüz müzik çalmadınız", 
    src: "",
    duration: "0:00"
  };

  // Client-side rendering için
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Oyun sayfalarında müziği durdur ve MiniPlayer'ı gizle
  useEffect(() => {
    if (!isClient) return;
    if (inGame) {
      try {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }
      } catch {}
      setIsPlaying(false);
      setHasStartedPlaying(false);
    }
  }, [inGame, isClient, audioRef, setIsPlaying, setHasStartedPlaying]);

  // Server-side'da hiçbir şey render etme
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Spacer to prevent footer overlap when MiniPlayer is visible */}
      {hasStartedPlaying && !inGame && (
        <div aria-hidden className="h-20 md:h-36" />
      )}

      {/* Audio element sadece client-side'da render edilir */}
      <audio
        ref={audioRef}
        preload="none"
        onError={() => {
          // Kaynak yoksa uyarı verme
          if (!currentTrack.src) return;
          console.error("Audio element failed to load source", currentTrack.src);
          alert("Ses dosyası yüklenemedi. Dosya yolunu ve formatı kontrol edin.");
        }}
        onEnded={() => {
          if (repeatMode === 'all') {
            playNext();
          } else if (repeatMode === 'none') {
            playNext();
          }
        }}
        onCanPlay={() => {
          // Optional: could auto-play after first user gesture via button
          if (isPlaying && audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(() => {});
          }
        }}
      >
        {currentTrack.src ? (
          <source src={currentTrack.src} type="audio/mpeg" />
        ) : null}
      </audio>

      {/* MiniPlayer sadece hasStartedPlaying true olduğunda render edilir */}
      {hasStartedPlaying && !inGame && (
        <MiniPlayer 
          getAudio={() => audioRef.current}
          currentTrack={currentTrack}
          isPlayingProp={isPlaying}
          onNext={playNext}
          onPrevious={playPrevious}
          onVolumeChange={handleVolumeChange}
          volume={volume}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          onTogglePlay={onTogglePlay}
        />
      )}
    </>
  );
}

"use client";

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";

interface MusicTrack {
  id: number;
  title: string;
  artist: string;
  src: string;
  duration: string;
}

interface MiniPlayerContextType {
  // State
  isPlaying: boolean;
  hasStartedPlaying: boolean;
  currentTrackIndex: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  playlist: MusicTrack[];
  lastTrack: MusicTrack | null;
  
  // Audio ref
  audioRef: React.RefObject<HTMLAudioElement | null>;
  
  // Actions
  setIsPlaying: (playing: boolean) => void;
  setHasStartedPlaying: (started: boolean) => void;
  setCurrentTrackIndex: (index: number) => void;
  setVolume: (volume: number) => void;
  setIsShuffled: (shuffled: boolean) => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  setPlaylist: (playlist: MusicTrack[]) => void;
  setLastTrack: (track: MusicTrack | null) => void;
  
  // Music controls
  onTogglePlay: () => Promise<void>;
  playNext: () => void;
  playPrevious: () => void;
  handleVolumeChange: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const MiniPlayerContext = createContext<MiniPlayerContextType | undefined>(undefined);

export function MiniPlayerProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [lastTrack, setLastTrack] = useState<MusicTrack | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dosya adından şarkı bilgilerini çıkarma fonksiyonu
  const parseAudioFilename = (filename: string) => {
    const nameWithoutExt = filename.replace(/\.mp3$/i, '');
    const parts = nameWithoutExt.split(' - ');
    
    if (parts.length >= 2) {
      return {
        title: parts[0].trim(),
        artist: parts.slice(1).join(' - ').trim(),
        originalFilename: filename
      };
    } else {
      return {
        title: nameWithoutExt,
        artist: "Bilinmeyen Sanatçı",
        originalFilename: filename
      };
    }
  };

  // Şarkı dosyalarını otomatik tarama
  useEffect(() => {
    const scanAudioFiles = async () => {
      try {
        const response = await fetch('/api/audio-files');
        if (response.ok) {
          const files = await response.json();
          const tracks = files.map((filename: string, index: number) => {
            const parsed = parseAudioFilename(filename);
            return {
              id: index + 1,
              title: parsed.title,
              artist: parsed.artist,
              src: `/audio/${parsed.originalFilename}`,
              duration: "0:00" // Duration bilgisi yoksa varsayılan
            };
          });
          setPlaylist(tracks);
        }
      } catch (error) {
        console.error('Audio files scan error:', error);
      }
    };

    scanAudioFiles();
  }, []);

  // Persist only visibility within the same SPA session (not across hard reloads)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const nav = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined);
      const isReload = nav?.type === 'reload';
      const persistedVisible = sessionStorage.getItem('miniPlayer__visible');
      if (!isReload && persistedVisible === 'true') {
        setHasStartedPlaying(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      sessionStorage.setItem('miniPlayer__visible', hasStartedPlaying ? 'true' : 'false');
    } catch {}
  }, [hasStartedPlaying]);

  // Persist minimal UI state across navigations/reloads (do NOT persist visibility)
  useEffect(() => {
    try {
      const persisted = typeof window !== 'undefined' ? localStorage.getItem('miniPlayer__state') : null;
      if (persisted) {
        const parsed = JSON.parse(persisted) as { currentTrackIndex?: number; volume?: number };
        if (typeof parsed.currentTrackIndex === 'number') setCurrentTrackIndex(parsed.currentTrackIndex);
        if (typeof parsed.volume === 'number') setVolume(parsed.volume);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('miniPlayer__state', JSON.stringify({ currentTrackIndex, volume }));
      }
    } catch {}
  }, [currentTrackIndex, volume]);

  const currentTrack = playlist[currentTrackIndex] || playlist[0] || lastTrack || {
    id: 1,
    title: "Şarkı Seçilmedi",
    artist: "Henüz müzik çalmadınız", 
    src: "",
    duration: "0:00"
  };

  const onTogglePlay = async () => {
    if (!audioRef.current) return;
    try {
      // Kaynak yoksa hiçbir şey yapma
      const src = (playlist[currentTrackIndex] || playlist[0] || lastTrack)?.src || '';
      if (!isPlaying && !src) {
        // Henüz şarkı yoksa uyarısız şekilde çık
        return;
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioRef.current.readyState < 2) {
          audioRef.current.load();
        }
        await audioRef.current.play();
        setIsPlaying(true);
        setHasStartedPlaying(true);
        const t = playlist[currentTrackIndex] || playlist[0] || lastTrack || null;
        if (t) setLastTrack(t);
      }
    } catch (err) {
      console.error("Audio play error", err);
      // Kaynak yoksa uyarı gösterme
      const src = (playlist[currentTrackIndex] || playlist[0] || lastTrack)?.src || '';
      if (src) {
        alert("Şarkı çalınamadı. Dosya formatını veya yolu kontrol edin.");
      }
    }
  };

  const playNext = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    
    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.src = playlist[nextIndex].src;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
    setLastTrack(playlist[nextIndex]);
  };

  const playPrevious = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
    }
    
    setCurrentTrackIndex(prevIndex);
    if (audioRef.current) {
      audioRef.current.src = playlist[prevIndex].src;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
    setLastTrack(playlist[prevIndex]);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const value: MiniPlayerContextType = {
    isPlaying,
    hasStartedPlaying,
    currentTrackIndex,
    volume,
    isShuffled,
    repeatMode,
    playlist,
    lastTrack,
    audioRef,
    setIsPlaying,
    setHasStartedPlaying,
    setCurrentTrackIndex,
    setVolume,
    setIsShuffled,
    setRepeatMode,
    setPlaylist,
    setLastTrack,
    onTogglePlay,
    playNext,
    playPrevious,
    handleVolumeChange,
    toggleShuffle,
    toggleRepeat,
  };

  return (
    <MiniPlayerContext.Provider value={value}>
      {children}
    </MiniPlayerContext.Provider>
  );
}

export function useMiniPlayer() {
  const context = useContext(MiniPlayerContext);
  if (context === undefined) {
    throw new Error('useMiniPlayer must be used within a MiniPlayerProvider');
  }
  return context;
}

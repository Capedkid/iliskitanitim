"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Obstacle = { id: number; x: number; y: number; width: number; height: number };

export default function WalkingGame() {
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const obstacleIdRef = useRef(0);
  const spawnTimerRef = useRef(0);

  // World constants
  const GAME_HEIGHT = 320; // h-80
  const GROUND_HEIGHT = 96; // h-24
  const GROUND_TOP = GAME_HEIGHT - GROUND_HEIGHT; // 224
  const PLAYER_X = 96;  // fixed x
  const PLAYER_WIDTH = 48;
  const PLAYER_HEIGHT = 44;
  const GRAVITY = 2000; // px/s^2
  const JUMP_VELOCITY = -680; // px/s

  // State
  const [playerY, setPlayerY] = useState(GROUND_TOP - PLAYER_HEIGHT);
  const [velY, setVelY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [skyOffset, setSkyOffset] = useState(0);
  const [groundOffset, setGroundOffset] = useState(0);
  const [hitFlash, setHitFlash] = useState(false);

  const resetGame = () => {
    setPlayerY(GROUND_TOP - PLAYER_HEIGHT);
    setVelY(0);
    setIsJumping(false);
    setObstacles([]);
    setScore(0);
    spawnTimerRef.current = 0;
    lastTsRef.current = null;
    setGameOver(false);
    setRunning(true);
  };

  const endGame = () => {
    setRunning(false);
    setGameOver(true);
    setHitFlash(true);
    setTimeout(() => setHitFlash(false), 180);
  };

  const jump = () => {
    if (!running) return;
    if (isJumping) return;
    setVelY(JUMP_VELOCITY);
    setIsJumping(true);
  };

  // Input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, isJumping]);

  // Game loop (RAF, delta based)
  useEffect(() => {
    if (!running) return;
    const SPEED = 260; // px/s world speed

    const tick = (ts: number) => {
      const last = lastTsRef.current ?? ts;
      const dt = Math.min(0.032, (ts - last) / 1000); // clamp 32ms
      lastTsRef.current = ts;

      // Spawn obstacles
      spawnTimerRef.current += dt;
      const spawnEvery = 1.2 + Math.max(0, 1.6 - score / 500); // slightly faster over time
      if (spawnTimerRef.current > spawnEvery) {
        spawnTimerRef.current = 0;
        const h = 36 + Math.round(Math.random() * 12);
        const w = 36 + Math.round(Math.random() * 18);
        const xStart = (gameAreaRef.current?.clientWidth || 640) + 24;
        setObstacles(prev => [...prev, { id: obstacleIdRef.current++, x: xStart, y: GROUND_TOP - h, width: w, height: h }]);
      }

      // Update player physics
      setPlayerY(prev => {
        const nextV = velY + GRAVITY * dt;
        const groundY = GROUND_TOP - PLAYER_HEIGHT;
        const nextY = Math.min(groundY, prev + nextV * dt);
        if (nextY >= groundY) {
          setVelY(0);
          setIsJumping(false);
          return groundY;
        }
        setVelY(nextV);
        return nextY;
      });

      // Move obstacles and cull
      setObstacles(prev => prev
        .map(o => ({ ...o, x: o.x - SPEED * dt }))
        .filter(o => o.x + o.width > -20)
      );

      // Score
      setScore(s => s + Math.floor(100 * dt));

      // Parallax offsets
      setSkyOffset((s) => (s + 20 * dt) % 1000);
      setGroundOffset((g) => (g + SPEED * dt) % 1000);

      // Collision
      const px = PLAYER_X;
      const py = playerY;
      const pw = PLAYER_WIDTH;
      const ph = PLAYER_HEIGHT;
      for (const o of obstacles) {
        if (px < o.x + o.width && px + pw > o.x && py < o.y + o.height && py + ph > o.y) {
          endGame();
          break;
        }
      }

      if (running) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [running, playerY, velY, obstacles, score]);

  return (
    <div className="min-h-screen p-4">

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/game/selection" 
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
          >
            ← Geri Dön
          </Link>
          <div className="text-center">
            <h1 className="font-display text-3xl text-rose-600">Birlikte Yürüme 🚶‍♂️💖</h1>
            <p className="text-gray-600">İki karakter birlikte koşuyor!</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-rose-600">Skor: {score}</div>
            <div className="text-lg text-gray-600">&nbsp;</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex justify-center mb-6">
          {!running ? (
            <div className="text-center">
              <div className="rounded-3xl bg-black/30 backdrop-blur ring-1 ring-rose-300/50 p-8 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
                <h2 className="text-3xl font-display tracking-wide text-rose-400 mb-4">Birlikte Yürüme</h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  İki karakter birlikte koşuyor!<br/>
                  Engelleri aş, kalpleri topla!<br/>
                  <span className="text-sm text-white/70">👨 İsimBir | 👩 İsimİki</span>
                </p>
                <div className="text-sm text-white/60 mb-6">
                  Kontroller: Space/↑ (Zıpla) · Touch (Mobil)
                </div>
                <button
                  onClick={resetGame}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full transition-colors font-medium shadow-sm shadow-rose-500/20"
                >
                  Oyunu Başlat 🚶‍♂️
                </button>
              </div>
            </div>
          ) : (
            <div 
              ref={gameAreaRef}
              className="relative w-full max-w-2xl h-80 rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] overflow-hidden"
              onClick={jump}
            >
              {/* Sky (gradient + clouds) */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, #7ec8ff, #bfe7ff)' }}
              />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.9) 0 20%, transparent 22%),' +
                    'radial-gradient(circle at 70% 40%, rgba(255,255,255,0.9) 0 18%, transparent 20%),' +
                    'radial-gradient(circle at 40% 65%, rgba(255,255,255,0.9) 0 16%, transparent 18%)',
                  backgroundSize: '420px 220px, 420px 220px, 360px 200px',
                  backgroundRepeat: 'repeat',
                  backgroundPositionX: `${-skyOffset * 40}px, ${-skyOffset * 28}px, ${-skyOffset * 20}px`,
                }}
              />
              {/* Ground */}
              <div className="absolute bottom-0 w-full h-24 bg-gradient-to-b from-green-400 to-green-600" />
              {/* Grass strip parallax */}
              <div
                className="absolute bottom-16 left-0 right-0 h-2 opacity-70"
                style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, #22c55e 0 6px, #16a34a 6px 12px)',
                  transform: `translateX(${-groundOffset * 0.6}px)`,
                }}
              />
              {/* Dirt stripes */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16 opacity-35"
                style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0 8px, transparent 8px 16px)',
                  transform: `translateX(${-groundOffset}px)`,
                }}
              />

              {/* Pixel couple */}
              <div className="absolute" style={{ left: 96, top: playerY }}>
                <div className="relative" style={{ width: 48, height: 44 }}>
                  <div className="absolute left-[6px] top-0 h-4 w-4 rounded-sm bg-blue-500" />
                  <div className="absolute left-[26px] top-0 h-4 w-4 rounded-sm bg-rose-500" />
                  <div className="absolute left-[4px] top-4 h-6 w-8 bg-blue-600 rounded-sm" />
                  <div className="absolute left-[24px] top-4 h-6 w-8 bg-rose-600 rounded-sm" />
                  <div className="absolute left-[20px] top-6 h-2 w-8 bg-yellow-300 rounded-sm opacity-80" />
                  <div className="absolute left-[8px] top-10 h-6 w-2 bg-blue-700" />
                  <div className="absolute left-[14px] top-10 h-6 w-2 bg-blue-700" />
                  <div className="absolute left-[28px] top-10 h-6 w-2 bg-rose-700" />
                  <div className="absolute left-[34px] top-10 h-6 w-2 bg-rose-700" />
                </div>
              </div>

              {/* Obstacles */}
              {obstacles.map(o => (
                <div
                  key={o.id}
                  className="absolute bg-stone-700 border border-stone-500 rounded-sm shadow shadow-black/40"
                  style={{ left: o.x, top: o.y, width: o.width, height: o.height }}
                />
              ))}

              {/* Instructions */}
              <div className="absolute top-4 left-4 text-rose-600 text-sm bg-white/70 px-3 py-1 rounded-full">
                Zıplamak için tıkla! 🦘
              </div>
              {hitFlash && (<div className="absolute inset-0 bg-red-400/30" />)}
            </div>
          )}
        </div>

        {/* Game Complete */}
        {gameOver && (
          <div className="text-center">
            <div className="rounded-3xl bg-black/30 backdrop-blur ring-1 ring-rose-300/50 p-8 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] max-w-md mx-auto">
              <h2 className="text-3xl font-display tracking-wide text-rose-400 mb-4">🏁 Oyun Bitti!</h2>
              <p className="text-white/80 mb-2">
                Toplam Skor: <span className="font-bold text-rose-400">{score}</span>
              </p>
              <p className="text-white/80 mb-4">Tekrar dene ve rekoru kır!</p>
              <p className="text-sm text-white/60 mb-6">
                &ldquo;Birlikte yürümek güzeldi!&rdquo; 💖
              </p>
              <button
                onClick={resetGame}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full transition-colors font-medium shadow-sm shadow-rose-500/20"
              >
                Tekrar Oyna 🔄
              </button>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Heart {
  id: number;
  x: number;
  y: number;
  color: 'blue' | 'burgundy';
  speed: number;
}

export default function Game() {
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameComplete, setGameComplete] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const heartIdRef = useRef(0);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setHearts([]);
    setTimeLeft(30);
    setGameComplete(false);
  };

  const stopGame = () => {
    setGameActive(false);
    setHearts([]);
  };

  const restartGame = () => {
    setGameActive(false);
    setGameComplete(false);
    setScore(0);
    setHearts([]);
    setTimeLeft(30);
  };

  // Heart generation
  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      if (gameAreaRef.current) {
        const newHeart: Heart = {
          id: heartIdRef.current++,
          x: Math.random() * (gameAreaRef.current.clientWidth - 40),
          y: -40,
          color: Math.random() > 0.5 ? 'blue' : 'burgundy',
          speed: 2 + Math.random() * 3
        };
        setHearts(prev => [...prev, newHeart]);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [gameActive]);

  // Heart movement
  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      setHearts(prev => {
        const updated = prev.map(heart => ({
          ...heart,
          y: heart.y + heart.speed
        })).filter(heart => heart.y < 600);

        return updated;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [gameActive]);

  // Timer countdown
  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          setGameComplete(true);
          setHearts([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  const catchHeart = (heartId: number, color: 'blue' | 'burgundy') => {
    setHearts(prev => prev.filter(h => h.id !== heartId));
    setScore(prev => prev + 1);
  };

  return (
    <div className="min-h-screen p-4 text-white">

      <div className="relative z-10 p-2 sm:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/game/selection" className="inline-flex items-center gap-2 text-rose-300 hover:text-rose-200 transition-colors">
            ← Oyunlar
          </Link>
          <div className="text-right">
            <div className="text-2xl font-bold">Skor: {score}</div>
            <div className="text-lg font-bold text-rose-400">Süre: {timeLeft}s</div>
            <div className="text-sm text-gray-400">Kalp Toplama Oyunu</div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="text-center mb-8">
          {!gameActive && !gameComplete ? (
            <button
              onClick={startGame}
              className="px-8 py-4 bg-rose-500 hover:bg-rose-600 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-sm shadow-rose-500/30"
            >
              Oyunu Başlat 💖
            </button>
          ) : gameActive ? (
            <button
              onClick={stopGame}
              className="px-8 py-4 bg-white/10 rounded-full text-xl font-bold hover:scale-105 transition-transform"
            >
              Oyunu Durdur ⏸️
            </button>
          ) : gameComplete ? (
            <button
              onClick={restartGame}
              className="px-8 py-4 bg-rose-500 hover:bg-rose-600 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-sm shadow-rose-500/30"
            >
              Tekrar Oyna 🔄
            </button>
          ) : null}
        </div>


        {/* Game Area */}
        <div
          ref={gameAreaRef}
          className="relative w-full h-[600px] rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] overflow-hidden mx-auto max-w-4xl"
          onMouseMove={(e) => {
            if (!gameActive) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if mouse is near any heart
            hearts.forEach(heart => {
              const distance = Math.sqrt((x - heart.x - 20) ** 2 + (y - heart.y - 20) ** 2);
              if (distance < 30) {
                catchHeart(heart.id, heart.color);
              }
            });
          }}
        >
          {/* Hearts */}
          {hearts.map(heart => (
            <div
              key={heart.id}
              className={`absolute w-8 h-8 text-2xl cursor-pointer transition-transform hover:scale-125 ${
                heart.color === 'blue' ? 'text-blue-400' : 'text-red-400'
              }`}
              style={{
                left: heart.x,
                top: heart.y,
              }}
              onClick={() => catchHeart(heart.id, heart.color)}
            >
              💖
            </div>
          ))}

          {/* Instructions */}
          {!gameActive && !gameComplete && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">💖</div>
                <div className="text-xl mb-2">Kalp Toplama Oyunu</div>
                <div className="text-white/70">
                  30 saniyede düşen kalpleri yakala!<br />
                  Mavi ve bordo kalpler seni bekliyor 💙❤️
                </div>
              </div>
            </div>
          )}

          {/* Game Complete */}
          {gameComplete && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🎉</div>
                <div className="text-xl mb-2">Oyun Tamamlandı!</div>
                <div className="text-white/70">
                  Toplam {score} kalp yakaladın!<br />
                  Tebrikler! 💖
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center mt-8 text-white/70">
          <p>💡 Kalplere tıklayarak veya fare ile yakalayarak puan kazan!</p>
          <p className="text-sm mt-2">Mobilde: Kalplere dokun!</p>
        </div>
      </div>
    </div>
  );
}

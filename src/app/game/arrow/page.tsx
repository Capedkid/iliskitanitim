"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";

interface Target {
  id: number;
  x: number;
  y: number;
  type: 'heart' | 'rose' | 'star' | 'diamond';
  points: number;
  size: number;
  hit: boolean;
}

interface Arrow {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  active: boolean;
}

export default function LoveArrowGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [message, setMessage] = useState("");
  const [gameComplete, setGameComplete] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const targetIdRef = useRef(0);
  const arrowIdRef = useRef(0);

  // Romantik mesajlar - useMemo ile optimize et
  const romanticMessages = useMemo(() => [
    "💖 Kalp vurdun!",
    "🌹 Gül hedefi!",
    "⭐ Yıldız gibi!",
    "💎 Elmas değerinde!",
    "🎯 Mükemmel atış!",
    "💕 Aşk oku!",
    "✨ Büyülü!",
    "🔥 Ateşli atış!"
  ], []);

  // Hedef türleri - useMemo ile optimize et
  const targetTypes = useMemo(() => [
    { type: 'heart' as const, emoji: '💖', points: 100, size: 60 },
    { type: 'rose' as const, emoji: '🌹', points: 80, size: 50 },
    { type: 'star' as const, emoji: '⭐', points: 60, size: 45 },
    { type: 'diamond' as const, emoji: '💎', points: 120, size: 55 }
  ], []);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setTargets([]);
    setArrows([]);
    setMessage("");
    setGameComplete(false);
    targetIdRef.current = 0;
    arrowIdRef.current = 0;
  };

  const stopGame = () => {
    setGameActive(false);
    setGameComplete(true);
  };

  // Hedef oluşturma - useCallback ile optimize et
  const createTarget = useCallback(() => {
    if (!gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current;
    const targetType = targetTypes[Math.floor(Math.random() * targetTypes.length)];
    
    const newTarget: Target = {
      id: targetIdRef.current++,
      x: Math.random() * (gameArea.clientWidth - targetType.size),
      y: Math.random() * (gameArea.clientHeight - targetType.size),
      type: targetType.type,
      points: targetType.points,
      size: targetType.size,
      hit: false
    };
    
    setTargets(prev => [...prev, newTarget]);
  }, [targetTypes]);

  // Ok atma
  const shootArrow = (event: React.MouseEvent) => {
    if (!gameActive || !gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current;
    const rect = gameArea.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Ok başlangıç pozisyonu (sol alt köşe)
    const startX = 50;
    const startY = gameArea.clientHeight - 50;
    
    // Açı hesaplama
    const angle = Math.atan2(mouseY - startY, mouseX - startX);
    const speed = 8;
    
    const newArrow: Arrow = {
      id: arrowIdRef.current++,
      x: startX,
      y: startY,
      angle,
      speed,
      active: true
    };
    
    setArrows(prev => [...prev, newArrow]);
  };

  // Ok hareketi
  useEffect(() => {
    if (!gameActive) return;
    
    const moveArrows = () => {
      setArrows(prev => prev.map(arrow => {
        if (!arrow.active) return arrow;
        
        const newX = arrow.x + Math.cos(arrow.angle) * arrow.speed;
        const newY = arrow.y + Math.sin(arrow.angle) * arrow.speed;
        
        // Ekran dışına çıktı mı kontrol et
        if (newX < 0 || newX > (gameAreaRef.current?.clientWidth || 0) || 
            newY < 0 || newY > (gameAreaRef.current?.clientHeight || 0)) {
          return { ...arrow, active: false };
        }
        
        return { ...arrow, x: newX, y: newY };
      }).filter(arrow => arrow.active));
    };
    
    const interval = setInterval(moveArrows, 16); // 60 FPS
    return () => clearInterval(interval);
  }, [gameActive]);

  // Çarpışma kontrolü
  useEffect(() => {
    if (!gameActive) return;
    
    const checkCollisions = () => {
      setArrows(prev => prev.map(arrow => {
        if (!arrow.active) return arrow;
        
        const hitTarget = targets.find(target => 
          !target.hit &&
          arrow.x >= target.x - 10 &&
          arrow.x <= target.x + target.size + 10 &&
          arrow.y >= target.y - 10 &&
          arrow.y <= target.y + target.size + 10
        );
        
        if (hitTarget) {
          // Hedef vuruldu!
          setTargets(prevTargets => prevTargets.map(t => 
            t.id === hitTarget.id ? { ...t, hit: true } : t
          ));
          
          setScore(prev => prev + hitTarget.points);
          
          // Romantik mesaj göster
          const randomMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
          setMessage(randomMessage);
          setTimeout(() => setMessage(""), 2000);
          
          return { ...arrow, active: false };
        }
        
        return arrow;
      }));
    };
    
    const interval = setInterval(checkCollisions, 16);
    return () => clearInterval(interval);
  }, [gameActive, targets, romanticMessages]);

  // Hedef oluşturma
  useEffect(() => {
    if (!gameActive) return;
    
    const interval = setInterval(createTarget, 2000); // Her 2 saniyede bir hedef
    return () => clearInterval(interval);
  }, [gameActive, createTarget]);

  // Zaman sayacı
  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-fuchsia-50 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: "url('/patterns/romance-scatter.svg')",
            backgroundSize: "320px 320px"
          }}
        />
      </div>

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
            <h1 className="font-display text-3xl text-rose-600">Aşk Oku 🏹</h1>
            <p className="text-gray-600">Hedefleri vur ve puan kazan!</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-rose-600">Skor: {score}</div>
            <div className="text-lg text-gray-600">Süre: {timeLeft}s</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex justify-center mb-6">
          {!gameActive ? (
            <div className="text-center">
              <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-display text-rose-600 mb-4">Aşk Oku Oyunu</h2>
                <p className="text-gray-600 mb-6">
                  Romantik hedefleri vur ve puan kazan!<br/>
                  💖 Kalp: 100 puan | 🌹 Gül: 80 puan<br/>
                  ⭐ Yıldız: 60 puan | 💎 Elmas: 120 puan
                </p>
                <button
                  onClick={startGame}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full transition-colors font-medium"
                >
                  Oyunu Başlat 🏹
                </button>
              </div>
            </div>
          ) : (
            <div 
              ref={gameAreaRef}
              className="relative w-full max-w-2xl h-96 bg-white/70 backdrop-blur rounded-2xl shadow-lg overflow-hidden border-2 border-rose-200 cursor-crosshair"
              onClick={shootArrow}
            >
              {/* Targets */}
              {targets.map(target => (
                <div
                  key={target.id}
                  className={`absolute transition-all duration-300 ${
                    target.hit ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}
                  style={{
                    left: target.x,
                    top: target.y,
                    width: target.size,
                    height: target.size,
                    fontSize: target.size * 0.8
                  }}
                >
                  {targetTypes.find(t => t.type === target.type)?.emoji}
                </div>
              ))}

              {/* Arrows */}
              {arrows.map(arrow => (
                <div
                  key={arrow.id}
                  className="absolute text-2xl transition-all duration-100"
                  style={{
                    left: arrow.x,
                    top: arrow.y,
                    transform: `rotate(${arrow.angle * 180 / Math.PI}deg)`
                  }}
                >
                  🏹
                </div>
              ))}

              {/* Crosshair */}
              <div className="absolute bottom-4 left-4 text-rose-600 text-sm">
                Hedeflere tıklayarak ok at! 🎯
              </div>
            </div>
          )}
        </div>

        {/* Game Complete */}
        {gameComplete && (
          <div className="text-center">
            <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <h2 className="text-3xl font-display text-rose-600 mb-4">🎯 Oyun Bitti!</h2>
              <p className="text-gray-600 mb-4">
                Toplam Puan: <span className="font-bold text-rose-600">{score}</span>
              </p>
              <p className="text-sm text-rose-500 mb-6">
                &ldquo;Aşk oku ile hedefleri vurdun!&rdquo; 💖
              </p>
              <button
                onClick={startGame}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full transition-colors font-medium"
              >
                Tekrar Oyna 🔄
              </button>
            </div>
          </div>
        )}

        {/* Message Popup */}
        {message && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl text-center animate-bounce">
              <p className="text-xl font-medium text-rose-600">{message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

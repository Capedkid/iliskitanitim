"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface Character {
  id: 'blue' | 'burgundy';
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  color: string;
  emoji: string;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'rock' | 'gap';
}

interface Heart {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

interface GameState {
  score: number;
  distance: number;
  gameActive: boolean;
  gameComplete: boolean;
  speed: number;
}

export default function WalkingGame() {
  const [characters, setCharacters] = useState<Character[]>([
    { id: 'blue', x: 100, y: 200, width: 40, height: 40, velocityY: 0, isJumping: false, color: '#3b82f6', emoji: '👨' },
    { id: 'burgundy', x: 150, y: 200, width: 40, height: 40, velocityY: 0, isJumping: false, color: '#6b0f1a', emoji: '👩' }
  ]);
  
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    distance: 0,
    gameActive: false,
    gameComplete: false,
    speed: 2
  });
  
  const [message, setMessage] = useState("");
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const obstacleIdRef = useRef(0);
  const heartIdRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);

  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const GROUND_Y = 200;

  // Oyunu başlat
  const startGame = () => {
    setGameState({
      score: 0,
      distance: 0,
      gameActive: true,
      gameComplete: false,
      speed: 2
    });
    setCharacters([
      { id: 'blue', x: 100, y: GROUND_Y, width: 40, height: 40, velocityY: 0, isJumping: false, color: '#3b82f6', emoji: '👨' },
      { id: 'burgundy', x: 150, y: GROUND_Y, width: 40, height: 40, velocityY: 0, isJumping: false, color: '#6b0f1a', emoji: '👩' }
    ]);
    setObstacles([]);
    setHearts([]);
    setMessage("");
    obstacleIdRef.current = 0;
    heartIdRef.current = 0;
  };

  // Oyunu durdur
  const stopGame = () => {
    setGameState(prev => ({ ...prev, gameActive: false, gameComplete: true }));
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  };

  // Zıplama - useCallback ile optimize et
  const jump = useCallback(() => {
    if (!gameState.gameActive) return;
    
    setCharacters(prev => prev.map(char => {
      if (!char.isJumping) {
        return { ...char, velocityY: JUMP_FORCE, isJumping: true };
      }
      return char;
    }));
  }, [gameState.gameActive]);

  // Engel oluştur
  const createObstacle = () => {
    if (!gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current;
    const obstacleType = Math.random() > 0.5 ? 'rock' : 'gap';
    
    const obstacle: Obstacle = {
      id: obstacleIdRef.current++,
      x: gameArea.clientWidth + 50,
      y: obstacleType === 'rock' ? GROUND_Y - 30 : GROUND_Y + 20,
      width: obstacleType === 'rock' ? 30 : 60,
      height: obstacleType === 'rock' ? 30 : 20,
      type: obstacleType
    };
    
    setObstacles(prev => [...prev, obstacle]);
  };

  // Kalp oluştur
  const createHeart = () => {
    if (!gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current;
    
    const heart: Heart = {
      id: heartIdRef.current++,
      x: gameArea.clientWidth + 50,
      y: GROUND_Y - 60,
      collected: false
    };
    
    setHearts(prev => [...prev, heart]);
  };

  // Ana oyun döngüsü
  useEffect(() => {
    if (!gameState.gameActive) return;

    const gameLoop = () => {
      // Karakterleri güncelle
      setCharacters(prev => prev.map(char => {
        let newY = char.y + char.velocityY;
        let newVelocityY = char.velocityY + GRAVITY;
        let newIsJumping = char.isJumping;

        // Yer çekimi ve zıplama
        if (newY >= GROUND_Y) {
          newY = GROUND_Y;
          newVelocityY = 0;
          newIsJumping = false;
        }

        return { ...char, y: newY, velocityY: newVelocityY, isJumping: newIsJumping };
      }));

      // Engelleri hareket ettir
      setObstacles(prev => prev.map(obs => ({
        ...obs,
        x: obs.x - gameState.speed
      })).filter(obs => obs.x > -100));

      // Kalpleri hareket ettir
      setHearts(prev => prev.map(heart => ({
        ...heart,
        x: heart.x - gameState.speed
      })).filter(heart => heart.x > -50));

      // Mesafeyi artır
      setGameState(prev => ({ ...prev, distance: prev.distance + gameState.speed }));

      // Hızı artır (zamanla)
      if (gameState.distance % 1000 === 0) {
        setGameState(prev => ({ ...prev, speed: Math.min(prev.speed + 0.2, 6) }));
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameActive, gameState.speed, gameState.distance]);

  // Çarpışma kontrolü
  useEffect(() => {
    if (!gameState.gameActive) return;

    const checkCollisions = () => {
      characters.forEach(char => {
        // Engel çarpışması
        obstacles.forEach(obstacle => {
          if (char.x < obstacle.x + obstacle.width &&
              char.x + char.width > obstacle.x &&
              char.y < obstacle.y + obstacle.height &&
              char.y + char.height > obstacle.y) {
            stopGame();
            setMessage("💔 Çarptın! Tekrar dene!");
          }
        });

        // Kalp toplama
        hearts.forEach(heart => {
          if (!heart.collected &&
              char.x < heart.x + 30 &&
              char.x + char.width > heart.x &&
              char.y < heart.y + 30 &&
              char.y + char.height > heart.y) {
            
            setHearts(prev => prev.map(h => 
              h.id === heart.id ? { ...h, collected: true } : h
            ));
            
            setGameState(prev => ({ ...prev, score: prev.score + 10 }));
            setMessage("💖 Kalp topladın! +10 puan");
            setTimeout(() => setMessage(""), 1500);
          }
        });
      });
    };

    const interval = setInterval(checkCollisions, 16);
    return () => clearInterval(interval);
  }, [gameState.gameActive, characters, obstacles, hearts]);

  // Engel ve kalp oluşturma
  useEffect(() => {
    if (!gameState.gameActive) return;

    const obstacleInterval = setInterval(createObstacle, 2000);
    const heartInterval = setInterval(createHeart, 3000);

    return () => {
      clearInterval(obstacleInterval);
      clearInterval(heartInterval);
    };
  }, [gameState.gameActive]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

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
            <h1 className="font-display text-3xl text-rose-600">Birlikte Yürüme 🚶‍♂️💖</h1>
            <p className="text-gray-600">İki karakter birlikte koşuyor!</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-rose-600">Skor: {gameState.score}</div>
            <div className="text-lg text-gray-600">Mesafe: {Math.floor(gameState.distance / 10)}m</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex justify-center mb-6">
          {!gameState.gameActive ? (
            <div className="text-center">
              <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-display text-rose-600 mb-4">Birlikte Yürüme</h2>
                <p className="text-gray-600 mb-6">
                  İki karakter birlikte koşuyor!<br/>
                  Engelleri aş, kalpleri topla!<br/>
                  <span className="text-sm">👨 Mavi (Ravy) | 👩 Bordo (Mami)</span>
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  Kontroller: Space/↑ (Zıpla) | Touch (Mobil)
                </div>
                <button
                  onClick={startGame}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full transition-colors font-medium"
                >
                  Oyunu Başlat 🚶‍♂️
                </button>
              </div>
            </div>
          ) : (
            <div 
              ref={gameAreaRef}
              className="relative w-full max-w-2xl h-80 bg-gradient-to-b from-sky-200 to-green-200 rounded-2xl shadow-lg overflow-hidden border-2 border-rose-200"
              onClick={jump}
            >
              {/* Ground */}
              <div className="absolute bottom-0 w-full h-20 bg-green-400"></div>
              
              {/* Characters */}
              {characters.map(char => (
                <div
                  key={char.id}
                  className="absolute text-4xl transition-all duration-100"
                  style={{
                    left: char.x,
                    top: char.y,
                    transform: char.isJumping ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {char.emoji}
                </div>
              ))}

              {/* Obstacles */}
              {obstacles.map(obstacle => (
                <div
                  key={obstacle.id}
                  className={`absolute ${
                    obstacle.type === 'rock' ? 'bg-gray-600 rounded-full' : 'bg-red-500'
                  }`}
                  style={{
                    left: obstacle.x,
                    top: obstacle.y,
                    width: obstacle.width,
                    height: obstacle.height
                  }}
                >
                  {obstacle.type === 'rock' ? '🪨' : ''}
                </div>
              ))}

              {/* Hearts */}
              {hearts.map(heart => (
                <div
                  key={heart.id}
                  className={`absolute text-2xl transition-all duration-300 ${
                    heart.collected ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}
                  style={{
                    left: heart.x,
                    top: heart.y
                  }}
                >
                  💖
                </div>
              ))}

              {/* Instructions */}
              <div className="absolute top-4 left-4 text-rose-600 text-sm bg-white/70 px-3 py-1 rounded-full">
                Zıplamak için tıkla! 🦘
              </div>
            </div>
          )}
        </div>

        {/* Game Complete */}
        {gameState.gameComplete && (
          <div className="text-center">
            <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <h2 className="text-3xl font-display text-rose-600 mb-4">🏁 Oyun Bitti!</h2>
              <p className="text-gray-600 mb-4">
                Toplam Skor: <span className="font-bold text-rose-600">{gameState.score}</span>
              </p>
              <p className="text-gray-600 mb-4">
                Mesafe: <span className="font-bold text-rose-600">{Math.floor(gameState.distance / 10)}m</span>
              </p>
              <p className="text-sm text-rose-500 mb-6">
                &ldquo;Birlikte yürümek güzeldi!&rdquo; 💖
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

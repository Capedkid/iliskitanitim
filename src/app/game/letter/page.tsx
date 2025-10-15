"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface Word {
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
}

interface Sentence {
  id: number;
  template: string;
  missingWord: string;
  options: string[];
  correctAnswer: string;
  translation: string;
}

interface HeartAnimation {
  id: number;
  x: number;
  y: number;
  delay: number;
}

export default function LoveLetterGame() {
  const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameComplete, setGameComplete] = useState(false);
  const [hearts, setHearts] = useState<HeartAnimation[]>([]);
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  
  const heartIdRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Romantik cümleler
  const romanticSentences: Sentence[] = [
    {
      id: 1,
      template: "Seninle her ___ bir hikaye",
      missingWord: "gün",
      options: ["gün", "an", "saniye", "dakika"],
      correctAnswer: "gün",
      translation: "Seninle her gün bir hikaye"
    },
    {
      id: 2,
      template: "Mavinin ___ bordonun tutkusu",
      missingWord: "huzuru",
      options: ["huzuru", "sessizliği", "derinliği", "güzelliği"],
      correctAnswer: "huzuru",
      translation: "Mavinin huzuru bordonun tutkusu"
    },
    {
      id: 3,
      template: "Kalplerin ilk ___",
      missingWord: "kıvılcımı",
      options: ["kıvılcımı", "dokunuşu", "buluşması", "konuşması"],
      correctAnswer: "kıvılcımı",
      translation: "Kalplerin ilk kıvılcımı"
    },
    {
      id: 4,
      template: "Birlikte ___ zaman yavaşlıyor",
      missingWord: "yürürken",
      options: ["yürürken", "konuşurken", "gülerken", "bakarken"],
      correctAnswer: "yürürken",
      translation: "Birlikte yürürken zaman yavaşlıyor"
    },
    {
      id: 5,
      template: "Küçük ___ büyük gülüşler",
      missingWord: "sürprizler",
      options: ["sürprizler", "hediyeler", "anlar", "dokunuşlar"],
      correctAnswer: "sürprizler",
      translation: "Küçük sürprizler büyük gülüşler"
    },
    {
      id: 6,
      template: "Uzak değil sadece ___ adım",
      missingWord: "adım",
      options: ["adım", "bir", "tek", "son"],
      correctAnswer: "adım",
      translation: "Uzak değil sadece adım adım"
    },
    {
      id: 7,
      template: "Seninle her ___ özel",
      missingWord: "an",
      options: ["an", "gün", "saniye", "dakika"],
      correctAnswer: "an",
      translation: "Seninle her an özel"
    },
    {
      id: 8,
      template: "Mavi ve bordo ___ karede",
      missingWord: "aynı",
      options: ["aynı", "tek", "bir", "güzel"],
      correctAnswer: "aynı",
      translation: "Mavi ve bordo aynı karede"
    }
  ];

  // Kalp animasyonu oluştur
  const createHeartAnimation = (x: number, y: number) => {
    const newHeart: HeartAnimation = {
      id: heartIdRef.current++,
      x,
      y,
      delay: 0
    };
    
    setHearts(prev => [...prev, newHeart]);
    
    // 2 saniye sonra kalbi kaldır
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };

  // Oyunu başlat
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setGameComplete(false);
    setMessage("");
    setHearts([]);
    loadNextSentence();
  };

  // Sonraki cümleyi yükle
  const loadNextSentence = () => {
    if (level > romanticSentences.length) {
      setGameComplete(true);
      return;
    }
    
    const sentence = romanticSentences[level - 1];
    setCurrentSentence(sentence);
    
    // Kelime seçeneklerini karıştır
    const shuffledOptions = [...sentence.options].sort(() => Math.random() - 0.5);
    const words: Word[] = shuffledOptions.map((option) => ({
      text: option,
      isCorrect: option === sentence.correctAnswer,
      isSelected: false
    }));
    
    setSelectedWords(words);
  };

  // Kelime seç
  const selectWord = (wordIndex: number) => {
    const word = selectedWords[wordIndex];
    if (word.isSelected) return;
    
    // Kelimeyi seçili yap
    setSelectedWords(prev => prev.map((w, i) => 
      i === wordIndex ? { ...w, isSelected: true } : w
    ));
    
    if (word.isCorrect) {
      // Doğru kelime!
      setScore(prev => prev + 10);
      setMessage("💖 Doğru! +10 puan");
      
      // Kalp animasyonu
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        createHeartAnimation(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );
      }
      
      setTimeout(() => {
        setMessage("");
        setLevel(prev => prev + 1);
        loadNextSentence();
      }, 1500);
    } else {
      // Yanlış kelime
      setMessage("❌ Yanlış! Tekrar dene");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // Oyunu yeniden başlat
  const restartGame = () => {
    setGameStarted(false);
    setGameComplete(false);
    setLevel(1);
    setScore(0);
    setMessage("");
    setHearts([]);
  };

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
            <h1 className="font-display text-3xl text-rose-600">Aşk Mektubu Yazma 💌</h1>
            <p className="text-gray-600">Romantik cümleleri tamamla!</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-rose-600">Skor: {score}</div>
            <div className="text-lg text-gray-600">Seviye: {level}/8</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex justify-center mb-6">
          {!gameStarted ? (
            <div className="text-center">
              <div className="rounded-3xl bg-black/30 backdrop-blur ring-1 ring-rose-300/50 p-8 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
                <h2 className="text-3xl font-display tracking-wide text-rose-400 mb-4">Aşk Mektubu Yazma</h2>
                <p className="text-white/80 mb-6">
                  Romantik cümlelerde eksik kelimeleri tamamla!<br/>
                  Her doğru kelimede kalp animasyonu gör! 💖
                </p>
                <button
                  onClick={startGame}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full transition-colors font-medium shadow-sm shadow-rose-500/20"
                >
                  Oyunu Başlat 💌
                </button>
              </div>
            </div>
          ) : !gameComplete ? (
            <div 
              ref={gameAreaRef}
              className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-8 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] max-w-2xl w-full"
            >
              {/* Current Sentence */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-display text-rose-300 mb-4">Cümleyi Tamamla</h3>
                <div className="text-2xl text-white/90 mb-4 leading-relaxed">
                  {currentSentence?.template.replace('___', '_____')}
                </div>
                <div className="text-sm text-white/60 italic">
                  &ldquo;{currentSentence?.translation}&rdquo;
                </div>
              </div>

              {/* Word Options */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedWords.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => selectWord(index)}
                    disabled={word.isSelected}
                    className={`
                      p-4 rounded-xl text-lg font-medium transition-all duration-300
                      ${word.isSelected 
                        ? word.isCorrect 
                          ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                          : 'bg-red-100 text-red-700 border-2 border-red-300'
                        : 'bg-white/10 hover:bg-white/20 text-white border-2 border-white/10 hover:border-white/20 hover:scale-105'
                      }
                    `}
                  >
                    {word.text}
                  </button>
                ))}
              </div>

              {/* Progress */}
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div 
                  className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(level / 8) * 100}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-white/70">
                İlerleme: {level}/8 cümle
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="rounded-3xl bg-black/30 backdrop-blur ring-1 ring-rose-300/50 p-8 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] max-w-md mx-auto">
                <h2 className="text-3xl font-display tracking-wide text-rose-400 mb-4">🎉 Tebrikler!</h2>
                <p className="text-white/80 mb-4">
                  Tüm romantik cümleleri tamamladın!
                </p>
                <p className="text-lg font-bold text-rose-300 mb-4">
                  Toplam Puan: {score}
                </p>
                <p className="text-sm text-white/60 mb-6">
                  &ldquo;Aşk mektubun hazır!&rdquo; 💌
                </p>
                <button
                  onClick={restartGame}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full transition-colors font-medium shadow-sm shadow-rose-500/20"
                >
                  Tekrar Oyna 🔄
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="rounded-3xl bg-black/60 backdrop-blur ring-1 ring-rose-300/50 p-4 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] text-center animate-bounce">
              <p className="text-xl font-medium text-rose-300">{message}</p>
            </div>
          </div>
        )}

        {/* Heart Animations */}
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="fixed text-4xl animate-ping pointer-events-none z-40"
            style={{
              left: heart.x - 20,
              top: heart.y - 20,
              animationDelay: `${heart.delay}ms`
            }}
          >
            💖
          </div>
        ))}
      </div>
    </div>
  );
}

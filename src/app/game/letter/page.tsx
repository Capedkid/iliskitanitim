"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { dailyNotes } from "@/lib/dailyNotes";

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

  // Günün tarihine göre 10 adet ilham cümlesi seç (deterministik)
  const letterSentences = useMemo(() => {
    const n = dailyNotes.length;
    if (n === 0) return [] as string[];
    const now = new Date();
    // Basit deterministik başlangıç: yıl+ay+gün toplamı mod n
    const start = (now.getFullYear() + (now.getMonth() + 1) + now.getDate()) % n;
    const picked: string[] = [];
    for (let i = 0; i < Math.min(10, n); i++) {
      picked.push(dailyNotes[(start + i) % n]);
    }
    return picked;
  }, []);

  // DailyNotes'tan tam 10 adet benzersiz cümleyi soru haline dönüştür
  const romanticSentences: Sentence[] = useMemo(() => {
    const n = dailyNotes.length;
    if (n === 0) return [];
    const now = new Date();
    const start = (now.getFullYear() + (now.getMonth() + 1) + now.getDate()) % n;
    
    // 10 benzersiz cümle seç (döngüsel olarak)
    const picked: string[] = [];
    const used = new Set<string>();
    let attempts = 0;
    while (picked.length < 10 && attempts < n * 2) {
      const idx = (start + picked.length) % n;
      const sentence = dailyNotes[idx];
      if (!used.has(sentence)) {
        picked.push(sentence);
        used.add(sentence);
      }
      attempts++;
    }

    const fallbackDistractors = ["aşk", "kalp", "gülüş", "bahar", "huzur", "sevgi", "umut", "rüya"];

    const makeQuestion = (sentence: string, idx: number): Sentence => {
      const words = sentence
        .replace(/[.,!?:;…“”"'()\[\]]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
      // En uzun 4+ harfli kelimeyi seç; yoksa ilk kelimeyi kullan
      const candidate = [...words]
        .filter((w) => w.length >= 4)
        .sort((a, b) => b.length - a.length)[0] || words[0] || "aşk";
      const missing = candidate;
      const template = sentence.replace(new RegExp(`\\b${missing}\\b`), "___");

      // Seçenekler: doğru + cümledeki diğer kelimelerden 2-3 tane + fallback
      const pool = Array.from(new Set(words.filter((w) => w.toLowerCase() !== missing.toLowerCase() && w.length >= 3)));
      while (pool.length < 3) {
        const f = fallbackDistractors[Math.floor(Math.random() * fallbackDistractors.length)];
        if (!pool.includes(f) && f.toLowerCase() !== missing.toLowerCase()) pool.push(f);
      }
      const distractors = pool.slice(0, 3);
      const options = [missing, ...distractors].sort(() => Math.random() - 0.5);

      return {
        id: idx + 1,
        template,
        missingWord: missing,
        options,
        correctAnswer: missing,
        translation: sentence,
      };
    };

    return picked.slice(0, 10).map((s, i) => makeQuestion(s, i));
  }, []);

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
    if (level >= romanticSentences.length) {
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
            <div className="text-lg text-gray-600">Seviye: {level}/{romanticSentences.length}</div>
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
                  style={{ width: `${(level / 10) * 100}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-white/70">
                İlerleme: {level}/10 cümle
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

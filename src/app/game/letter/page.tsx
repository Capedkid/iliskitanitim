"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { letterNotes } from "@/lib/letterNotes";

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
  const [answerLock, setAnswerLock] = useState(false);
  
  const heartIdRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Romantik kelime havuzu - cümle dışından seçenekler
  const romanticWords = [
    "aşk", "kalp", "gülüş", "bahar", "huzur", "sevgi", "umut", "rüya", "mutluluk", "güzellik",
    "tutku", "huzur", "sıcaklık", "yakınlık", "bağlılık", "güven", "saygı", "anlayış", "sabır", "hoşgörü",
    "neşe", "coşku", "heyecan", "merak", "ilgi", "dikkat", "özen", "bakım", "koruma", "sahiplenme",
    "paylaşım", "birliktelik", "uyum", "harmoni", "denge", "denklik", "eşitlik", "adalet", "dürüstlük", "samimiyet",
    "içtenlik", "doğallık", "sadelik", "zarafet", "naziklik", "incelik", "hassasiyet", "duyarlılık", "empati", "şefkat",
    "merhamet", "iyilik", "cömertlik", "fedakarlık", "özveri", "vazgeçiş", "terk", "ayrılık", "kavuşma", "buluşma",
    "karşılaşma", "tanışma", "keşfetme", "öğrenme", "gelişme", "ilerleme", "büyüme", "olgunlaşma", "derinleşme", "güçlenme"
  ];

  // Replace first exact word (case-insensitive, Unicode) keeping spaces/punctuation
  function replaceFirstWordWithBlank(sentence: string, targetWord: string): string {
    if (!targetWord) return sentence;
    const tokens = sentence.split(/(\s+)/); // keep spaces
    let replaced = false;
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (!replaced && t.localeCompare(targetWord, undefined, { sensitivity: 'accent' }) === 0) {
        tokens[i] = '___';
        replaced = true;
        break;
      }
    }
    if (replaced) return tokens.join('');
    // Fallback: simple replace ignoring word boundaries
    return sentence.replace(new RegExp(targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '___');
  }

  const makeQuestion = (sentence: string, idx: number): Sentence => {
    const words = sentence
      .replace(/[.,!?:;…""'()\[\]]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    // En uzun 4+ harfli kelimeyi seç; yoksa ilk kelimeyi kullan
    const candidate = [...words]
      .filter((w) => w.length >= 4)
      .sort((a, b) => b.length - a.length)[0] || words[0] || "aşk";
    const missing = candidate;
    const template = replaceFirstWordWithBlank(sentence, missing);

    // Yanlış şıklar: cümle dışından romantik kelimeler
    const usedWords = new Set(words.map(w => w.toLowerCase()));
    const availableDistractors = romanticWords.filter(word => 
      !usedWords.has(word.toLowerCase()) && 
      word.toLowerCase() !== missing.toLowerCase() &&
      word.length >= 3
    );
    
    // 3 yanlış şık seç
    const shuffledDistractors = [...availableDistractors].sort(() => Math.random() - 0.5);
    const distractors = shuffledDistractors.slice(0, 3);
    
    // Eğer yeterli distractor yoksa, genel kelimeler ekle
    while (distractors.length < 3) {
      const generalWords = ["zaman", "mekan", "an", "gün", "gece", "sabah", "akşam", "yıl", "ay", "hafta"];
      const randomWord = generalWords[Math.floor(Math.random() * generalWords.length)];
      if (!distractors.includes(randomWord) && !usedWords.has(randomWord.toLowerCase())) {
        distractors.push(randomWord);
      }
    }
    
    const options = [missing, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5);

    return {
      id: idx + 1,
      template,
      missingWord: missing,
      options,
      correctAnswer: missing,
      translation: sentence,
    };
  };

  // LetterNotes'tan rastgele 10 adet benzersiz cümleyi soru haline dönüştür
  const generateQuestions = (): Sentence[] => {
    const n = letterNotes.length;
    if (n === 0) return [];
    
    // Session'da kullanılan cümleleri al
    const sessionKey = 'letterGame_usedSentences';
    const usedInSession = JSON.parse(sessionStorage.getItem(sessionKey) || '[]') as string[];
    
    // Kullanılmamış cümleleri filtrele ve havuzu tekilleştir
    const availableSentences = letterNotes.filter(sentence => !usedInSession.includes(sentence));
    const uniqueAvailable = Array.from(new Set(availableSentences));
    
    // Eğer kullanılmamış cümle 10'dan azsa, session'ı sıfırla ve tekilleştir
    if (uniqueAvailable.length < 10) {
      sessionStorage.removeItem(sessionKey);
      const uniqueAll = Array.from(new Set(letterNotes));
      const shuffledAll = [...uniqueAll].sort(() => Math.random() - 0.5);
      const pickedAll = shuffledAll.slice(0, 10);
      // Yeni kullanılan cümleleri session'a kaydet
      sessionStorage.setItem(sessionKey, JSON.stringify(pickedAll));
      return pickedAll.map((s, i) => makeQuestion(s, i));
    }
    
    // Rastgele 10 benzersiz cümle seç (session'dan hariç + tekil)
    const shuffled = [...uniqueAvailable].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 10);
    
    // Yeni kullanılan cümleleri session'a ekle
    const newUsedSentences = [...usedInSession, ...picked];
    sessionStorage.setItem(sessionKey, JSON.stringify(newUsedSentences));

    return picked.map((s, i) => makeQuestion(s, i));
  };

  const [romanticSentences, setRomanticSentences] = useState<Sentence[]>([]);

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
    const newQuestions = generateQuestions();
    // Initialize first question immediately to avoid early game-over
    const firstSentence = newQuestions[0];
    const shuffledOptions = firstSentence ? [...firstSentence.options].sort(() => Math.random() - 0.5) : [];
    const words: Word[] = shuffledOptions.map((option) => ({
      text: option,
      isCorrect: option === (firstSentence?.correctAnswer ?? ""),
      isSelected: false,
    }));

    setRomanticSentences(newQuestions);
    setCurrentSentence(firstSentence ?? null);
    setSelectedWords(words);

    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setGameComplete(false);
    setMessage("");
    setHearts([]);
    setAnswerLock(false);
  };

  // Sonraki cümleyi yükle
  const loadNextSentence = (currentLevel?: number) => {
    const targetLevel = currentLevel ?? level;
    if (targetLevel > romanticSentences.length) {
      setGameComplete(true);
      return;
    }
    const sentence = romanticSentences[targetLevel - 1];
    setCurrentSentence(sentence);
    const shuffledOptions = [...sentence.options].sort(() => Math.random() - 0.5);
    const words: Word[] = shuffledOptions.map((option) => ({
      text: option,
      isCorrect: option === sentence.correctAnswer,
      isSelected: false,
    }));
    setSelectedWords(words);
    setAnswerLock(false);
  };

  // Kelime seç
  const selectWord = (wordIndex: number) => {
    if (answerLock) return;
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
      setAnswerLock(true);
      
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
        setLevel(prev => {
          const newLevel = prev + 1;
          // loadNextSentence'ı yeni level ile çağır
          setTimeout(() => {
            loadNextSentence(newLevel);
          }, 0);
          return newLevel;
        });
      }, 1500);
    } else {
      // Yanlış kelime - skor alınamadan sonraki soruya geç
      setMessage("❌ Yanlış cevap");
      setAnswerLock(true);
      setTimeout(() => {
        setMessage("");
        setLevel(prev => {
          const newLevel = prev + 1;
          // Sonraki soruyu yeni level ile yükle
          setTimeout(() => {
            loadNextSentence(newLevel);
          }, 0);
          return newLevel;
        });
      }, 1500);
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
                {/* Tam cümle ipucu kaldırıldı */}
              </div>

              {/* Word Options */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedWords.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => selectWord(index)}
                    disabled={answerLock || word.isSelected}
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

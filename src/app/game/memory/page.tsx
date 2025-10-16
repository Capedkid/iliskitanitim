"use client";

import { useState, useEffect } from "react";
import { dailyNotes } from "@/lib/dailyNotes";
import Link from "next/link";

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  pairId: number;
}

interface Quote {
  text: string;
  author: string;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showQuote, setShowQuote] = useState<Quote | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // dailyNotes içinden 8 benzersiz not seç
  const romanticQuotes: Quote[] = (() => {
    const pool = Array.from(new Set(dailyNotes));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 8);
    return picked.map(text => ({ text, author: "Bugünün Notları" }));
  })();

  // Oyun kartları (4x4 = 16 kart, 8 çift)
  const cardContents = [
    "💙", "❤️", "🌹", "💕", "🎵", "✨", "💖", "🌟"
  ];

  const initializeGame = () => {
    const newCards: Card[] = [];
    let id = 0;
    
    // Her içerikten 2 kart oluştur (çiftler için)
    cardContents.forEach((content, index) => {
      for (let i = 0; i < 2; i++) {
        newCards.push({
          id: id++,
          content,
          isFlipped: false,
          isMatched: false,
          pairId: index
        });
      }
    });

    // Kartları karıştır
    const shuffledCards = newCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
    setShowQuote(null);
    setGameStarted(true);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2 || gameComplete) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Kartı çevir
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    // 2 kart çevrildi mi kontrol et
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Eşleşme bulundu!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
          
          // Romantik quote göster
          const randomQuote = romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)];
          setShowQuote(randomQuote);
          setTimeout(() => setShowQuote(null), 2000);
        }, 500);
      } else {
        // Eşleşme yok, kartları geri çevir
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Oyun tamamlandı mı kontrol et
  useEffect(() => {
    if (matches === 8 && gameStarted) {
      setGameComplete(true);
    }
  }, [matches, gameStarted]);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/game" 
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors mb-4"
          >
            ← Geri Dön
          </Link>
          <h1 className="font-display text-4xl text-rose-600 mb-2">Mavi & Bordo Eşleştirme</h1>
          <p className="text-gray-600">Çiftleri bul ve romantik mesajları keşfet! 💖</p>
        </div>

        {/* Game Stats */}
        {gameStarted && (
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-600">{moves}</div>
              <div className="text-sm text-gray-600">Hamle</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-600">{matches}/8</div>
              <div className="text-sm text-gray-600">Eşleşme</div>
            </div>
          </div>
        )}

        {/* Game Board */}
        <div className="flex justify-center mb-8">
          {!gameStarted ? (
            <div className="text-center">
              <div className="rounded-3xl bg-black/30 backdrop-blur ring-1 ring-rose-300/50 p-8 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
                <h2 className="text-3xl font-display tracking-wide text-rose-400 mb-4">Oyunu Başlat</h2>
                <p className="text-white/80 mb-6">8 çifti bul ve romantik mesajları keşfet!</p>
                <button
                  onClick={initializeGame}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full transition-colors font-medium shadow-sm shadow-rose-500/20"
                >
                  Oyunu Başlat 💖
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 max-w-md">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`
                    w-16 h-16 rounded-xl relative transition-all duration-300
                    ${card.isMatched ? 'ring-2 ring-rose-400 shadow-[0_0_20px_rgba(235,80,120,0.45)]' : ''}
                    ${!card.isMatched ? 'hover:scale-105' : ''}
                  `}
                  disabled={card.isMatched || flippedCards.length >= 2}
                >
                  <div className="w-full h-full [perspective:800px]">
                    <div
                      className="w-full h-full rounded-xl relative [transform-style:preserve-3d] transition-transform duration-500 ease-out"
                      style={{ transform: (card.isFlipped || card.isMatched) ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    >
                      {/* Front face */}
                      <div
                        className={`absolute inset-0 rounded-xl flex items-center justify-center text-2xl font-bold
                          bg-rose-200 shadow-md
                          [backface-visibility:hidden]
                        `}
                      >
                        ?
                      </div>
                      {/* Back face */}
                      <div
                        className={`absolute inset-0 rounded-xl flex items-center justify-center text-2xl font-bold
                          bg-white shadow-lg
                          [backface-visibility:hidden]
                        `}
                        style={{ transform: 'rotateY(180deg)' }}
                      >
                        {card.content}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Game Complete */}
        {gameComplete && (
          <div className="text-center">
            <div className="rounded-3xl bg-black/30 backdrop-blur ring-1 ring-rose-300/50 p-8 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] max-w-md mx-auto">
              <h2 className="text-3xl font-display tracking-wide text-rose-400 mb-4">🎉 Tebrikler!</h2>
              <p className="text-white/80 mb-4">
                Tüm çiftleri {moves} hamlede buldun!
              </p>
              <p className="text-sm text-white/60 mb-6">
                &ldquo;Seninle her gün bir hikaye&rdquo; 💖
              </p>
              <button
                onClick={initializeGame}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full transition-colors font-medium shadow-sm shadow-rose-500/20"
              >
                Tekrar Oyna 🔄
              </button>
            </div>
          </div>
        )}

        {/* Romantic Quote Popup */}
        {showQuote && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="rounded-3xl bg-black/60 backdrop-blur ring-1 ring-rose-300/50 p-6 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] max-w-sm mx-4 text-center">
              <div className="text-4xl mb-3">💖</div>
              <p className="text-lg font-medium text-rose-300 mb-2">
                &ldquo;{showQuote.text}&rdquo;
              </p>
              {/* Author/sous-legend removed as requested */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

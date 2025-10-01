"use client";

import Link from "next/link";

export default function GameSelection() {
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
        <div className="text-center mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors mb-6"
          >
            ← Ana Sayfaya Dön
          </Link>
          <h1 className="font-display text-5xl text-rose-600 mb-4">Oyunlar 💖</h1>
          <p className="text-gray-600 text-lg">Romantik oyunlarımızla eğlenin!</p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Kalp Toplama Oyunu */}
          <Link 
            href="/game/hearts" 
            className="group bg-white/70 backdrop-blur rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">💖</div>
            <h2 className="text-2xl font-display text-rose-600 mb-3">Kalp Toplama</h2>
            <p className="text-gray-600 mb-4">
              Düşen kalpleri yakala ve puan kazan! Mavi ve bordo kalplerle romantik mesajlar keşfet.
            </p>
            <div className="inline-flex items-center gap-2 text-rose-500 font-medium">
              Oyna →
            </div>
          </Link>

          {/* Memory Oyunu */}
          <Link 
            href="/game/memory" 
            className="group bg-white/70 backdrop-blur rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🧠</div>
            <h2 className="text-2xl font-display text-rose-600 mb-3">Mavi & Bordo Eşleştirme</h2>
            <p className="text-gray-600 mb-4">
              Çiftleri bul ve romantik mesajları keşfet! Hafıza oyunu ile aşkınızı test edin.
            </p>
            <div className="inline-flex items-center gap-2 text-rose-500 font-medium">
              Oyna →
            </div>
          </Link>

          {/* Aşk Oku Oyunu */}
          <Link 
            href="/game/arrow" 
            className="group bg-white/70 backdrop-blur rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🏹</div>
            <h2 className="text-2xl font-display text-rose-600 mb-3">Aşk Oku</h2>
            <p className="text-gray-600 mb-4">
              Romantik hedefleri vur ve puan kazan! Okçuluk oyunu ile aşkınızı hedefle.
            </p>
            <div className="inline-flex items-center gap-2 text-rose-500 font-medium">
              Oyna →
            </div>
          </Link>

          {/* Aşk Mektubu Yazma Oyunu */}
          <Link 
            href="/game/letter" 
            className="group bg-white/70 backdrop-blur rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">💌</div>
            <h2 className="text-2xl font-display text-rose-600 mb-3">Aşk Mektubu Yazma</h2>
            <p className="text-gray-600 mb-4">
              Romantik cümleleri tamamla! Kelime oyunu ile aşk mektubunuzu yazın.
            </p>
            <div className="inline-flex items-center gap-2 text-rose-500 font-medium">
              Oyna →
            </div>
          </Link>

          {/* Birlikte Yürüme Oyunu */}
          <Link 
            href="/game/walking" 
            className="group bg-white/70 backdrop-blur rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🚶‍♂️</div>
            <h2 className="text-2xl font-display text-rose-600 mb-3">Birlikte Yürüme</h2>
            <p className="text-gray-600 mb-4">
              İki karakter birlikte koşuyor! Platform oyunu ile engelleri aşın.
            </p>
            <div className="inline-flex items-center gap-2 text-rose-500 font-medium">
              Oyna →
            </div>
          </Link>
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-display text-rose-600 mb-4">Yakında Gelecek Oyunlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/50 backdrop-blur rounded-2xl p-6 opacity-60">
              <div className="text-4xl mb-2">🎨</div>
              <h4 className="font-medium text-rose-600">Renk Eşleştirme</h4>
              <p className="text-sm text-gray-500">Renkli puzzle oyunu</p>
            </div>
            <div className="bg-white/50 backdrop-blur rounded-2xl p-6 opacity-60">
              <div className="text-4xl mb-2">🎵</div>
              <h4 className="font-medium text-rose-600">Müzik Puzzle</h4>
              <p className="text-sm text-gray-500">Nota eşleştirme oyunu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

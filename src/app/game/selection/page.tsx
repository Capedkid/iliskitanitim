"use client";

import Link from "next/link";

function HeartDivider() {
  return (
    <div className="relative mx-auto h-[1px] w-full max-w-[560px] bg-rose-100/70">
      <div className="absolute left-1/2 -top-3 -translate-x-1/2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 shadow-sm ring-1 ring-rose-300/40">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 21s-6.716-4.507-9.192-7.4C.948 11.51 1.2 7.7 4.32 6.34 6.4 5.4 8.3 6.1 9.4 7.2L12 9.8l2.6-2.6c1.1-1.1 3-1.8 5.08-.86 3.12 1.36 3.37 5.17 1.51 7.26C18.716 16.493 12 21 12 21z" fill="currentColor" className="text-rose-500" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default function GameSelection() {
  return (
    <div className="min-h-screen">
      {/* Ana sayfadaki gibi arka plan zaten globals.css'de tanımlı */}

      <div className="relative z-10">
        {/* Header - Ana sayfa gibi */}
        <header className="px-6 sm:px-10 py-6 flex items-center justify-between">
          <div className="font-display text-xl sm:text-2xl tracking-wide">
            <span className="text-ours-blue">R</span>avy <span className="text-ours-burgundy">&</span> <span className="text-black">M</span>ami
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="/" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Ana Sayfa
            </Link>
            <Link href="/gallery" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Galeri
            </Link>
            <Link href="/messages" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Mesajlar
            </Link>
            <Link href="/special-days" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Özel Günler
            </Link>
          </nav>
        </header>

        {/* Page Title Section */}
        <section className="px-6 sm:px-10 pt-10 pb-16 sm:pt-16 sm:pb-24">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="font-display text-[40px] leading-[1.08] sm:text-[56px] md:text-[64px] tracking-tight">
              Oyunlar
              <br />
              <span className="text-rose-600">💖</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-black/70 dark:text-white/80 max-w-prose leading-relaxed mx-auto">
              Romantik oyunlarımızla eğlenin! Mavinin huzuru ve bordonun tutkusu
              oyunlarda bir araya geliyor. Her oyun bir macera, her an bir eğlence.
            </p>
            <div className="mt-6 text-sm text-black/60 dark:text-white/60">
              5 oyun mevcut
            </div>
          </div>
          <div className="mt-10">
            <HeartDivider />
          </div>
        </section>

        <main className="px-6 sm:px-10 pb-10">
          <div className="max-w-6xl mx-auto">
            {/* Game Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Kalp Toplama Oyunu */}
              <Link 
                href="/game/hearts" 
                className="group rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] text-center"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">💖</div>
                <h2 className="text-2xl font-display tracking-wide text-white mb-3">Kalp Toplama</h2>
                <p className="text-white/80 mb-4">
                  Düşen kalpleri yakala ve puan kazan! Mavi ve bordo kalplerle romantik mesajlar keşfet.
                </p>
                <div className="inline-flex items-center gap-2 text-rose-400 font-medium">
                  Oyna →
                </div>
              </Link>

              {/* Memory Oyunu */}
              <Link 
                href="/game/memory" 
                className="group rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] text-center"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🧠</div>
                <h2 className="text-2xl font-display tracking-wide text-white mb-3">Mavi & Bordo Eşleştirme</h2>
                <p className="text-white/80 mb-4">
                  Çiftleri bul ve romantik mesajları keşfet! Hafıza oyunu ile aşkınızı test edin.
                </p>
                <div className="inline-flex items-center gap-2 text-rose-400 font-medium">
                  Oyna →
                </div>
              </Link>

              {/* Aşk Oku Oyunu */}
              <Link 
                href="/game/arrow" 
                className="group rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] text-center"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🏹</div>
                <h2 className="text-2xl font-display tracking-wide text-white mb-3">Aşk Oku</h2>
                <p className="text-white/80 mb-4">
                  Romantik hedefleri vur ve puan kazan! Okçuluk oyunu ile aşkınızı hedefle.
                </p>
                <div className="inline-flex items-center gap-2 text-rose-400 font-medium">
                  Oyna →
                </div>
              </Link>

              {/* Aşk Mektubu Yazma Oyunu */}
              <Link 
                href="/game/letter" 
                className="group rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] text-center"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">💌</div>
                <h2 className="text-2xl font-display tracking-wide text-white mb-3">Aşk Mektubu Yazma</h2>
                <p className="text-white/80 mb-4">
                  Romantik cümleleri tamamla! Kelime oyunu ile aşk mektubunuzu yazın.
                </p>
                <div className="inline-flex items-center gap-2 text-rose-400 font-medium">
                  Oyna →
                </div>
              </Link>

              {/* Birlikte Yürüme Oyunu */}
              <Link 
                href="/game/walking" 
                className="group rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] text-center"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🚶‍♂️</div>
                <h2 className="text-2xl font-display tracking-wide text-white mb-3">Birlikte Yürüme</h2>
                <p className="text-white/80 mb-4">
                  İki karakter birlikte koşuyor! Platform oyunu ile engelleri aşın.
                </p>
                <div className="inline-flex items-center gap-2 text-rose-400 font-medium">
                  Oyna →
                </div>
              </Link>
            </div>

            {/* Coming Soon */}
            <div className="mt-12 text-center">
              <h3 className="text-xl font-display tracking-wide text-white mb-4">Yakında Gelecek Oyunlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/30 p-6 opacity-60">
                  <div className="text-4xl mb-2">🎨</div>
                  <h4 className="font-display text-lg tracking-wide text-white">Renk Eşleştirme</h4>
                  <p className="text-sm text-white/60">Renkli puzzle oyunu</p>
                </div>
                <div className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/30 p-6 opacity-60">
                  <div className="text-4xl mb-2">🎵</div>
                  <h4 className="font-display text-lg tracking-wide text-white">Müzik Puzzle</h4>
                  <p className="text-sm text-white/60">Nota eşleştirme oyunu</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer - Ana sayfa gibi */}
        <footer className="px-6 sm:px-10 pb-10 text-center text-sm text-black/60">
          <p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-rose-600 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Yukarı dön
            </button>
            <span className="mx-2">·</span>
            <span>
              <span className="text-ours-blue">Mavi</span> & <span className="text-ours-burgundy">Bordo</span> ile yazıldı.
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}

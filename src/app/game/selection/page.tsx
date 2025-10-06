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
              Romantik oyunlarımız :)
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
          <div className="max-w-4xl mx-auto text-center">
            <div className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-12">
              <div className="text-8xl mb-6">🚧</div>
              <h2 className="text-3xl font-display tracking-wide text-white mb-4">Yapım Aşamasında</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Romantik oyunlarımız henüz tamamen bitmedi 
                <br />
                Bitince oynayacağız bitanem :) 💖
              </p>
              <div className="inline-flex items-center gap-2 text-rose-400 font-medium">
                Yakında gelecek →
              </div>
            </div>
          </div>
        </main>

        <footer className="px-6 sm:px-10 pb-10 text-center text-sm">
          <div className="mx-auto max-w-5xl">
            <div className="mt-8">
              <HeartDivider />
            </div>
            <div className="mt-6 rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/40 p-6">
              <p className="text-white/80">&ldquo;Kalbin kalbime değdiğinde, dünya sessizleşir.&rdquo;</p>
              <div className="mt-3 text-white/60">
                <Link href="/" className="hover:text-rose-300 transition-colors">Ana Sayfa</Link>
                <span className="mx-2">·</span>
                <Link href="/gallery" className="hover:text-rose-300 transition-colors">Galeri</Link>
                <span className="mx-2">·</span>
                <Link href="/messages" className="hover:text-rose-300 transition-colors">Mesajlar</Link>
                <span className="mx-2">·</span>
                <Link href="/special-days" className="hover:text-rose-300 transition-colors">Özel Günler</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

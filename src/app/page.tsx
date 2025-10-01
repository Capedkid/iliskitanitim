"use client";

import { useState, useRef } from "react";

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

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState(false);

  const onTogglePlay = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Ensure the element has a loaded source
        if (audioRef.current.readyState < 2) {
          audioRef.current.load();
        }
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio play error", err);
      alert("Şarkı çalınamadı. Dosya formatını veya yolu kontrol edin.");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="px-6 sm:px-10 py-6 flex items-center justify-between">
        <div className="font-display text-xl sm:text-2xl tracking-wide">
          <span className="text-ours-blue">R</span>avy <span className="text-ours-burgundy">&</span> Mami
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <a className="hover:text-rose-600 transition-colors" href="#story">Hikayemiz</a>
          <a className="hover:text-rose-600 transition-colors" href="#memories">Anılar</a>
          <a className="hover:text-rose-600 transition-colors" href="#daily-note">Bugünün Notu</a>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 sm:px-10 pt-10 pb-16 sm:pt-16 sm:pb-24">
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="font-display text-[40px] leading-[1.1] sm:text-[56px] md:text-[64px]">
                Seninle Her Gün
                <br />
                <span className="text-rose-600">Bir Hikaye</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-black/70 dark:text-white/80 max-w-prose">
                Bu sayfa, mavinin huzurunu ve bordonun tutkusunu bir araya getiriyor.
                Anılar, notlar ve şarkılarla dolu küçük bir evimiz olsun.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="#memories" className="inline-flex items-center justify-center rounded-full px-5 py-3 bg-rose-500 text-white shadow-sm shadow-rose-500/30 hover:bg-rose-600 transition-colors">
                  Anılara Bakalım
                </a>
                <button onClick={onTogglePlay} className="inline-flex items-center justify-center rounded-full px-5 py-3 ring-1 ring-black/10 dark:ring-white/10 bg-white/70 backdrop-blur hover:bg-white/90 transition-colors">
                  {isPlaying ? "Müziği Durdur" : "Şarkımızı Çal"}
                </button>
              </div>

              <div className="mt-3 text-xs text-black/60 dark:text-white/60">
                Gökhan Türkmen — Mavi
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl ring-1 ring-rose-300/50 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
                <div className="aspect-[4/3] sm:aspect-[5/3] bg-rose-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/hero-sample.svg" alt="Romantik örnek görsel" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-ours-blue/15 blur-2xl" />
              <div className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-ours-burgundy/20 blur-2xl" />
            </div>
          </div>

          <div className="mt-10">
            <HeartDivider />
          </div>
        </section>

        {/* Featured placeholders */}
        <section id="memories" className="px-6 sm:px-10 pb-16">
          <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl bg-white/70 ring-1 ring-rose-100/80 backdrop-blur p-5 hover:shadow-lg hover:shadow-rose-500/10 transition-all">
                <div className="h-40 rounded-xl bg-gradient-to-br from-rose-50 via-white to-rose-100 ring-1 ring-rose-100" />
                <h3 className="mt-4 font-display text-xl tracking-wide">Anı Başlığı</h3>
                <p className="text-sm text-black/70">Kısa bir açıklama…</p>
                <span className="absolute right-4 top-4 text-xs text-ours-blue">{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section id="story" className="px-6 sm:px-10 pb-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-3xl sm:text-4xl mb-8">Hikayemiz</h2>
            <ol className="relative border-s border-rose-100">
              {[
                { title: "İlk Mesaj", desc: "Kalplerin ilk kıvılcımı." },
                { title: "İlk Buluşma", desc: "Mavinin huzuru, bordonun sıcaklığı." },
                { title: "Özel Gün", desc: "Küçük sürprizler, büyük gülüşler." },
                { title: "Birlikte Hayaller", desc: "Uzak değil, sadece adım adım." },
              ].map((item, idx) => (
                <li key={idx} className="ms-4 py-4">
                  <div className="absolute w-2 h-2 rounded-full bg-rose-500 -start-1.5 mt-2 shadow-[0_0_0_4px_rgba(255,143,163,0.25)]" />
                  <div className="rounded-xl bg-white/70 backdrop-blur ring-1 ring-rose-100 p-4 transition-transform duration-300 hover:-translate-y-0.5">
                    <h3 className="font-display text-lg">{item.title}</h3>
                    <p className="text-sm text-black/70">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Daily Note */}
        <section id="daily-note" className="px-6 sm:px-10 pb-24">
          <div className="mx-auto max-w-3xl rounded-2xl bg-white/70 backdrop-blur ring-1 ring-rose-100 p-6">
            <h2 className="font-display text-2xl mb-3">Bugünün Notu</h2>
            <p className="text-black/80" id="daily-note-text">
              Güne senin sesinle başlamak, günün en güzel kısmı.
            </p>
            <div className="mt-4">
              <button
                className="inline-flex items-center justify-center rounded-full px-4 py-2 ring-1 ring-black/10 bg-white/80 hover:bg-white/95 transition-colors text-sm"
                onClick={async () => {
                  const text = document.getElementById("daily-note-text")?.textContent || "";
                  try {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch (e) {
                    console.error("Clipboard failed", e);
                  }
                }}
              >
                {copied ? "Kopyalandı ✓" : "Kopyala"}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 sm:px-10 pb-10 text-center text-sm text-black/60">
        <p>
          <a href="#" className="hover:text-rose-600 transition-colors">Yukarı dön</a>
          <span className="mx-2">·</span>
          <span>
            <span className="text-ours-blue">Mavi</span> & <span className="text-ours-burgundy">Bordo</span> ile yazıldı.
          </span>
        </p>
      </footer>

      <audio
        ref={audioRef}
        preload="none"
        onError={() => {
          console.error("Audio element failed to load source /audio/mavi.mp3");
          alert("Ses dosyası yüklenemedi. /audio/mavi.mp3 yolunu ve formatı kontrol edin.");
        }}
        onCanPlay={() => {
          // Optional: could auto-play after first user gesture via button
        }}
      >
        <source src="/audio/mavi.mp3" type="audio/mpeg" />
        {/* Uncomment to add an OGG fallback if you have it */}
        {/* <source src="/audio/mavi.ogg" type="audio/ogg" /> */}
      </audio>
    </div>
  );
}

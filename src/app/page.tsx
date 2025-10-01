"use client";

import { useState, useRef, useEffect } from "react";
import Lightbox from "@/components/Lightbox";
import MiniPlayer from "@/components/MiniPlayer";

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
  const memoryImages = [
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop",
  ];
  const memoryCaptions = [
    "İlk gün — gülüşün her şeyi başlattı",
    "Birlikte yürürken zaman yavaşlıyor",
    "Mavi ve bordo aynı karede",
  ];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);

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

  // Observe sections to update active nav link
  const sectionsRef = useRef<{ id: string; el: HTMLElement | null }[]>([]);
  sectionsRef.current = [
    { id: "memories", el: typeof document !== "undefined" ? document.getElementById("memories") : null },
    { id: "story", el: typeof document !== "undefined" ? document.getElementById("story") : null },
    { id: "daily-note", el: typeof document !== "undefined" ? document.getElementById("daily-note") : null },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && visible.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    );
    sectionsRef.current.forEach((s) => s.el && observer.observe(s.el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="px-6 sm:px-10 py-6 flex items-center justify-between">
        <div className="font-display text-xl sm:text-2xl tracking-wide">
          <span className="text-ours-blue">R</span>avy <span className="text-ours-burgundy">&</span> <span className="text-black">M</span>ami
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <a className={`transition-colors ${activeId === "story" ? "text-rose-600" : "hover:text-rose-600"}`} href="#story">Hikayemiz</a>
          <a className={`transition-colors ${activeId === "memories" ? "text-rose-600" : "hover:text-rose-600"}`} href="#memories">Anılar</a>
          <a className={`transition-colors ${activeId === "daily-note" ? "text-rose-600" : "hover:text-rose-600"}`} href="#daily-note">Bugünün Notu</a>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 sm:px-10 pt-10 pb-16 sm:pt-16 sm:pb-24">
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="font-display text-[40px] leading-[1.08] sm:text-[56px] md:text-[64px] tracking-tight">
                Seninle Her Gün
                <br />
                <span className="text-rose-600">Bir Hikaye</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-black/70 dark:text-white/80 max-w-prose leading-relaxed">
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
              <ParallaxHeroImage />
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
            {memoryImages.map((src, i) => (
              <div className="group">
                <button
                  key={i}
                  onClick={() => {
                    setLightboxIndex(i);
                    setLightboxOpen(true);
                  }}
                  className="relative overflow-hidden rounded-3xl ring-1 ring-rose-300/50 hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] hover:-translate-y-1 transition-all duration-300 w-full"
                >
                  <div className="aspect-[4/3] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={src} 
                      alt={`Anı ${i + 1}`} 
                      className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                    />
                    {/* Overlay gradient like hero */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-50/20 via-white/5 to-rose-100/20" />
                    {/* Subtle grain */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "3px 3px", color: "#000" }} />
                    {/* Number badge */}
                    <span className="absolute right-4 top-4 text-xs text-white/90 bg-black/40 px-2 py-1 rounded-full backdrop-blur">{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                  </div>
                </button>
                <h3 className="mt-3 font-display text-xl tracking-wide text-white text-center">Anı {i + 1}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section id="story" className="px-6 sm:px-10 pb-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-3xl sm:text-4xl mb-10 tracking-tight">Hikayemiz</h2>
            <ol className="relative border-s border-rose-100">
              {[
                { title: "İlk Mesaj", desc: "Kalplerin ilk kıvılcımı." },
                { title: "İlk Buluşma", desc: "Mavinin huzuru, bordonun sıcaklığı." },
                { title: "Özel Gün", desc: "Küçük sürprizler, büyük gülüşler." },
                { title: "Birlikte Hayaller", desc: "Uzak değil, sadece adım adım." },
              ].map((item, idx) => (
                <li key={idx} className="ms-4 py-4">
                  <div className="absolute w-2 h-2 rounded-full bg-rose-500 -start-1.5 mt-2 shadow-[0_0_0_4px_rgba(255,143,163,0.25)]" />
                  <div className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
                    <h3 className="font-display text-lg tracking-wide text-white">{item.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed mt-2">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Daily Note */}
        <section id="daily-note" className="px-6 sm:px-10 pb-24">
          <div className="mx-auto max-w-3xl rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-8 hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] transition-all duration-300">
            <h2 className="font-display text-2xl mb-4 tracking-tight text-white">Bugünün Notu</h2>
            <p className="text-white/80 leading-relaxed text-lg" id="daily-note-text">
              Güne senin sesinle başlamak, günün en güzel kısmı.
            </p>
            <div className="mt-6">
              <button
                className="inline-flex items-center justify-center rounded-full px-5 py-3 ring-1 ring-white/20 bg-white/10 hover:bg-white/20 hover:ring-white/30 transition-all duration-300 text-sm font-medium text-white"
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

      <MiniPlayer getAudio={() => audioRef.current} />

      <Lightbox
        isOpen={lightboxOpen}
        images={memoryImages}
        captions={memoryCaptions}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((i) => (i - 1 + memoryImages.length) % memoryImages.length)}
        onNext={() => setLightboxIndex((i) => (i + 1) % memoryImages.length)}
      />
    </div>
  );
}

function ParallaxHeroImage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // respect reduced motion
    const onScroll = () => {
      if (!containerRef.current || !imgRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      const mid = (rect.top + rect.bottom) / 2;
      const centerOffset = (mid - window.innerHeight / 2) / window.innerHeight; // -0.5..0.5
      const translate = Math.max(-10, Math.min(10, -centerOffset * 20)); // clamp ±10px
      imgRef.current.style.transform = `translateY(${translate}px) scale(1.02)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const src = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop";

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-3xl ring-1 ring-rose-300/50 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
      <div className="aspect-[4/3] sm:aspect-[5/3] bg-rose-50 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={src} alt="Hero" className="h-full w-full object-cover transition-transform duration-200 will-change-transform" />
        {/* overlay gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-50/50 via-white/10 to-rose-100/50" />
        {/* subtle grain */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "3px 3px", color: "#000" }} />
      </div>
    </div>
  );
}

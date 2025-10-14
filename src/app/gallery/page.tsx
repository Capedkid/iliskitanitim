"use client";

import { useState } from "react";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";

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

interface Photo {
  id: number;
  src: string;
  caption: string;
  category: 'first-meeting' | 'special-days' | 'together' | 'memories';
  date: string;
  location?: string;
}

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Örnek fotoğraflar (gerçek fotoğraflarla değiştirilecek)
  const photos: Photo[] = [
    {
      id: 1,
      src: "https://source.unsplash.com/1000x1000/?couple,portrait&sig=101",
      caption: "Yanına geldim ;)",
      category: 'first-meeting',
      date: "",
      location: ""
    },
    {
      id: 2,
      src: "https://source.unsplash.com/1000x1000/?couple,walk&sig=102",
      caption: "Birlikte yürürken zaman yavaşlıyor",
      category: 'together',
      date: "",
      location: ""
    },
    {
      id: 3,
      src: "https://source.unsplash.com/1000x1000/?couple,celebration&sig=103",
      caption: "Özel günümüz - Küçük sürprizler, büyük gülüşler",
      category: 'special-days',
      date: "",
      location: ""
    },
    {
      id: 4,
      src: "https://source.unsplash.com/1000x1000/?couple,beach&sig=104",
      caption: "Sahilden güzel bir gün :)",
      category: 'memories',
      date: "",
      location: ""
    },
    {
      id: 5,
      src: "https://source.unsplash.com/1000x1000/?couple,candid&sig=105",
      caption: "Seni izlemek çok güzel",
      category: 'first-meeting',
      date: "",
      location: ""
    },
    {
      id: 6,
      src: "https://source.unsplash.com/1000x1000/?couple,coffee&sig=106",
      caption: "Türk kahvesi :)",
      category: 'together',
      date: "",
      location: ""
    },
    {
      id: 7,
      src: "https://source.unsplash.com/1000x1000/?couple,birthday&sig=107",
      caption: "Doğum günü sürprizi",
      category: 'special-days',
      date: "",
      location: ""
    },
    {
      id: 8,
      src: "https://source.unsplash.com/1000x1000/?couple,city&sig=108",
      caption: "Başbaşa olmak ne güzel... ♥",
      category: 'memories',
      date: "",
      location: ""
    }
  ];

  // Lightbox için fotoğrafları hazırla
  const lightboxImages = photos.map(photo => photo.src);
  const lightboxCaptions = photos.map(photo => `${photo.caption} - ${photo.date}${photo.location ? ` (${photo.location})` : ''}`);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  return (
    <div className="min-h-screen">
      {/* Ana sayfadaki gibi arka plan zaten globals.css'de tanımlı */}

      <div className="relative z-10">
        {/* Header - Ana sayfa gibi */}
        <header className="px-6 sm:px-10 py-6 flex items-center justify-between">
          <div className="font-display text-xl sm:text-2xl tracking-wide">
            <span className="text-ours-blue">İ</span>simBir <span className="text-ours-burgundy">&</span> <span className="text-black">İ</span>simİki
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="/" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Ana Sayfa
            </Link>
            <Link href="/messages" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Mesajlar
            </Link>
            <Link href="/special-days" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Özel Günler
            </Link>
            <Link href="/game/selection" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Oyun 💖
            </Link>
          </nav>
        </header>

        {/* Page Title Section */}
        <section className="px-6 sm:px-10 pt-10 pb-16 sm:pt-16 sm:pb-24">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="font-display text-[40px] leading-[1.08] sm:text-[56px] md:text-[64px] tracking-tight">
              Galeri
              <br />
              <span className="text-rose-600">📸</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-black/70 dark:text-white/80 max-w-prose leading-relaxed mx-auto">
              Birlikte yaşadığımız güzel anlar, mavinin huzuru ve bordonun tutkusu bir arada.
              Her fotoğraf bir hikaye, her anı bir hazine.
            </p>
            <div className="mt-6 text-sm text-black/60 dark:text-white/60">
              {photos.length} fotoğraf
            </div>
          </div>
          <div className="mt-10">
            <HeartDivider />
          </div>
        </section>

        <main className="px-6 sm:px-10 pb-10">
          <div className="max-w-6xl mx-auto">

            {/* Photo Grid */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {photos.map((photo, index) => (
                  <div key={photo.id} className="group">
                    <button
                      onClick={() => openLightbox(index)}
                      className="relative overflow-hidden rounded-2xl ring-1 ring-rose-300/50 hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full"
                    >
                      <div className="aspect-square relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          className="h-full w-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/20 via-white/5 to-rose-100/20" />
                        
                        
                        {/* Hover overlay (no icon/text) */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                    </button>
                    <div className="mt-3">
                      <h3 className="font-medium text-white text-sm leading-tight mb-1">
                        {photo.caption}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-display text-rose-600 mb-2">Henüz fotoğraf yok</h3>
                <p className="text-gray-600">
                  Galeriye fotoğraf eklemek için aşağıdaki butona tıklayın.
                </p>
              </div>
            )}

            
          </div>
        </main>

        <footer className="px-6 sm:px-10 pb-10 text-center text-sm">
          <div className="mx-auto max-w-5xl">
            <div className="mt-8">
              <HeartDivider />
            </div>
            <div className="mt-6 rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/40 p-6">
              <p className="text-white/80">“Kalbin kalbime değdiğinde, dünya sessizleşir.”</p>
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

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={lightboxImages}
        captions={lightboxCaptions}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </div>
  );
}

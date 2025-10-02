"use client";

import { useState, useRef, useEffect } from "react";
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
      src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
      caption: "İlk buluşmamız - Mavi ve bordo ilk kez bir arada",
      category: 'first-meeting',
      date: "2024-01-15",
      location: "Merkez Park"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
      caption: "Birlikte yürürken zaman yavaşlıyor",
      category: 'together',
      date: "2024-02-20",
      location: "Sahil Yolu"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop",
      caption: "Özel günümüz - Küçük sürprizler, büyük gülüşler",
      category: 'special-days',
      date: "2024-03-14",
      location: "Favori Kafe"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      caption: "Mavi ve bordo aynı karede",
      category: 'memories',
      date: "2024-04-10",
      location: "Ev"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1518621012425-65a5b8b8b8b8?q=80&w=800&auto=format&fit=crop",
      caption: "İlk kahve buluşmamız",
      category: 'first-meeting',
      date: "2024-01-20",
      location: "Starbucks"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop",
      caption: "Birlikte kitap okuma anımız",
      category: 'together',
      date: "2024-02-25",
      location: "Kütüphane"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
      caption: "Doğum günü sürprizi",
      category: 'special-days',
      date: "2024-03-20",
      location: "Restoran"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
      caption: "Gün batımı fotoğrafımız",
      category: 'memories',
      date: "2024-04-15",
      location: "Tepeler"
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
            <span className="text-ours-blue">R</span>avy <span className="text-ours-burgundy">&</span> <span className="text-black">M</span>ami
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
                        
                        {/* Date badge */}
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur text-white">
                            {new Date(photo.date).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
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

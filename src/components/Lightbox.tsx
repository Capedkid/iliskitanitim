"use client";

import { useEffect } from "react";

type LightboxProps = {
  isOpen: boolean;
  images: string[];
  captions?: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({ isOpen, images, captions = [], index, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, onPrev, onNext]);

  // Swipe support for mobile
  useEffect(() => {
    if (!isOpen) return;
    let startX = 0;
    let startY = 0;
    let isTouching = false;
    const onTouchStart = (e: TouchEvent) => {
      isTouching = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isTouching) return;
      isTouching = false;
      const endX = (e.changedTouches && e.changedTouches[0]?.clientX) || startX;
      const endY = (e.changedTouches && e.changedTouches[0]?.clientY) || startY;
      const dx = endX - startX;
      const dy = endY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) onPrev(); else onNext();
      }
    };
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [isOpen, onPrev, onNext]);

  if (!isOpen) return null;

  const src = images[index] ?? images[0];
  const caption = captions[index] ?? "";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <button aria-label="Close" className="absolute top-4 right-4 text-white/90 hover:text-white z-10" onClick={onClose}>
        ×
      </button>
      <button aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white text-2xl z-10" onClick={onPrev}>
        ‹
      </button>
      <div 
        className="max-w-5xl max-h-[80vh] p-2 bg-white/5 rounded-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Memory" className="max-h-[76vh] max-w-[78vw] object-contain rounded-lg" />
        {caption ? (
          <div className="mt-3 text-center text-white/90 text-sm">{caption}</div>
        ) : null}
      </div>
      <button aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white text-2xl z-10" onClick={onNext}>
        ›
      </button>
    </div>
  );
}



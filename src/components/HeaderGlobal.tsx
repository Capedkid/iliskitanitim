"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HeaderGlobal() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const panel = mobileMenuRef.current;
      const button = mobileMenuButtonRef.current;
      if (!panel) return;
      if (panel.contains(target)) return;
      if (button && button.contains(target)) return;
      setIsMobileMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="px-6 sm:px-10 py-6 flex items-center justify-between relative">
      <Link href="/" className="font-display text-xl sm:text-2xl tracking-wide hover:opacity-90 transition-opacity" aria-label="Ana sayfa">
        <span className="text-ours-blue">İ</span>simBir <span className="text-ours-burgundy">&</span> <span className="text-black">İ</span>simİki
      </Link>

      {/* Desktop nav */}
      <nav className="hidden sm:flex items-center gap-6 text-sm">
        <Link className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600" href="/">Ana Sayfa</Link>
        <Link className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600" href="/gallery">Galeri</Link>
        <Link className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600" href="/messages">Mesajlar</Link>
        <Link className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600" href="/special-days">Özel Günler</Link>
        <Link className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600" href="/game/selection">Oyun 💖</Link>
      </nav>

      {/* Mobile hamburger */}
      <div className="sm:hidden">
        <button
          ref={mobileMenuButtonRef}
          aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu-panel-global"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-black/40 backdrop-blur-md ring-1 ring-white/10 text-white/90 shadow-sm active:scale-95 transition-all"
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-full bg-rose-300 transition-transform duration-200 ease-out ${isMobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-full bg-rose-300 transition-all duration-150 ease-out ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`} />
            <span className={`absolute left-0 top-3 h-0.5 w-full bg-rose-300 transition-transform duration-200 ease-out ${isMobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
          </span>
        </button>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-menu-panel-global"
        ref={mobileMenuRef}
        className={`absolute right-6 top-full mt-3 w-[min(14rem,calc(100vw-1.5rem))] rounded-2xl bg-black/60 backdrop-blur-md ring-1 ring-white/10 shadow-xl overflow-hidden z-50 origin-top-right transition-all duration-200 ${isMobileMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        role="menu"
        aria-label="Mobil menü"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="p-1">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 text-white/90 transition-colors" role="menuitem">Ana Sayfa</Link>
          <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 text-white/90 transition-colors" role="menuitem">Galeri</Link>
          <Link href="/messages" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 text-white/90 transition-colors" role="menuitem">Mesajlar</Link>
          <Link href="/special-days" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 text-white/90 transition-colors" role="menuitem">Özel Günler</Link>
          <Link href="/game/selection" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 text-white/90 transition-colors" role="menuitem">Oyun</Link>
        </div>
      </div>
    </header>
  );
}



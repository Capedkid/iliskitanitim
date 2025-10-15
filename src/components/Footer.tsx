"use client";

import Link from "next/link";
import { useMiniPlayer } from "@/contexts/MiniPlayerContext";
import { usePathname } from "next/navigation";

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

export default function Footer() {
  const { hasStartedPlaying } = useMiniPlayer();
  const pathname = usePathname();
  const inGame = pathname?.startsWith("/game");
  return (
    <>
      <footer className="px-6 sm:px-10 pb-10 text-center text-sm">
        <div className="mx-auto max-w-5xl">
          <div className="mt-8">
            <HeartDivider />
          </div>
          <div className="mt-6 rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/40 p-6 relative">
            <p className="text-white/80">"Kalbin kalbime değdiğinde, dünya sessizleşir."</p>
            <div className="mt-3 text-white/60">
              <Link href="/" className="hover:text-rose-300 transition-colors">Ana Sayfa</Link>
              <span className="mx-2">·</span>
              <Link href="/gallery" className="hover:text-rose-300 transition-colors">Galeri</Link>
              <span className="mx-2">·</span>
              <Link href="/messages" className="hover:text-rose-300 transition-colors">Mesajlar</Link>
              <span className="mx-2">·</span>
              <Link href="/special-days" className="hover:text-rose-300 transition-colors">Özel Günler</Link>
              <span className="mx-2">·</span>
              <Link href="/game/selection" className="hover:text-rose-300 transition-colors">Oyun</Link>
            </div>

            {/* Scroll to top button */}
            <button
              type="button"
              aria-label="Yukarı dön"
              onClick={() => {
                try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { window.scrollTo(0, 0); }
              }}
              className="flex items-center justify-center text-white hover:text-rose-300 transition-colors absolute right-4 bottom-4"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 5l7 7M12 5L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
      {/* Spacer to allow scrolling past footer only when MiniPlayer is visible (non-game) */}
      {hasStartedPlaying && !inGame && (
        <div aria-hidden className="h-20 md:h-36" />
      )}
    </>
  );
}

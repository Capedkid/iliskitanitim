"use client";

import { useState } from "react";
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

interface SpecialDay {
  id: number;
  title: string;
  date: string;
  type: 'anniversary' | 'birthday' | 'holiday' | 'milestone';
  description: string;
  isRecurring: boolean;
  importance: 'high' | 'medium' | 'low';
  countdown?: number;
  emoji: string;
}

export default function SpecialDaysPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'countdown'>('calendar');

  // Örnek özel günler (gerçek tarihlerle değiştirilecek)
  const specialDays: SpecialDay[] = [
    {
      id: 1,
      title: "İlk Buluşma",
      date: "2024-01-01",
      type: 'anniversary',
      description: "İlk kez buluştuğumuz gün :)",
      isRecurring: true,
      importance: 'high',
      emoji: "💕"
    },
    {
      id: 4,
      title: "İsimİki'nin Doğum Günü",
      date: "2000-05-12",
      type: 'birthday',
      description: "İyi ki doğdun sevgilim :) İyi ki...",
      isRecurring: true,
      importance: 'high',
      emoji: "🎂"
    },
    {
      id: 5,
      title: "İsimBir'in Doğum Günü",
      date: "2000-05-12",
      type: 'birthday',
      description: ":)",
      isRecurring: true,
      importance: 'high',
      emoji: "🎂"
    },
    {
      id: 7,
      title: "6 Aylık Yıldönümü",
      date: "2024-06-01",
      type: 'anniversary',
      description: "6 aydır birlikte olduğumuz gün.",
      isRecurring: false,
      importance: 'medium',
      emoji: "🎉"
    },
    {
      id: 8,
      title: "1 Yıllık Yıldönümü",
      date: "2025-01-01",
      type: 'anniversary',
      description: "1 yıldır birlikte olduğumuz gün.",
      isRecurring: false,
      importance: 'high',
      emoji: "🎊"
    }
  ];

  const types = [
    { id: 'all', name: 'Tümü', icon: '📅', count: specialDays.length },
    { id: 'anniversary', name: 'Yıldönümü', icon: '💕', count: specialDays.filter(d => d.type === 'anniversary').length },
    { id: 'birthday', name: 'Doğum Günü', icon: '🎂', count: specialDays.filter(d => d.type === 'birthday').length },
  ];

  // Countdown hesaplama
  const calculateCountdown = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    
    // Bu yıl için tarihi ayarla
    targetDate.setFullYear(today.getFullYear());
    
    // Eğer tarih geçmişse, gelecek yıla ayarla
    if (targetDate < today) {
      targetDate.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Filtrelenmiş günler
  const filteredDays = specialDays.filter(day => {
    const matchesType = selectedType === 'all' || day.type === selectedType;
    return matchesType;
  }).map(day => ({
    ...day,
    countdown: calculateCountdown(day.date)
  })).sort((a, b) => {
    if (viewMode === 'countdown') {
      return a.countdown! - b.countdown!;
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Yaklaşan günler (30 gün içinde)
  const upcomingDays = filteredDays.filter(day => day.countdown! <= 30);

  // Bugünkü günler
  const todayDays = filteredDays.filter(day => day.countdown === 0);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCountdownText = (days: number) => {
    if (days === 0) return "Bugün! 🎉";
    if (days === 1) return "Yarın! ⏰";
    if (days <= 7) return `${days} gün kaldı! ⏳`;
    if (days <= 30) return `${days} gün kaldı 📅`;
    return `${days} gün kaldı 📆`;
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
            <Link href="/gallery" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Galeri
            </Link>
            <Link href="/messages" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Mesajlar
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
              Özel Günler
              <br />
              <span className="text-rose-600">📅</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-black/70 dark:text-white/80 max-w-prose leading-relaxed mx-auto">
              Yıldönümleri ve önemli tarihler. Mavinin huzuru ve bordonun tutkusu 
              özel günlerde bir araya geliyor. Her tarih bir anı, her anı bir hazine.
            </p>
            <div className="mt-6 text-sm text-black/60 dark:text-white/60">
              {filteredDays.length} özel gün
            </div>
          </div>
          <div className="mt-10">
            <HeartDivider />
          </div>
        </section>

        <main className="px-6 sm:px-10 pb-10">
          <div className="max-w-6xl mx-auto">
            {/* Today's Special Days */}
            {todayDays.length > 0 && (
              <div className="mb-8">
                <div className="rounded-3xl bg-black/30 backdrop-blur ring-1 ring-rose-300/50 p-6 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
                  <h2 className="text-2xl font-display tracking-wide text-white mb-4">🎉 Bugün Özel Günler!</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {todayDays.map(day => (
                      <div key={day.id} className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/30 p-4 transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{day.emoji}</span>
                          <h3 className="font-display text-lg tracking-wide text-white">{day.title}</h3>
                        </div>
                        <p className="text-white/80 text-sm">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Days */}
            {upcomingDays.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-display tracking-wide text-white mb-4">⏰ Yaklaşan Günler (30 gün)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingDays.slice(0, 6).map(day => (
                    <div key={day.id} className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{day.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-display text-lg tracking-wide text-white">{day.title}</h3>
                          <p className="text-sm text-white/60">{formatDate(day.date)}</p>
                        </div>
                      </div>
                      <p className="text-sm text-white/80 mb-2">{day.description}</p>
                      <div className="text-center">
                        <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-sm font-medium">
                          {getCountdownText(day.countdown!)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'calendar' 
                      ? 'bg-rose-500 text-white shadow-lg' 
                      : 'text-white/60 hover:text-white hover:bg-black/20'
                  }`}
                >
                  📅 Takvim
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-rose-500 text-white shadow-lg' 
                      : 'text-white/60 hover:text-white hover:bg-black/20'
                  }`}
                >
                  📋 Liste
                </button>
                <button
                  onClick={() => setViewMode('countdown')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'countdown' 
                      ? 'bg-rose-500 text-white shadow-lg' 
                      : 'text-white/60 hover:text-white hover:bg-black/20'
                  }`}
                >
                  ⏰ Countdown
                </button>
              </div>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {types.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                    selectedType === type.id
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 text-white/80 hover:bg-black/30 hover:text-white hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]'
                  }`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.name} ({type.count})
                </button>
              ))}
            </div>

            {/* Special Days Display */}
            {filteredDays.length > 0 ? (
              viewMode === 'calendar' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDays.map(day => (
                    <div key={day.id} className="group">
                      <div className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] h-full">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-3xl">{day.emoji}</span>
                          <div>
                            <h3 className="font-display text-lg tracking-wide text-white mb-1">
                              {day.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <span>{types.find(t => t.id === day.type)?.icon}</span>
                              <span>{types.find(t => t.id === day.type)?.name}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <p className="text-white/80 leading-relaxed mb-4">
                          {day.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-white/60">
                            📅 {formatDate(day.date)}
                          </div>
                          <div className="text-sm font-medium text-rose-400">
                            {getCountdownText(day.countdown!)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : viewMode === 'list' ? (
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-4">
                    {filteredDays.map(day => (
                      <div key={day.id} className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{day.emoji}</span>
                          <div className="flex-1">
                            <div className="mb-2">
                              <h3 className="font-display text-xl tracking-wide text-white">
                                {day.title}
                              </h3>
                            </div>
                            <p className="text-white/80 mb-2">{day.description}</p>
                            <div className="flex items-center gap-4 text-sm text-white/60">
                              <span>{types.find(t => t.id === day.type)?.icon} {types.find(t => t.id === day.type)?.name}</span>
                              <span>📅 {formatDate(day.date)}</span>
                              <span>{day.isRecurring ? '🔄 Tekrarlanan' : '📌 Tek seferlik'}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-rose-400">
                              {getCountdownText(day.countdown!)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-4">
                    {filteredDays.map(day => (
                      <div key={day.id} className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-rose-400 mb-1">
                              {day.countdown}
                            </div>
                            <div className="text-xs text-white/60">gün</div>
                          </div>
                          <span className="text-3xl">{day.emoji}</span>
                          <div className="flex-1">
                            <h3 className="font-display text-xl tracking-wide text-white mb-1">
                              {day.title}
                            </h3>
                            <p className="text-white/80 mb-2">{day.description}</p>
                            <div className="flex items-center gap-4 text-sm text-white/60">
                              <span>📅 {formatDate(day.date)}</span>
                              <span>{types.find(t => t.id === day.type)?.icon} {types.find(t => t.id === day.type)?.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-display text-rose-600 mb-2">Özel gün bulunamadı</h3>
                <p className="text-gray-600">
                  Bu kategoride henüz özel gün yok.
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
    </div>
  );
}

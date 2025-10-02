"use client";

import { useState, useEffect } from "react";
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'countdown'>('calendar');

  // Örnek özel günler (gerçek tarihlerle değiştirilecek)
  const specialDays: SpecialDay[] = [
    {
      id: 1,
      title: "İlk Buluşma",
      date: "2024-01-15",
      type: 'anniversary',
      description: "İlk kez buluştuğumuz gün. Mavi ve bordo ilk kez bir araya geldi.",
      isRecurring: true,
      importance: 'high',
      emoji: "💕"
    },
    {
      id: 2,
      title: "İlk Öpücük",
      date: "2024-01-20",
      type: 'milestone',
      description: "İlk öpücüğümüz. Kalplerin ilk kıvılcımı.",
      isRecurring: true,
      importance: 'high',
      emoji: "💋"
    },
    {
      id: 3,
      title: "Birlikte Yaşamaya Başlama",
      date: "2024-03-01",
      type: 'milestone',
      description: "Aynı çatı altında yaşamaya başladığımız gün.",
      isRecurring: true,
      importance: 'high',
      emoji: "🏠"
    },
    {
      id: 4,
      title: "Ravi'nin Doğum Günü",
      date: "2024-06-15",
      type: 'birthday',
      description: "Mavi karakterin doğum günü. Her yıl kutlanır.",
      isRecurring: true,
      importance: 'high',
      emoji: "🎂"
    },
    {
      id: 5,
      title: "Mami'nin Doğum Günü",
      date: "2024-09-22",
      type: 'birthday',
      description: "Bordo karakterin doğum günü. Her yıl kutlanır.",
      isRecurring: true,
      importance: 'high',
      emoji: "🎂"
    },
    {
      id: 6,
      title: "Sevgililer Günü",
      date: "2024-02-14",
      type: 'holiday',
      description: "Aşkımızı kutladığımız özel gün.",
      isRecurring: true,
      importance: 'medium',
      emoji: "💖"
    },
    {
      id: 7,
      title: "6 Aylık Yıldönümü",
      date: "2024-07-15",
      type: 'anniversary',
      description: "6 aydır birlikte olduğumuz gün.",
      isRecurring: false,
      importance: 'medium',
      emoji: "🎉"
    },
    {
      id: 8,
      title: "1 Yıllık Yıldönümü",
      date: "2025-01-15",
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
    { id: 'holiday', name: 'Özel Gün', icon: '🎉', count: specialDays.filter(d => d.type === 'holiday').length },
    { id: 'milestone', name: 'Kilometre Taşı', icon: '🏆', count: specialDays.filter(d => d.type === 'milestone').length }
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

  // Tarih güncelleme
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000 * 60 * 60); // Her saat güncelle

    return () => clearInterval(timer);
  }, []);

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

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'low': return 'text-blue-500 bg-blue-50 border-blue-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
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
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
                  <h2 className="text-2xl font-display mb-4">🎉 Bugün Özel Günler!</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {todayDays.map(day => (
                      <div key={day.id} className="bg-white/20 backdrop-blur rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{day.emoji}</span>
                          <h3 className="font-semibold text-lg">{day.title}</h3>
                        </div>
                        <p className="text-white/90 text-sm">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Days */}
            {upcomingDays.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-display text-rose-600 mb-4">⏰ Yaklaşan Günler (30 gün)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingDays.slice(0, 6).map(day => (
                    <div key={day.id} className="bg-white/70 backdrop-blur rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{day.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-rose-600">{day.title}</h3>
                          <p className="text-sm text-gray-500">{formatDate(day.date)}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{day.description}</p>
                      <div className="text-center">
                        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-medium">
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
              <div className="bg-white/70 backdrop-blur rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'calendar' 
                      ? 'bg-rose-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-rose-600'
                  }`}
                >
                  📅 Takvim
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-rose-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-rose-600'
                  }`}
                >
                  📋 Liste
                </button>
                <button
                  onClick={() => setViewMode('countdown')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'countdown' 
                      ? 'bg-rose-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-rose-600'
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedType === type.id
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-white/70 text-gray-700 hover:bg-rose-100 hover:text-rose-700'
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
                      <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{day.emoji}</span>
                            <div>
                              <h3 className="font-display text-lg text-rose-600 mb-1">
                                {day.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{types.find(t => t.id === day.type)?.icon}</span>
                                <span>{types.find(t => t.id === day.type)?.name}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImportanceColor(day.importance)}`}>
                            {day.importance === 'high' ? 'Yüksek' : day.importance === 'medium' ? 'Orta' : 'Düşük'}
                          </span>
                        </div>

                        {/* Content */}
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {day.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            📅 {formatDate(day.date)}
                          </div>
                          <div className="text-sm font-medium text-rose-600">
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
                      <div key={day.id} className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{day.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-display text-xl text-rose-600">
                                {day.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImportanceColor(day.importance)}`}>
                                {day.importance === 'high' ? 'Yüksek' : day.importance === 'medium' ? 'Orta' : 'Düşük'}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{day.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{types.find(t => t.id === day.type)?.icon} {types.find(t => t.id === day.type)?.name}</span>
                              <span>📅 {formatDate(day.date)}</span>
                              <span>{day.isRecurring ? '🔄 Tekrarlanan' : '📌 Tek seferlik'}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-rose-600">
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
                      <div key={day.id} className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-rose-600 mb-1">
                              {day.countdown}
                            </div>
                            <div className="text-xs text-gray-500">gün</div>
                          </div>
                          <span className="text-3xl">{day.emoji}</span>
                          <div className="flex-1">
                            <h3 className="font-display text-xl text-rose-600 mb-1">
                              {day.title}
                            </h3>
                            <p className="text-gray-700 mb-2">{day.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
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

            {/* Add Special Day Button - Ana sayfa stili */}
            <div className="mt-12 text-center">
              <button className="inline-flex items-center justify-center rounded-full px-5 py-3 bg-rose-500 text-white shadow-sm shadow-rose-500/30 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all duration-200">
                <span className="mr-2">➕</span>
                Özel Gün Ekle
              </button>
              <p className="text-sm text-black/60 dark:text-white/60 mt-3">
                Yeni yıldönümü veya özel gün eklemek için bu butona tıklayın
              </p>
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

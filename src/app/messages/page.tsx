"use client";

import { useState, useRef } from "react";
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

interface Message {
  id: number;
  title: string;
  content: string;
  category: 'daily' | 'weekly' | 'special' | 'love-notes';
  date: string;
  mood: 'happy' | 'romantic' | 'sweet' | 'dreamy';
  isFavorite: boolean;
  author: 'ravi' | 'mami';
}

export default function MessagesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Örnek mesajlar (gerçek mesajlarla değiştirilecek)
  const messages: Message[] = [
    {
      id: 1,
      title: "Sabah Mesajı",
      content: "Güne senin sesinle başlamak, günün en güzel kısmı. Mavi gökyüzü gibi huzurlu, bordo gül gibi tutkulu bir gün olsun.",
      category: 'daily',
      date: "2024-01-15",
      mood: 'romantic',
      isFavorite: true,
      author: 'ravi'
    },
    {
      id: 2,
      title: "Akşam Notu",
      content: "Bugün de seninle geçirdiğim her an özeldi. Birlikte yürürken zaman yavaşlıyor, sanki sadece ikimiz varız dünyada.",
      category: 'daily',
      date: "2024-01-16",
      mood: 'sweet',
      isFavorite: false,
      author: 'mami'
    },
    {
      id: 3,
      title: "Haftalık Değerlendirme",
      content: "Bu hafta birlikte yaşadığımız güzel anlar... Her biri birer hazine. Seninle her gün yeni bir hikaye yazıyoruz.",
      category: 'weekly',
      date: "2024-01-20",
      mood: 'happy',
      isFavorite: true,
      author: 'ravi'
    },
    {
      id: 4,
      title: "Özel Gün Mesajı",
      content: "Bugün bizim özel günümüz! Kalplerin ilk kıvılcımından bugüne kadar geçen süre... Her anı değerli, her saniye özel.",
      category: 'special',
      date: "2024-02-14",
      mood: 'romantic',
      isFavorite: true,
      author: 'mami'
    },
    {
      id: 5,
      title: "Aşk Mektubu",
      content: "Mavinin huzuru, bordonun tutkusu... İkisi bir araya gelince aşk oluyor. Sen benim mavim, ben senin bordonun.",
      category: 'love-notes',
      date: "2024-02-20",
      mood: 'dreamy',
      isFavorite: true,
      author: 'ravi'
    },
    {
      id: 6,
      title: "Günlük Not",
      content: "Küçük sürprizler, büyük gülüşler... Seninle her an böyle. Uzak değil, sadece adım adım ilerliyoruz birlikte.",
      category: 'daily',
      date: "2024-02-25",
      mood: 'sweet',
      isFavorite: false,
      author: 'mami'
    },
    {
      id: 7,
      title: "Hafta Sonu Mesajı",
      content: "Birlikte geçirdiğimiz hafta sonu... Mavi ve bordo aynı karede, aynı anda nefes alıyoruz, aynı rüyaları görüyoruz.",
      category: 'weekly',
      date: "2024-03-02",
      mood: 'happy',
      isFavorite: false,
      author: 'ravi'
    },
    {
      id: 8,
      title: "Doğum Günü Mesajı",
      content: "Doğum günün kutlu olsun! Senin doğduğun gün, benim için de yeni bir başlangıç oldu. Seninle tanışmak, hayatımın en güzel hediyesi.",
      category: 'special',
      date: "2024-03-15",
      mood: 'romantic',
      isFavorite: true,
      author: 'mami'
    }
  ];

  

  // Tüm mesajları göster
  const filteredMessages = messages;

  const toggleFavorite = (messageId: number) => {
    // Bu fonksiyon gerçek uygulamada state'i güncelleyecek
    console.log('Toggle favorite:', messageId);
  };

  const openMessageModal = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const printMessage = (message: Message) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${message.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; }
              .title { font-size: 24px; color: #e11d48; margin-bottom: 10px; }
              .date { color: #666; font-size: 14px; }
              .content { font-size: 16px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">${message.title}</div>
              <div class="date">${new Date(message.date).toLocaleDateString('tr-TR')}</div>
            </div>
            <div class="content">${message.content}</div>
            <div class="footer">
              <p>Ravy & Mami - Aşk Mektupları</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
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
              Mesajlar
              <br />
              <span className="text-rose-600">💌</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-black/70 dark:text-white/80 max-w-prose leading-relaxed mx-auto">
              Romantik notlar ve aşk mektupları. Mavinin huzuru ve bordonun tutkusu 
              kelimelerde bir araya geliyor. Her mesaj bir hikaye, her kelime bir aşk.
            </p>
            <div className="mt-6 text-sm text-black/60 dark:text-white/60">
              {filteredMessages.length} mesaj
            </div>
          </div>
          <div className="mt-10">
            <HeartDivider />
          </div>
        </section>

        <main className="px-6 sm:px-10 pb-10">
          <div className="max-w-6xl mx-auto">
            {/* View Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-rose-500 text-white shadow-lg' 
                      : 'text-white/60 hover:text-white hover:bg-black/20'
                  }`}
                >
                  📋 Grid
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    viewMode === 'timeline' 
                      ? 'bg-rose-500 text-white shadow-lg' 
                      : 'text-white/60 hover:text-white hover:bg-black/20'
                  }`}
                >
                  📅 Timeline
                </button>
              </div>
            </div>

            {/* Messages Display */}
            {filteredMessages.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMessages.map(message => (
                    <div key={message.id} className="group">
                      <div className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)] h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-display text-lg tracking-wide text-white mb-1">
                              {message.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <span>{new Date(message.date).toLocaleDateString('tr-TR')}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleFavorite(message.id)}
                              className={`text-lg transition-colors ${
                                message.isFavorite ? 'text-yellow-500' : 'text-white/40 hover:text-yellow-400'
                              }`}
                            >
                              ⭐
                            </button>
                            <button
                              onClick={() => printMessage(message)}
                              className="text-white/40 hover:text-rose-400 transition-colors"
                            >
                              🖨️
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <p className="text-white/80 leading-relaxed mb-4 line-clamp-4">
                          {message.content}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">
                              {message.author === 'ravi' ? '👨 Ravi' : '👩 Mami'}
                            </span>
                          </div>
                          <button 
                            onClick={() => openMessageModal(message)}
                            className="text-rose-400 hover:text-rose-300 text-sm font-medium transition-colors"
                          >
                            Devamını Oku →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-rose-200"></div>
                    
                    {filteredMessages.map((message, index) => (
                      <div key={message.id} className="relative flex items-start gap-6 mb-8">
                        {/* Timeline Dot */}
                        <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {new Date(message.date).getDate()}
                        </div>
                        
                        {/* Message Card */}
                        <div className="flex-1 rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-display text-xl tracking-wide text-white mb-2">
                                {message.title}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-white/60">
                                <span>{new Date(message.date).toLocaleDateString('tr-TR', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleFavorite(message.id)}
                                className={`text-lg transition-colors ${
                                  message.isFavorite ? 'text-yellow-500' : 'text-white/40 hover:text-yellow-400'
                                }`}
                              >
                                ⭐
                              </button>
                              <button
                                onClick={() => printMessage(message)}
                                className="text-white/40 hover:text-rose-400 transition-colors"
                              >
                                🖨️
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-white/80 leading-relaxed mb-4">
                            {message.content}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white/60">
                                {message.author === 'ravi' ? '👨 Ravi' : '👩 Mami'}
                              </span>
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
                <div className="text-6xl mb-4">💌</div>
                <h3 className="text-xl font-display text-rose-600 mb-2">Henüz mesaj yok</h3>
                <p className="text-gray-600">
                  Mesajlar burada görünecek.
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

      {/* Message Modal */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMessageModal}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="rounded-3xl bg-black/30 backdrop-blur ring-1 ring-rose-300/50 p-8 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="font-display text-2xl tracking-wide text-white mb-2">
                    {selectedMessage.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span>{new Date(selectedMessage.date).toLocaleDateString('tr-TR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span>•</span>
                    <span>{selectedMessage.author === 'ravi' ? '👨 Ravi' : '👩 Mami'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleFavorite(selectedMessage.id)}
                    className={`text-xl transition-colors ${
                      selectedMessage.isFavorite ? 'text-yellow-500' : 'text-white/40 hover:text-yellow-400'
                    }`}
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => printMessage(selectedMessage)}
                    className="text-white/40 hover:text-rose-400 transition-colors text-lg"
                  >
                    🖨️
                  </button>
                  <button
                    onClick={closeMessageModal}
                    className="text-white/40 hover:text-white transition-colors text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <p className="text-white/90 leading-relaxed text-lg">
                  {selectedMessage.content}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/50">
                    Ravy & Mami - Aşk Mektupları
                  </div>
                  <button
                    onClick={closeMessageModal}
                    className="px-6 py-2 bg-rose-500/20 text-rose-300 rounded-full hover:bg-rose-500/30 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
